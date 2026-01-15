// Telegram Client using Bot API
// Documentation: https://core.telegram.org/bots/api

interface TelegramConfig {
  botToken: string;
}

interface SendMessageParams {
  chatId: string | number;
  text: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
  replyToMessageId?: number;
  replyMarkup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove;
}

interface SendPhotoParams {
  chatId: string | number;
  photo: string;
  caption?: string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

interface SendVideoParams {
  chatId: string | number;
  video: string;
  caption?: string;
  duration?: number;
  width?: number;
  height?: number;
  supportsStreaming?: boolean;
}

interface SendDocumentParams {
  chatId: string | number;
  document: string;
  caption?: string;
  filename?: string;
}

interface InlineKeyboardButton {
  text: string;
  url?: string;
  callbackData?: string;
  webApp?: { url: string };
}

interface InlineKeyboardMarkup {
  inline_keyboard: InlineKeyboardButton[][];
}

interface ReplyKeyboardMarkup {
  keyboard: { text: string }[][];
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
}

interface ReplyKeyboardRemove {
  remove_keyboard: true;
}

interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface Chat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface Message {
  message_id: number;
  from?: User;
  chat: Chat;
  date: number;
  text?: string;
  photo?: { file_id: string; width: number; height: number }[];
  video?: { file_id: string; duration: number };
  document?: { file_id: string; file_name: string };
}

interface Update {
  update_id: number;
  message?: Message;
  callback_query?: {
    id: string;
    from: User;
    message?: Message;
    data?: string;
  };
}

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
}

export class TelegramClient {
  private config: TelegramConfig;
  private baseUrl: string;

  constructor(config: TelegramConfig) {
    this.config = config;
    this.baseUrl = `https://api.telegram.org/bot${config.botToken}`;
  }

  private async request<T>(
    method: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params ? JSON.stringify(params) : undefined,
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error');
    }

    return data.result;
  }

  // Bot Info
  async getMe(): Promise<User> {
    return this.request('getMe');
  }

  // Messaging
  async sendMessage(params: SendMessageParams): Promise<Message> {
    return this.request('sendMessage', {
      chat_id: params.chatId,
      text: params.text,
      parse_mode: params.parseMode,
      disable_web_page_preview: params.disableWebPagePreview,
      disable_notification: params.disableNotification,
      reply_to_message_id: params.replyToMessageId,
      reply_markup: params.replyMarkup,
    });
  }

  async sendPhoto(params: SendPhotoParams): Promise<Message> {
    return this.request('sendPhoto', {
      chat_id: params.chatId,
      photo: params.photo,
      caption: params.caption,
      parse_mode: params.parseMode,
    });
  }

  async sendVideo(params: SendVideoParams): Promise<Message> {
    return this.request('sendVideo', {
      chat_id: params.chatId,
      video: params.video,
      caption: params.caption,
      duration: params.duration,
      width: params.width,
      height: params.height,
      supports_streaming: params.supportsStreaming,
    });
  }

  async sendDocument(params: SendDocumentParams): Promise<Message> {
    return this.request('sendDocument', {
      chat_id: params.chatId,
      document: params.document,
      caption: params.caption,
    });
  }

  async sendMediaGroup(
    chatId: string | number,
    media: { type: 'photo' | 'video'; media: string; caption?: string }[]
  ): Promise<Message[]> {
    return this.request('sendMediaGroup', {
      chat_id: chatId,
      media,
    });
  }

  async forwardMessage(
    chatId: string | number,
    fromChatId: string | number,
    messageId: number
  ): Promise<Message> {
    return this.request('forwardMessage', {
      chat_id: chatId,
      from_chat_id: fromChatId,
      message_id: messageId,
    });
  }

  async editMessageText(
    chatId: string | number,
    messageId: number,
    text: string,
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  ): Promise<Message | boolean> {
    return this.request('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: parseMode,
    });
  }

  async deleteMessage(chatId: string | number, messageId: number): Promise<boolean> {
    return this.request('deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }

  // Chat Management
  async getChat(chatId: string | number): Promise<Chat & { description?: string; invite_link?: string }> {
    return this.request('getChat', { chat_id: chatId });
  }

  async getChatMemberCount(chatId: string | number): Promise<number> {
    return this.request('getChatMemberCount', { chat_id: chatId });
  }

  async getChatMember(chatId: string | number, userId: number): Promise<{
    status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
    user: User;
  }> {
    return this.request('getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  async banChatMember(chatId: string | number, userId: number, untilDate?: number): Promise<boolean> {
    return this.request('banChatMember', {
      chat_id: chatId,
      user_id: userId,
      until_date: untilDate,
    });
  }

  async unbanChatMember(chatId: string | number, userId: number): Promise<boolean> {
    return this.request('unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
  }

  // Channels
  async createChatInviteLink(
    chatId: string | number,
    options?: {
      name?: string;
      expireDate?: number;
      memberLimit?: number;
      createsJoinRequest?: boolean;
    }
  ): Promise<{ invite_link: string; creator: User; creates_join_request: boolean; is_primary: boolean }> {
    return this.request('createChatInviteLink', {
      chat_id: chatId,
      name: options?.name,
      expire_date: options?.expireDate,
      member_limit: options?.memberLimit,
      creates_join_request: options?.createsJoinRequest,
    });
  }

  // Polling / Webhooks
  async getUpdates(offset?: number, limit: number = 100, timeout: number = 0): Promise<Update[]> {
    return this.request('getUpdates', {
      offset,
      limit,
      timeout,
    });
  }

  async setWebhook(
    url: string,
    options?: {
      certificate?: string;
      maxConnections?: number;
      allowedUpdates?: string[];
      dropPendingUpdates?: boolean;
      secretToken?: string;
    }
  ): Promise<boolean> {
    return this.request('setWebhook', {
      url,
      certificate: options?.certificate,
      max_connections: options?.maxConnections,
      allowed_updates: options?.allowedUpdates,
      drop_pending_updates: options?.dropPendingUpdates,
      secret_token: options?.secretToken,
    });
  }

  async deleteWebhook(dropPendingUpdates?: boolean): Promise<boolean> {
    return this.request('deleteWebhook', {
      drop_pending_updates: dropPendingUpdates,
    });
  }

  async getWebhookInfo(): Promise<WebhookInfo> {
    return this.request('getWebhookInfo');
  }

  // Callback Queries
  async answerCallbackQuery(
    callbackQueryId: string,
    options?: {
      text?: string;
      showAlert?: boolean;
      url?: string;
      cacheTime?: number;
    }
  ): Promise<boolean> {
    return this.request('answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text: options?.text,
      show_alert: options?.showAlert,
      url: options?.url,
      cache_time: options?.cacheTime,
    });
  }

  // Commands
  async setMyCommands(
    commands: { command: string; description: string }[],
    scope?: { type: 'default' | 'all_private_chats' | 'all_group_chats' | 'chat'; chat_id?: string | number }
  ): Promise<boolean> {
    return this.request('setMyCommands', {
      commands,
      scope,
    });
  }

  async getMyCommands(): Promise<{ command: string; description: string }[]> {
    return this.request('getMyCommands');
  }

  // File Downloads
  async getFile(fileId: string): Promise<{ file_id: string; file_path: string; file_size: number }> {
    return this.request('getFile', { file_id: fileId });
  }

  getFileUrl(filePath: string): string {
    return `https://api.telegram.org/file/bot${this.config.botToken}/${filePath}`;
  }

  // Inline Keyboard Helpers
  static createInlineKeyboard(buttons: { text: string; url?: string; callbackData?: string }[][]): InlineKeyboardMarkup {
    return {
      inline_keyboard: buttons.map(row =>
        row.map(btn => ({
          text: btn.text,
          url: btn.url,
          callback_data: btn.callbackData,
        }))
      ),
    };
  }

  static createReplyKeyboard(buttons: string[][], options?: { resize?: boolean; oneTime?: boolean }): ReplyKeyboardMarkup {
    return {
      keyboard: buttons.map(row => row.map(text => ({ text }))),
      resizeKeyboard: options?.resize ?? true,
      oneTimeKeyboard: options?.oneTime,
    };
  }
}

export function createTelegramClient(botToken: string): TelegramClient {
  return new TelegramClient({ botToken });
}

// Update types for webhook handling
export type TelegramUpdate = Update;
export type TelegramMessage = Message;
export type TelegramUser = User;
export type TelegramChat = Chat;
