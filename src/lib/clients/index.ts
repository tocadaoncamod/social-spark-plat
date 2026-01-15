// API Clients Index
// Central export for all platform API clients

// WhatsApp (Evolution API)
export { WhatsAppClient, createWhatsAppClient, WEBHOOK_EVENTS } from './whatsapp-client';
export type { WhatsAppWebhookEvent } from './whatsapp-client';

// Facebook (Graph API)
export { FacebookClient, createFacebookClient, PAGE_METRICS, POST_METRICS } from './facebook-client';

// Instagram (Graph API)
export { InstagramClient, createInstagramClient, ACCOUNT_METRICS, MEDIA_METRICS } from './instagram-client';

// YouTube (Data API v3)
export { YouTubeClient, createYouTubeClient, VIDEO_CATEGORIES } from './youtube-client';

// TikTok (API for Business)
export { TikTokClient, createTikTokClient, TIKTOK_SCOPES } from './tiktok-client';

// Telegram (Bot API)
export { TelegramClient, createTelegramClient } from './telegram-client';
export type { TelegramUpdate, TelegramMessage, TelegramUser, TelegramChat } from './telegram-client';

// Twitter/X (API v2)
export { TwitterClient, createTwitterClient, TWITTER_SCOPES } from './twitter-client';
