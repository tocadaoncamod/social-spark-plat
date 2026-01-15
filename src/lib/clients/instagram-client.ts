// Instagram Client using Graph API (Instagram Business/Creator API)
// Documentation: https://developers.facebook.com/docs/instagram-api

interface InstagramConfig {
  accessToken: string;
  instagramAccountId: string;
  apiVersion?: string;
}

interface MediaPublishParams {
  imageUrl?: string;
  videoUrl?: string;
  caption?: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'REELS';
  coverUrl?: string;
  children?: string[];
  locationId?: string;
}

interface Media {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface Story {
  id: string;
  media_type: 'IMAGE' | 'VIDEO';
  media_url: string;
  timestamp: string;
}

interface Insight {
  name: string;
  period: string;
  values: { value: number }[];
  title: string;
}

interface Comment {
  id: string;
  text: string;
  username: string;
  timestamp: string;
}

export class InstagramClient {
  private config: InstagramConfig;
  private baseUrl: string;

  constructor(config: InstagramConfig) {
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${config.apiVersion || 'v18.0'}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (options.method === 'GET' || !options.method) {
      url.searchParams.append('access_token', this.config.accessToken);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Account Info
  async getAccount(): Promise<{
    id: string;
    username: string;
    name: string;
    biography: string;
    followers_count: number;
    follows_count: number;
    media_count: number;
    profile_picture_url: string;
  }> {
    return this.request(
      `/${this.config.instagramAccountId}?fields=id,username,name,biography,followers_count,follows_count,media_count,profile_picture_url`
    );
  }

  // Media Publishing - Step 1: Create Container
  async createMediaContainer(params: MediaPublishParams): Promise<{ id: string }> {
    const body: Record<string, unknown> = {
      access_token: this.config.accessToken,
      caption: params.caption,
    };

    if (params.mediaType === 'REELS') {
      body.media_type = 'REELS';
      body.video_url = params.videoUrl;
      body.cover_url = params.coverUrl;
    } else if (params.mediaType === 'CAROUSEL_ALBUM') {
      body.media_type = 'CAROUSEL';
      body.children = params.children;
    } else if (params.videoUrl) {
      body.media_type = 'VIDEO';
      body.video_url = params.videoUrl;
    } else {
      body.image_url = params.imageUrl;
    }

    if (params.locationId) {
      body.location_id = params.locationId;
    }

    return this.request(`/${this.config.instagramAccountId}/media`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Media Publishing - Step 2: Publish Container
  async publishMedia(containerId: string): Promise<{ id: string }> {
    return this.request(`/${this.config.instagramAccountId}/media_publish`, {
      method: 'POST',
      body: JSON.stringify({
        creation_id: containerId,
        access_token: this.config.accessToken,
      }),
    });
  }

  // Combined publish method
  async createAndPublishMedia(params: MediaPublishParams): Promise<{ id: string }> {
    const container = await this.createMediaContainer(params);
    
    // For videos, we need to wait for processing
    if (params.videoUrl || params.mediaType === 'REELS') {
      await this.waitForMediaProcessing(container.id);
    }
    
    return this.publishMedia(container.id);
  }

  private async waitForMediaProcessing(containerId: string, maxAttempts: number = 30): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.request<{ status_code: string }>(
        `/${containerId}?fields=status_code`
      );
      
      if (status.status_code === 'FINISHED') {
        return;
      }
      
      if (status.status_code === 'ERROR') {
        throw new Error('Media processing failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Media processing timeout');
  }

  // Create carousel item container
  async createCarouselItemContainer(
    imageUrl?: string,
    videoUrl?: string
  ): Promise<{ id: string }> {
    const body: Record<string, unknown> = {
      is_carousel_item: true,
      access_token: this.config.accessToken,
    };

    if (videoUrl) {
      body.media_type = 'VIDEO';
      body.video_url = videoUrl;
    } else {
      body.image_url = imageUrl;
    }

    return this.request(`/${this.config.instagramAccountId}/media`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Get Media
  async getMedia(limit: number = 25): Promise<{ data: Media[] }> {
    return this.request(
      `/${this.config.instagramAccountId}/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=${limit}`
    );
  }

  async getMediaById(mediaId: string): Promise<Media> {
    return this.request(
      `/${mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count`
    );
  }

  // Stories
  async getStories(): Promise<{ data: Story[] }> {
    return this.request(
      `/${this.config.instagramAccountId}/stories?fields=id,media_type,media_url,timestamp`
    );
  }

  // Comments
  async getComments(mediaId: string, limit: number = 25): Promise<{ data: Comment[] }> {
    return this.request(
      `/${mediaId}/comments?fields=id,text,username,timestamp&limit=${limit}`
    );
  }

  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    return this.request(`/${commentId}/replies`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        access_token: this.config.accessToken,
      }),
    });
  }

  async deleteComment(commentId: string): Promise<{ success: boolean }> {
    return this.request(`/${commentId}`, { method: 'DELETE' });
  }

  // Insights
  async getAccountInsights(
    metrics: string[],
    period: 'day' | 'week' | 'days_28' | 'lifetime' = 'day'
  ): Promise<{ data: Insight[] }> {
    return this.request(
      `/${this.config.instagramAccountId}/insights?metric=${metrics.join(',')}&period=${period}`
    );
  }

  async getMediaInsights(
    mediaId: string,
    metrics: string[] = ['impressions', 'reach', 'engagement']
  ): Promise<{ data: Insight[] }> {
    return this.request(
      `/${mediaId}/insights?metric=${metrics.join(',')}`
    );
  }

  // Hashtag Search
  async searchHashtag(hashtag: string): Promise<{ data: { id: string }[] }> {
    return this.request(
      `/ig_hashtag_search?user_id=${this.config.instagramAccountId}&q=${encodeURIComponent(hashtag)}`
    );
  }

  async getHashtagMedia(
    hashtagId: string,
    type: 'top_media' | 'recent_media' = 'recent_media'
  ): Promise<{ data: Media[] }> {
    return this.request(
      `/${hashtagId}/${type}?user_id=${this.config.instagramAccountId}&fields=id,caption,media_type,permalink`
    );
  }

  // Content Publishing Limit
  async getContentPublishingLimit(): Promise<{
    config: { quota_total: number };
    quota_usage: number;
  }> {
    return this.request(
      `/${this.config.instagramAccountId}/content_publishing_limit?fields=config,quota_usage`
    );
  }
}

export function createInstagramClient(
  accessToken: string,
  instagramAccountId: string,
  apiVersion?: string
): InstagramClient {
  return new InstagramClient({ accessToken, instagramAccountId, apiVersion });
}

// Common metrics
export const ACCOUNT_METRICS = [
  'impressions',
  'reach',
  'follower_count',
  'email_contacts',
  'phone_call_clicks',
  'text_message_clicks',
  'get_directions_clicks',
  'website_clicks',
  'profile_views',
] as const;

export const MEDIA_METRICS = [
  'impressions',
  'reach',
  'engagement',
  'saved',
  'video_views',
] as const;
