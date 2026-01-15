import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const evolutionApiUrl = Deno.env.get("EVOLUTION_API_URL") || "https://evo.tocadaoncaroupa.com";
    const evolutionApiKey = Deno.env.get("EVOLUTION_API_KEY") || "A9F3C2E7D4B8416FA0C5E91B7D2F6A8C";

    console.log("Evolution API URL:", evolutionApiUrl ? "configured" : "missing");
    console.log("Evolution API Key:", evolutionApiKey ? "configured" : "missing");

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await req.json();
    const { action, instanceId, instanceName, userId } = body;

    // Create new instance
    if (action === "create") {
      const response = await fetch(`${evolutionApiUrl}/instance/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionApiKey,
        },
        body: JSON.stringify({
          instanceName,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(JSON.stringify({ error: data }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Save instance to database
      const { data: savedInstance, error: dbError } = await supabase
        .from("whatsapp_instances")
        .insert({
          user_id: userId,
          instance_name: instanceName,
          status: "qr_pending",
          qr_code: data.qrcode?.base64 || null,
        })
        .select()
        .single();

      if (dbError) {
        return new Response(JSON.stringify({ error: dbError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Set webhook
      const webhookUrl = `${supabaseUrl}/functions/v1/whatsapp-webhook`;
      await fetch(`${evolutionApiUrl}/webhook/set/${instanceName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionApiKey,
        },
        body: JSON.stringify({
          enabled: true,
          url: webhookUrl,
          webhookByEvents: false,
          events: [
            "MESSAGES_UPSERT",
            "MESSAGES_UPDATE",
            "CONNECTION_UPDATE",
            "CONTACTS_UPDATE",
          ],
        }),
      });

      return new Response(JSON.stringify({ instance: savedInstance, qrcode: data.qrcode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get QR Code
    if (action === "qrcode") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Fetching QR code for instance: ${instance.instance_name}`);
      
      const response = await fetch(`${evolutionApiUrl}/instance/connect/${instance.instance_name}`, {
        method: "GET",
        headers: { apikey: evolutionApiKey },
      });

      const data = await response.json();
      console.log("Evolution API response:", JSON.stringify(data).substring(0, 200));

      // Handle different response formats from Evolution API
      let qrCodeBase64 = null;
      let status = 'qr_pending';
      
      if (data.instance?.state === 'open') {
        status = 'connected';
      } else if (data.base64) {
        qrCodeBase64 = data.base64;
      } else if (data.qrcode?.base64) {
        qrCodeBase64 = data.qrcode.base64;
      }

      // Update database
      if (qrCodeBase64 || status === 'connected') {
        await supabase
          .from("whatsapp_instances")
          .update({ 
            qr_code: qrCodeBase64, 
            status: status,
            last_connected_at: status === 'connected' ? new Date().toISOString() : undefined
          })
          .eq("id", instanceId);
      }

      return new Response(JSON.stringify({ 
        qrCode: qrCodeBase64,
        status: status,
        message: status === 'connected' ? 'Instância já conectada' : 'QR Code gerado'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check connection status
    if (action === "status") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const response = await fetch(
        `${evolutionApiUrl}/instance/connectionState/${instance.instance_name}`,
        {
          method: "GET",
          headers: { apikey: evolutionApiKey },
        }
      );

      const data = await response.json();

      // Update status in database
      const statusMap: Record<string, string> = {
        open: "connected",
        close: "disconnected",
        connecting: "connecting",
      };

      const newStatus = statusMap[data.state] || "disconnected";
      await supabase
        .from("whatsapp_instances")
        .update({ status: newStatus })
        .eq("id", instanceId);

      return new Response(JSON.stringify({ ...data, dbStatus: newStatus }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Logout/disconnect
    if (action === "logout") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await fetch(`${evolutionApiUrl}/instance/logout/${instance.instance_name}`, {
        method: "DELETE",
        headers: { apikey: evolutionApiKey },
      });

      await supabase
        .from("whatsapp_instances")
        .update({ status: "disconnected", qr_code: null, phone_number: null })
        .eq("id", instanceId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Delete instance
    if (action === "delete") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name")
        .eq("id", instanceId)
        .single();

      if (instance) {
        await fetch(`${evolutionApiUrl}/instance/delete/${instance.instance_name}`, {
          method: "DELETE",
          headers: { apikey: evolutionApiKey },
        });
      }

      await supabase.from("whatsapp_instances").delete().eq("id", instanceId);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch contacts from WhatsApp
    if (action === "fetchContacts") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name, user_id")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const response = await fetch(
        `${evolutionApiUrl}/chat/fetchContacts/${instance.instance_name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: evolutionApiKey,
          },
          body: JSON.stringify({}),
        }
      );

      const contacts = await response.json();

      // Save contacts to database
      if (Array.isArray(contacts)) {
        for (const contact of contacts) {
          const phone = contact.id?.replace("@s.whatsapp.net", "") || "";
          if (phone && !phone.includes("@g.us")) {
            await supabase.from("whatsapp_contacts").upsert(
              {
                user_id: instance.user_id,
                phone,
                name: contact.name || contact.pushName || null,
                source: "whatsapp",
                profile_picture: contact.profilePictureUrl || null,
                last_seen: new Date().toISOString(),
              },
              { onConflict: "user_id,phone", ignoreDuplicates: false }
            );
          }
        }
      }

      return new Response(JSON.stringify({ imported: contacts?.length || 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch groups
    if (action === "fetchGroups") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name, user_id")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`Fetching groups for instance: ${instance.instance_name}`);
      
      // Try the correct Evolution API endpoint
      const apiUrl = `${evolutionApiUrl}/group/fetchAllGroups/${instance.instance_name}?getParticipants=false`;
      console.log(`Evolution URL: ${apiUrl}`);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { 
            apikey: evolutionApiKey,
            "Content-Type": "application/json"
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const responseText = await response.text();
        console.log(`Response status: ${response.status}`);
        console.log(`Response preview: ${responseText.substring(0, 800)}`);

        let rawData;
        try {
          rawData = JSON.parse(responseText);
        } catch {
          console.log("Failed to parse JSON response");
          return new Response(JSON.stringify({ error: "Resposta inválida da API", groups: 0 }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check for API errors
        if (rawData.status && rawData.error) {
          console.log(`Evolution API error: ${rawData.error}`);
          return new Response(JSON.stringify({ error: rawData.response?.message || rawData.error, groups: 0 }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Evolution API can return groups in different formats
        let groups: any[] = [];
        if (Array.isArray(rawData)) {
          groups = rawData;
        } else if (rawData?.groups && Array.isArray(rawData.groups)) {
          groups = rawData.groups;
        } else if (rawData?.data && Array.isArray(rawData.data)) {
          groups = rawData.data;
        }

        console.log(`Found ${groups.length} groups`);

        // Save groups to database
        let savedCount = 0;
        for (const group of groups) {
          // Handle different field names from Evolution API
          const groupJid = group.id || group.jid || group.remoteJid;
          const groupName = group.subject || group.name || "Sem nome";
          const groupDesc = group.desc || group.description || null;
          const groupSize = group.size || group.participants?.length || 0;
          const isAdmin = group.announce === false || group.admin === true || false;

          if (groupJid) {
            const { error } = await supabase.from("whatsapp_groups").upsert(
              {
                user_id: instance.user_id,
                instance_id: instanceId,
                group_jid: groupJid,
                name: groupName,
                description: groupDesc,
                participants_count: groupSize,
                is_admin: isAdmin,
                extracted_at: new Date().toISOString(),
              },
              { onConflict: "user_id,group_jid" }
            );
            if (!error) savedCount++;
            else console.log(`Error saving group ${groupJid}:`, error.message);
          }
        }

        console.log(`Saved ${savedCount} groups to database`);

        return new Response(JSON.stringify({ groups: savedCount, total: groups.length }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } catch (fetchError) {
        console.log("Fetch error:", fetchError instanceof Error ? fetchError.message : "Unknown");
        return new Response(JSON.stringify({ 
          error: fetchError instanceof Error ? fetchError.message : "Erro ao buscar grupos",
          groups: 0 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // List all instances from Evolution API (for debugging)
    if (action === "listEvolutionInstances") {
      console.log(`=== LISTING ALL EVOLUTION INSTANCES ===`);
      const url = `${evolutionApiUrl}/instance/fetchInstances`;
      console.log(`URL: ${url}`);
      
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { apikey: evolutionApiKey }
        });
        
        const text = await response.text();
        console.log(`Response status: ${response.status}`);
        console.log(`Response: ${text.substring(0, 1000)}`);
        
        const data = JSON.parse(text);
        
        return new Response(JSON.stringify({ instances: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.log(`Error: ${err instanceof Error ? err.message : 'unknown'}`);
        return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Get instance statistics from Evolution API
    if (action === "stats") {
      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name, phone_number")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log(`=== STATS DEBUG START ===`);
      console.log(`Instance from DB: ${instance.instance_name}`);
      console.log(`Phone from DB: ${instance.phone_number}`);
      console.log(`Evolution URL: ${evolutionApiUrl}`);
      
      // First, list all instances to find the correct name
      let actualInstanceName = instance.instance_name;
      try {
        const listRes = await fetch(`${evolutionApiUrl}/instance/fetchInstances`, {
          method: "GET",
          headers: { apikey: evolutionApiKey }
        });
        const listData = await listRes.json();
        console.log(`[INSTANCES] Raw response: ${JSON.stringify(listData).substring(0, 500)}`);
        console.log(`[INSTANCES] Found ${Array.isArray(listData) ? listData.length : 'N/A'} instances`);
        
        if (Array.isArray(listData) && listData.length > 0) {
          // Log all instance names with all details
          listData.forEach((inst: any, idx: number) => {
            const instName = inst.instance?.instanceName || inst.name || inst.instanceName;
            const instState = inst.instance?.state || inst.state;
            const instOwner = inst.instance?.owner || inst.owner;
            console.log(`[INSTANCE ${idx}] Name: ${instName}, State: ${instState}, Owner: ${instOwner}`);
          });
          
          // Strategy 1: Find by exact name match
          let found = listData.find((inst: any) => {
            const instName = inst.instance?.instanceName || inst.name || inst.instanceName;
            return instName === instance.instance_name;
          });
          
          // Strategy 2: Find by phone number in owner field
          if (!found && instance.phone_number) {
            found = listData.find((inst: any) => {
              const instOwner = inst.instance?.owner || inst.owner || '';
              const instPhone = instOwner.split('@')[0];
              return instPhone === instance.phone_number;
            });
            if (found) console.log(`[MATCH] Found by phone number`);
          }
          
          // Strategy 3: Find by partial name match (contains)
          if (!found) {
            found = listData.find((inst: any) => {
              const instName = inst.instance?.instanceName || inst.name || inst.instanceName || '';
              return instName.includes(instance.instance_name) || 
                     instance.instance_name.includes(instName);
            });
            if (found) console.log(`[MATCH] Found by partial name match`);
          }
          
          // Strategy 4: If still not found and only 1 connected instance, use it
          if (!found) {
            const connectedInstances = listData.filter((inst: any) => {
              const instState = inst.instance?.state || inst.state;
              return instState === 'open';
            });
            if (connectedInstances.length === 1) {
              found = connectedInstances[0];
              console.log(`[MATCH] Using only connected instance`);
            }
          }
          
          // Strategy 5: If still not found and only 1 instance total, use it
          if (!found && listData.length === 1) {
            found = listData[0];
            console.log(`[MATCH] Using only available instance`);
          }
          
          if (found) {
            actualInstanceName = found.instance?.instanceName || found.name || found.instanceName;
            console.log(`[MATCH] Final instance name: ${actualInstanceName}`);
          } else {
            console.log(`[MATCH] No match found, using DB name: ${instance.instance_name}`);
          }
        }
      } catch (err) {
        console.log(`[INSTANCES] Error listing: ${err instanceof Error ? err.message : 'unknown'}`);
      }
      
      console.log(`Using instance name: ${actualInstanceName}`);

      // Helper function with timeout
      const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 15000) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetch(url, { ...options, signal: controller.signal });
          clearTimeout(timeout);
          return response;
        } catch (error) {
          clearTimeout(timeout);
          throw error;
        }
      };

      // Fetch all stats in parallel with individual timeouts
      const [contactsResult, groupsResult, chatsResult] = await Promise.allSettled([
        // Contacts - use findContacts endpoint
        (async () => {
          const url = `${evolutionApiUrl}/chat/findContacts/${actualInstanceName}`;
          console.log(`[CONTACTS] URL: ${url}`);
          try {
            const res = await fetchWithTimeout(url, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: evolutionApiKey },
              body: JSON.stringify({ where: {} }),
            });
            const text = await res.text();
            console.log(`[CONTACTS] Status: ${res.status}`);
            console.log(`[CONTACTS] Response length: ${text.length} chars`);
            console.log(`[CONTACTS] First 500 chars: ${text.substring(0, 500)}`);
            
            try {
              const data = JSON.parse(text);
              console.log(`[CONTACTS] Data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
              console.log(`[CONTACTS] Data keys: ${typeof data === 'object' && data !== null ? Object.keys(data).join(', ') : 'N/A'}`);
              
              if (Array.isArray(data)) {
                console.log(`[CONTACTS] Direct array with ${data.length} items`);
                return data.length;
              }
              if (data?.data && Array.isArray(data.data)) {
                console.log(`[CONTACTS] Nested data array with ${data.data.length} items`);
                return data.data.length;
              }
              if (data?.contacts && Array.isArray(data.contacts)) {
                console.log(`[CONTACTS] Nested contacts array with ${data.contacts.length} items`);
                return data.contacts.length;
              }
              console.log(`[CONTACTS] Unknown format, returning 0`);
              return 0;
            } catch (parseErr) {
              console.log(`[CONTACTS] JSON parse error: ${parseErr}`);
              return 0;
            }
          } catch (err) {
            console.log(`[CONTACTS] Fetch error: ${err instanceof Error ? err.message : 'unknown'}`);
            return 0;
          }
        })(),
        
        // Groups - use fetchAllGroups endpoint
        (async () => {
          const url = `${evolutionApiUrl}/group/fetchAllGroups/${actualInstanceName}?getParticipants=false`;
          console.log(`[GROUPS] URL: ${url}`);
          try {
            const res = await fetchWithTimeout(url, {
              method: "GET",
              headers: { apikey: evolutionApiKey }
            });
            const text = await res.text();
            console.log(`[GROUPS] Status: ${res.status}`);
            console.log(`[GROUPS] Response length: ${text.length} chars`);
            console.log(`[GROUPS] First 500 chars: ${text.substring(0, 500)}`);
            
            try {
              const data = JSON.parse(text);
              console.log(`[GROUPS] Data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
              console.log(`[GROUPS] Data keys: ${typeof data === 'object' && data !== null ? Object.keys(data).join(', ') : 'N/A'}`);
              
              if (Array.isArray(data)) {
                console.log(`[GROUPS] Direct array with ${data.length} items`);
                return data.length;
              }
              if (data?.groups && Array.isArray(data.groups)) {
                console.log(`[GROUPS] Nested groups array with ${data.groups.length} items`);
                return data.groups.length;
              }
              if (data?.data && Array.isArray(data.data)) {
                console.log(`[GROUPS] Nested data array with ${data.data.length} items`);
                return data.data.length;
              }
              console.log(`[GROUPS] Unknown format, returning 0`);
              return 0;
            } catch (parseErr) {
              console.log(`[GROUPS] JSON parse error: ${parseErr}`);
              return 0;
            }
          } catch (err) {
            console.log(`[GROUPS] Fetch error: ${err instanceof Error ? err.message : 'unknown'}`);
            return 0;
          }
        })(),
        
        // Chats - use findChats endpoint
        (async () => {
          const url = `${evolutionApiUrl}/chat/findChats/${actualInstanceName}`;
          console.log(`[CHATS] URL: ${url}`);
          try {
            const res = await fetchWithTimeout(url, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: evolutionApiKey },
              body: JSON.stringify({ where: {} }),
            });
            const text = await res.text();
            console.log(`[CHATS] Status: ${res.status}`);
            console.log(`[CHATS] Response length: ${text.length} chars`);
            console.log(`[CHATS] First 500 chars: ${text.substring(0, 500)}`);
            
            try {
              const data = JSON.parse(text);
              console.log(`[CHATS] Data type: ${typeof data}, isArray: ${Array.isArray(data)}`);
              console.log(`[CHATS] Data keys: ${typeof data === 'object' && data !== null ? Object.keys(data).join(', ') : 'N/A'}`);
              
              if (Array.isArray(data)) {
                console.log(`[CHATS] Direct array with ${data.length} items`);
                return data.length;
              }
              if (data?.data && Array.isArray(data.data)) {
                console.log(`[CHATS] Nested data array with ${data.data.length} items`);
                return data.data.length;
              }
              if (data?.chats && Array.isArray(data.chats)) {
                console.log(`[CHATS] Nested chats array with ${data.chats.length} items`);
                return data.chats.length;
              }
              console.log(`[CHATS] Unknown format, returning 0`);
              return 0;
            } catch (parseErr) {
              console.log(`[CHATS] JSON parse error: ${parseErr}`);
              return 0;
            }
          } catch (err) {
            console.log(`[CHATS] Fetch error: ${err instanceof Error ? err.message : 'unknown'}`);
            return 0;
          }
        })(),
      ]);

      const contacts = contactsResult.status === 'fulfilled' ? contactsResult.value : 0;
      const groups = groupsResult.status === 'fulfilled' ? groupsResult.value : 0;
      const chats = chatsResult.status === 'fulfilled' ? chatsResult.value : 0;

      console.log(`=== STATS FINAL ===`);
      console.log(`Contacts: ${contacts}, Groups: ${groups}, Chats: ${chats}`);
      console.log(`=== STATS DEBUG END ===`);

      return new Response(JSON.stringify({ contacts, groups, chats }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract group participants
    if (action === "extractParticipants") {
      const { groupJid } = body;

      const { data: instance } = await supabase
        .from("whatsapp_instances")
        .select("instance_name, user_id")
        .eq("id", instanceId)
        .single();

      if (!instance) {
        return new Response(JSON.stringify({ error: "Instância não encontrada" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const response = await fetch(
        `${evolutionApiUrl}/group/participants/${instance.instance_name}?groupJid=${groupJid}`,
        {
          method: "GET",
          headers: { apikey: evolutionApiKey },
        }
      );

      const data = await response.json();
      const participants = data.participants || [];

      // Get group name
      const { data: group } = await supabase
        .from("whatsapp_groups")
        .select("name")
        .eq("group_jid", groupJid)
        .single();

      // Save participants as contacts
      let imported = 0;
      for (const participant of participants) {
        const phone = participant.id?.replace("@s.whatsapp.net", "") || "";
        if (phone) {
          const { error } = await supabase.from("whatsapp_contacts").upsert(
            {
              user_id: instance.user_id,
              phone,
              source: "group",
              group_name: group?.name || null,
            },
            { onConflict: "user_id,phone", ignoreDuplicates: true }
          );
          if (!error) imported++;
        }
      }

      return new Response(JSON.stringify({ imported, total: participants.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sync instances bidirectionally with Evolution API
    if (action === "sync") {
      console.log("=== SYNC START ===");
      console.log(`User ID: ${userId}`);
      
      // 1. Fetch all instances from Evolution API
      const evolutionRes = await fetch(`${evolutionApiUrl}/instance/fetchInstances`, {
        method: "GET",
        headers: { apikey: evolutionApiKey }
      });
      const evolutionInstances = await evolutionRes.json();
      console.log(`Evolution instances: ${Array.isArray(evolutionInstances) ? evolutionInstances.length : 0}`);
      
      if (!Array.isArray(evolutionInstances)) {
        return new Response(JSON.stringify({ 
          error: "Erro ao buscar instâncias da Evolution API",
          imported: 0, updated: 0, removed: 0, total: 0, instances: []
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // 2. Fetch all instances from database for this user
      const { data: dbInstances } = await supabase
        .from("whatsapp_instances")
        .select("*")
        .eq("user_id", userId);
      
      const existingInstances = dbInstances || [];
      console.log(`Database instances: ${existingInstances.length}`);

      const results: Array<{
        name: string;
        status: string;
        phone?: string;
        action: 'imported' | 'updated' | 'unchanged' | 'removed';
      }> = [];
      
      let imported = 0;
      let updated = 0;
      let removed = 0;

      // 3. Process Evolution instances - import or update
      for (const evoInst of evolutionInstances) {
        const instanceName = evoInst.instance?.instanceName || evoInst.name || evoInst.instanceName;
        const instanceState = evoInst.instance?.state || evoInst.state;
        const instanceOwner = evoInst.instance?.owner || evoInst.owner || '';
        const phoneNumber = instanceOwner.split('@')[0] || null;
        
        if (!instanceName) continue;

        // Map Evolution state to our status
        const statusMap: Record<string, string> = {
          open: "connected",
          close: "disconnected",
          connecting: "connecting",
        };
        const status = statusMap[instanceState] || "disconnected";

        // Check if this instance already exists in database
        const existing = existingInstances.find(db => 
          db.instance_name === instanceName || 
          (db.phone_number && db.phone_number === phoneNumber)
        );

        if (existing) {
          // Update if status or name changed
          if (existing.status !== status || existing.instance_name !== instanceName) {
            await supabase
              .from("whatsapp_instances")
              .update({ 
                status, 
                instance_name: instanceName,
                phone_number: phoneNumber || existing.phone_number,
                last_connected_at: status === 'connected' ? new Date().toISOString() : existing.last_connected_at
              })
              .eq("id", existing.id);
            
            results.push({ name: instanceName, status, phone: phoneNumber || undefined, action: 'updated' });
            updated++;
          } else {
            results.push({ name: instanceName, status, phone: phoneNumber || undefined, action: 'unchanged' });
          }
        } else {
          // Import new instance
          const { error } = await supabase
            .from("whatsapp_instances")
            .insert({
              user_id: userId,
              instance_name: instanceName,
              display_name: instanceName,
              status,
              phone_number: phoneNumber,
              last_connected_at: status === 'connected' ? new Date().toISOString() : null
            });
          
          if (!error) {
            results.push({ name: instanceName, status, phone: phoneNumber || undefined, action: 'imported' });
            imported++;
            
            // Set webhook for imported instance
            try {
              const webhookUrl = `${supabaseUrl}/functions/v1/whatsapp-webhook`;
              await fetch(`${evolutionApiUrl}/webhook/set/${instanceName}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: evolutionApiKey,
                },
                body: JSON.stringify({
                  enabled: true,
                  url: webhookUrl,
                  webhookByEvents: false,
                  events: ["MESSAGES_UPSERT", "MESSAGES_UPDATE", "CONNECTION_UPDATE", "CONTACTS_UPDATE"],
                }),
              });
              console.log(`Webhook set for ${instanceName}`);
            } catch (webhookErr) {
              console.log(`Failed to set webhook for ${instanceName}:`, webhookErr);
            }
          }
        }
      }

      // 4. Check for instances in database that don't exist in Evolution anymore
      for (const dbInst of existingInstances) {
        const existsInEvolution = evolutionInstances.some(evo => {
          const evoName = evo.instance?.instanceName || evo.name || evo.instanceName;
          const evoOwner = evo.instance?.owner || evo.owner || '';
          const evoPhone = evoOwner.split('@')[0];
          return evoName === dbInst.instance_name || 
                 (dbInst.phone_number && evoPhone === dbInst.phone_number);
        });

        if (!existsInEvolution) {
          // Mark as disconnected (or remove - for now we just update status)
          await supabase
            .from("whatsapp_instances")
            .update({ status: "disconnected" })
            .eq("id", dbInst.id);
          
          results.push({ 
            name: dbInst.instance_name, 
            status: 'disconnected', 
            phone: dbInst.phone_number || undefined, 
            action: 'removed' 
          });
          removed++;
        }
      }

      console.log(`=== SYNC COMPLETE ===`);
      console.log(`Imported: ${imported}, Updated: ${updated}, Removed: ${removed}`);

      return new Response(JSON.stringify({ 
        imported, 
        updated, 
        removed, 
        total: evolutionInstances.length,
        instances: results 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação não reconhecida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
