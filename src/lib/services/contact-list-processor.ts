import { supabase } from "@/integrations/supabase/client";

export interface ParsedContact {
  phone: string;
  name?: string;
  isValid: boolean;
  error?: string;
}

export interface ProcessingResult {
  total: number;
  valid: number;
  invalid: number;
  contacts: ParsedContact[];
}

export class ContactListProcessor {
  /**
   * Validates and normalizes a phone number
   */
  static normalizePhone(phone: string): { normalized: string; isValid: boolean } {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Remove leading + if present
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    
    // Brazilian phone validation (minimum 10 digits with DDD, max 13 with country code)
    const isValid = cleaned.length >= 10 && cleaned.length <= 13;
    
    // Add Brazil country code if not present
    if (cleaned.length === 10 || cleaned.length === 11) {
      cleaned = '55' + cleaned;
    }
    
    return { normalized: cleaned, isValid };
  }

  /**
   * Parses CSV content and extracts contacts
   */
  static parseCSV(content: string): ParsedContact[] {
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    const contacts: ParsedContact[] = [];
    
    // Skip header if present
    const startIndex = lines[0]?.toLowerCase().includes('phone') || 
                       lines[0]?.toLowerCase().includes('telefone') ||
                       lines[0]?.toLowerCase().includes('nome') ||
                       lines[0]?.toLowerCase().includes('name') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Try to split by common delimiters
      const parts = line.split(/[,;|\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));
      
      let phone = '';
      let name = '';
      
      // Find phone number in parts
      for (const part of parts) {
        const potentialPhone = part.replace(/[^\d+]/g, '');
        if (potentialPhone.length >= 10) {
          phone = part;
          break;
        }
      }
      
      // If phone found, look for name
      if (phone) {
        for (const part of parts) {
          if (part !== phone && part.length > 0 && !/^\d+$/.test(part.replace(/[^\d]/g, ''))) {
            name = part;
            break;
          }
        }
      } else {
        // Maybe it's just a phone number
        const potentialPhone = line.replace(/[^\d+]/g, '');
        if (potentialPhone.length >= 10) {
          phone = line;
        }
      }
      
      if (phone) {
        const { normalized, isValid } = this.normalizePhone(phone);
        contacts.push({
          phone: normalized,
          name: name || undefined,
          isValid,
          error: isValid ? undefined : 'Número inválido'
        });
      }
    }
    
    return contacts;
  }

  /**
   * Parses TXT content (one phone per line or with names)
   */
  static parseTXT(content: string): ParsedContact[] {
    return this.parseCSV(content); // Same logic works for TXT
  }

  /**
   * Process file content based on type
   */
  static processFile(content: string, fileType: string): ProcessingResult {
    let contacts: ParsedContact[];
    
    if (fileType === 'text/csv' || fileType.includes('csv')) {
      contacts = this.parseCSV(content);
    } else {
      contacts = this.parseTXT(content);
    }
    
    const valid = contacts.filter(c => c.isValid).length;
    const invalid = contacts.filter(c => !c.isValid).length;
    
    return {
      total: contacts.length,
      valid,
      invalid,
      contacts
    };
  }

  /**
   * Save processed contacts to database
   */
  static async saveContacts(
    userId: string, 
    contacts: ParsedContact[], 
    source: string = 'upload'
  ): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    
    const validContacts = contacts.filter(c => c.isValid);
    
    for (const contact of validContacts) {
      try {
        // Check if contact already exists
        const { data: existing } = await supabase
          .from('whatsapp_contacts')
          .select('id')
          .eq('user_id', userId)
          .eq('phone', contact.phone)
          .maybeSingle();
        
        if (existing) {
          // Update existing contact
          const { error } = await supabase
            .from('whatsapp_contacts')
            .update({ name: contact.name || existing.id })
            .eq('id', existing.id);
          
          if (error) throw error;
        } else {
          // Insert new contact
          const { error } = await supabase
            .from('whatsapp_contacts')
            .insert({
              user_id: userId,
              phone: contact.phone,
              name: contact.name,
              source,
              is_valid: true
            });
          
          if (error) throw error;
        }
        success++;
      } catch (error) {
        console.error('Error saving contact:', error);
        failed++;
      }
    }
    
    return { success, failed };
  }

  /**
   * Upload file to storage and create list record
   */
  static async uploadAndProcess(
    userId: string,
    file: File,
    listName: string
  ): Promise<{ listId: string; result: ProcessingResult }> {
    // Upload file to storage
    const filePath = `${userId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('contact-lists')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }
    
    // Get file URL
    const { data: urlData } = supabase.storage
      .from('contact-lists')
      .getPublicUrl(filePath);
    
    // Create list record
    const { data: listData, error: listError } = await supabase
      .from('contact_lists')
      .insert({
        user_id: userId,
        name: listName,
        file_url: urlData.publicUrl,
        status: 'processing'
      })
      .select()
      .single();
    
    if (listError) {
      throw new Error(`Erro ao criar lista: ${listError.message}`);
    }
    
    // Read and process file content
    const content = await file.text();
    const result = this.processFile(content, file.type);
    
    // Save contacts
    await this.saveContacts(userId, result.contacts, `list:${listData.id}`);
    
    // Update list status
    await supabase
      .from('contact_lists')
      .update({
        status: 'completed',
        total_contacts: result.total,
        valid_contacts: result.valid,
        invalid_contacts: result.invalid,
        processed_at: new Date().toISOString()
      })
      .eq('id', listData.id);
    
    return { listId: listData.id, result };
  }
}
