// TikTok Client using TikTok API for Business
// Documentation: https://developers.tiktok.com/doc/overview

interface TikTokConfig {
  accessToken: string;
  openId?: string;
}

interface VideoPublishParams {
  videoUrl: string;
  title?: string;
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  disableDuet?: boolean;
  disableStitch?: boolean;
  disableComment?: boolean;
  brandContentToggle?: boolean;
  brandOrganicToggle?: boolean;
}

interface Video {
  id: string;
  create_time: number;
  cover_image_url: string;
  share_url: string;
  video_description: string;
  duration: number;
  title: string;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
}

interface UserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  display_name: string;
  bio_description: string;
  profile_deep_link: string;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

interface Comment {
  id: string;
  text: string;
  create_time: number;
  likes_count: number;
  user: {
    open_id: string;
    display_name: string;
    avatar_url: string;
  };
}

export class TikTokClient {
  private config: TikTokConfig;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  constructor(config: TikTokConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // User Info
  async getUserInfo(fields: string[] = ['open_id', 'display_name', 'avatar_url', 'follower_count', 'following_count', 'likes_count', 'video_count']): Promise<{ user: UserInfo }> {
    return this.request(`/user/info/?fields=${fields.join(',')}`);
  }

  // Videos
  async getVideos(
    maxCount: number = 20,
    cursor?: string,
    fields: string[] = ['id', 'title', 'video_description', 'duration', 'cover_image_url', 'share_url', 'create_time', 'like_count', 'comment_count', 'share_count', 'view_count']
  ): Promise<{ videos: Video[]; cursor: string; has_more: boolean }> {
    const body: Record<string, unknown> = { max_count: maxCount };
    if (cursor) body.cursor = cursor;

    return this.request(`/video/list/?fields=${fields.join(',')}`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getVideoById(
    videoIds: string[],
    fields: string[] = ['id', 'title', 'video_description', 'duration', 'cover_image_url', 'share_url', 'create_time', 'like_count', 'comment_count', 'share_count', 'view_count']
  ): Promise<{ videos: Video[] }> {
    return this.request(`/video/query/?fields=${fields.join(',')}`, {
      method: 'POST',
      body: JSON.stringify({
        filters: { video_ids: videoIds },
      }),
    });
  }

  // Video Publishing - Step 1: Initialize upload
  async initVideoUpload(params: VideoPublishParams): Promise<{ publish_id: string; upload_url: string }> {
    return this.request('/post/publish/video/init/', {
      method: 'POST',
      body: JSON.stringify({
        post_info: {
          title: params.title || '',
          privacy_level: params.privacyLevel || 'SELF_ONLY',
          disable_duet: params.disableDuet || false,
          disable_stitch: params.disableStitch || false,
          disable_comment: params.disableComment || false,
          brand_content_toggle: params.brandContentToggle || false,
          brand_organic_toggle: params.brandOrganicToggle || false,
        },
        source_info: {
          source: 'PULL_FROM_URL',
          video_url: params.videoUrl,
        },
      }),
    });
  }

  // Video Publishing - Step 2: Check status
  async getPublishStatus(publishId: string): Promise<{
    status: 'PROCESSING_UPLOAD' | 'PROCESSING_DOWNLOAD' | 'SEND_TO_USER_INBOX' | 'PUBLISH_COMPLETE' | 'FAILED';
    fail_reason?: string;
    publicaly_available_post_id?: string[];
  }> {
    return this.request('/post/publish/status/fetch/', {
      method: 'POST',
      body: JSON.stringify({ publish_id: publishId }),
    });
  }

  // Combined publish method with polling
  async publishVideo(params: VideoPublishParams, pollInterval: number = 5000, maxAttempts: number = 60): Promise<{ videoId: string }> {
    const initResult = await this.initVideoUpload(params);
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      const status = await this.getPublishStatus(initResult.publish_id);
      
      if (status.status === 'PUBLISH_COMPLETE') {
        return { videoId: status.publicaly_available_post_id?.[0] || initResult.publish_id };
      }
      
      if (status.status === 'FAILED') {
        throw new Error(`Video publish failed: ${status.fail_reason}`);
      }
    }
    
    throw new Error('Video publish timeout');
  }

  // Comments
  async getComments(
    videoId: string,
    maxCount: number = 20,
    cursor?: string
  ): Promise<{ comments: Comment[]; cursor: string; has_more: boolean }> {
    const body: Record<string, unknown> = {
      video_id: videoId,
      max_count: maxCount,
    };
    if (cursor) body.cursor = cursor;

    return this.request('/video/comment/list/', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async replyToComment(
    videoId: string,
    commentId: string,
    text: string
  ): Promise<{ comment_id: string }> {
    return this.request('/video/comment/reply/', {
      method: 'POST',
      body: JSON.stringify({
        video_id: videoId,
        comment_id: commentId,
        text,
      }),
    });
  }

  // Business API - Creator Insights
  async getCreatorInsights(
    fields: string[] = ['followers_count', 'profile_views', 'likes_count', 'comments_count', 'shares_count', 'video_views']
  ): Promise<{ insights: Record<string, number> }> {
    return this.request(`/business/creator/insights/?fields=${fields.join(',')}`);
  }

  // Business API - Video Insights
  async getVideoInsights(
    videoId: string,
    fields: string[] = ['views', 'likes', 'comments', 'shares', 'reach', 'impressions']
  ): Promise<{ insights: Record<string, number> }> {
    return this.request(`/business/video/insights/?video_id=${videoId}&fields=${fields.join(',')}`);
  }

  // OAuth helpers
  static getAuthorizationUrl(
    clientKey: string,
    redirectUri: string,
    scope: string[] = ['user.info.basic', 'video.list', 'video.publish'],
    state?: string
  ): string {
    const params = new URLSearchParams({
      client_key: clientKey,
      redirect_uri: redirectUri,
      scope: scope.join(','),
      response_type: 'code',
    });
    
    if (state) params.append('state', state);
    
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  static async exchangeCodeForToken(
    clientKey: string,
    clientSecret: string,
    code: string,
    redirectUri: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    open_id: string;
    expires_in: number;
    refresh_expires_in: number;
  }> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return response.json();
  }

  static async refreshAccessToken(
    clientKey: string,
    clientSecret: string,
    refreshToken: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
  }> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return response.json();
  }
}

export function createTikTokClient(
  accessToken: string,
  openId?: string
): TikTokClient {
  return new TikTokClient({ accessToken, openId });
}

// Available scopes
export const TIKTOK_SCOPES = {
  USER_INFO_BASIC: 'user.info.basic',
  USER_INFO_PROFILE: 'user.info.profile',
  USER_INFO_STATS: 'user.info.stats',
  VIDEO_LIST: 'video.list',
  VIDEO_UPLOAD: 'video.upload',
  VIDEO_PUBLISH: 'video.publish',
  COMMENT_LIST: 'comment.list',
  COMMENT_LIST_MANAGE: 'comment.list.manage',
} as const;
