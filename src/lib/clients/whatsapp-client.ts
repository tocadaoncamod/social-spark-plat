// WhatsApp Client using Evolution API
// Documentation: https://doc.evolution-api.com/

interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
}

interface SendMessageParams {
  number: string;
  text: string;
  delay?: number;
}

interface SendMediaParams {
  number: string;
  mediaType: 'image' | 'video' | 'audio' | 'document';
  mediaUrl: string;
  caption?: string;
  fileName?: string;
}

interface Contact {
  id: string;
  name: string;
  pushName?: string;
  profilePictureUrl?: string;
}

interface Message {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
  };
  messageTimestamp: number;
}

interface InstanceStatus {
  instance: {
    instanceName: string;
    state: 'open' | 'close' | 'connecting';
  };
}

export class WhatsAppClient {
  private config: EvolutionConfig;

  constructor(config: EvolutionConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.config.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Instance Management
  async createInstance(): Promise<{ instance: { instanceName: string; status: string } }> {
    return this.request('/instance/create', {
      method: 'POST',
      body: JSON.stringify({
        instanceName: this.config.instanceName,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
      }),
    });
  }

  async getInstanceStatus(): Promise<InstanceStatus> {
    return this.request(`/instance/connectionState/${this.config.instanceName}`);
  }

  async getQRCode(): Promise<{ base64: string; code: string }> {
    return this.request(`/instance/connect/${this.config.instanceName}`);
  }

  async logout(): Promise<{ status: string }> {
    return this.request(`/instance/logout/${this.config.instanceName}`, {
      method: 'DELETE',
    });
  }

  async deleteInstance(): Promise<{ status: string }> {
    return this.request(`/instance/delete/${this.config.instanceName}`, {
      method: 'DELETE',
    });
  }

  // Messaging
  async sendTextMessage(params: SendMessageParams): Promise<{ key: { id: string } }> {
    return this.request(`/message/sendText/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        number: params.number,
        text: params.text,
        delay: params.delay || 1200,
      }),
    });
  }

  async sendMedia(params: SendMediaParams): Promise<{ key: { id: string } }> {
    return this.request(`/message/sendMedia/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        number: params.number,
        mediatype: params.mediaType,
        media: params.mediaUrl,
        caption: params.caption,
        fileName: params.fileName,
      }),
    });
  }

  async sendImage(number: string, imageUrl: string, caption?: string) {
    return this.sendMedia({
      number,
      mediaType: 'image',
      mediaUrl: imageUrl,
      caption,
    });
  }

  async sendDocument(number: string, documentUrl: string, fileName: string) {
    return this.sendMedia({
      number,
      mediaType: 'document',
      mediaUrl: documentUrl,
      fileName,
    });
  }

  // Contacts
  async fetchContacts(): Promise<Contact[]> {
    const response = await this.request<Contact[]>(
      `/chat/fetchContacts/${this.config.instanceName}`
    );
    return response;
  }

  async getProfilePicture(number: string): Promise<{ profilePictureUrl: string }> {
    return this.request(`/chat/fetchProfilePictureUrl/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({ number }),
    });
  }

  async checkNumberExists(number: string): Promise<{ exists: boolean; jid: string }> {
    return this.request(`/chat/whatsappNumbers/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({ numbers: [number] }),
    });
  }

  // Messages History
  async fetchMessages(
    remoteJid: string,
    count: number = 20
  ): Promise<Message[]> {
    return this.request(`/chat/fetchMessages/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        where: { key: { remoteJid } },
        limit: count,
      }),
    });
  }

  // Groups
  async createGroup(
    subject: string,
    participants: string[]
  ): Promise<{ id: string; subject: string }> {
    return this.request(`/group/create/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        subject,
        participants,
      }),
    });
  }

  async fetchGroups(): Promise<{ id: string; subject: string; size: number }[]> {
    return this.request(`/group/fetchAllGroups/${this.config.instanceName}`, {
      method: 'GET',
    });
  }

  async sendGroupMessage(
    groupId: string,
    text: string
  ): Promise<{ key: { id: string } }> {
    return this.request(`/message/sendText/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        number: groupId,
        text,
      }),
    });
  }

  // Webhook Configuration
  async setWebhook(webhookUrl: string, events: string[]): Promise<{ webhook: { url: string } }> {
    return this.request(`/webhook/set/${this.config.instanceName}`, {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          enabled: true,
          url: webhookUrl,
          webhookByEvents: true,
          events,
        },
      }),
    });
  }
}

// Factory function to create WhatsApp client
export function createWhatsAppClient(
  baseUrl: string,
  apiKey: string,
  instanceName: string
): WhatsAppClient {
  return new WhatsAppClient({
    baseUrl,
    apiKey,
    instanceName,
  });
}

// Event types for webhooks
export type WhatsAppWebhookEvent =
  | 'QRCODE_UPDATED'
  | 'MESSAGES_SET'
  | 'MESSAGES_UPSERT'
  | 'MESSAGES_UPDATE'
  | 'MESSAGES_DELETE'
  | 'SEND_MESSAGE'
  | 'CONTACTS_SET'
  | 'CONTACTS_UPSERT'
  | 'CONTACTS_UPDATE'
  | 'PRESENCE_UPDATE'
  | 'CHATS_SET'
  | 'CHATS_UPSERT'
  | 'CHATS_UPDATE'
  | 'CHATS_DELETE'
  | 'GROUPS_UPSERT'
  | 'GROUPS_UPDATE'
  | 'GROUP_PARTICIPANTS_UPDATE'
  | 'CONNECTION_UPDATE'
  | 'CALL';

export const WEBHOOK_EVENTS: WhatsAppWebhookEvent[] = [
  'MESSAGES_UPSERT',
  'MESSAGES_UPDATE',
  'CONNECTION_UPDATE',
  'QRCODE_UPDATED',
];
