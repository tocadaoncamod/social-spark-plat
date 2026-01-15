// Facebook Client using Graph API
// Documentation: https://developers.facebook.com/docs/graph-api

interface FacebookConfig {
  accessToken: string;
  pageId?: string;
  apiVersion?: string;
}

interface PostParams {
  message: string;
  link?: string;
  published?: boolean;
  scheduledPublishTime?: number;
}

interface MediaPostParams {
  url: string;
  caption?: string;
  published?: boolean;
}

interface PageInsight {
  name: string;
  period: string;
  values: { value: number; end_time: string }[];
}

interface Post {
  id: string;
  message?: string;
  created_time: string;
  permalink_url?: string;
  shares?: { count: number };
  likes?: { summary: { total_count: number } };
  comments?: { summary: { total_count: number } };
}

interface Page {
  id: string;
  name: string;
  access_token: string;
  category: string;
  fan_count?: number;
}

export class FacebookClient {
  private config: FacebookConfig;
  private baseUrl: string;

  constructor(config: FacebookConfig) {
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

  // User & Pages
  async getMe(): Promise<{ id: string; name: string }> {
    return this.request('/me');
  }

  async getPages(): Promise<{ data: Page[] }> {
    return this.request('/me/accounts');
  }

  async getPageInfo(pageId?: string): Promise<Page> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}?fields=id,name,fan_count,category,cover,picture`);
  }

  // Posts
  async createPost(params: PostParams, pageId?: string): Promise<{ id: string }> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}/feed`, {
      method: 'POST',
      body: JSON.stringify({
        ...params,
        access_token: this.config.accessToken,
      }),
    });
  }

  async schedulePost(
    message: string,
    scheduledTime: Date,
    pageId?: string
  ): Promise<{ id: string }> {
    return this.createPost({
      message,
      published: false,
      scheduledPublishTime: Math.floor(scheduledTime.getTime() / 1000),
    }, pageId);
  }

  async getPost(postId: string): Promise<Post> {
    return this.request(
      `/${postId}?fields=id,message,created_time,permalink_url,shares,likes.summary(true),comments.summary(true)`
    );
  }

  async getPosts(pageId?: string, limit: number = 25): Promise<{ data: Post[] }> {
    const id = pageId || this.config.pageId;
    return this.request(
      `/${id}/posts?fields=id,message,created_time,permalink_url,shares,likes.summary(true),comments.summary(true)&limit=${limit}`
    );
  }

  async deletePost(postId: string): Promise<{ success: boolean }> {
    return this.request(`/${postId}`, { method: 'DELETE' });
  }

  // Media
  async uploadPhoto(params: MediaPostParams, pageId?: string): Promise<{ id: string; post_id: string }> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}/photos`, {
      method: 'POST',
      body: JSON.stringify({
        url: params.url,
        caption: params.caption,
        published: params.published ?? true,
        access_token: this.config.accessToken,
      }),
    });
  }

  async uploadVideo(params: MediaPostParams, pageId?: string): Promise<{ id: string }> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}/videos`, {
      method: 'POST',
      body: JSON.stringify({
        file_url: params.url,
        description: params.caption,
        published: params.published ?? true,
        access_token: this.config.accessToken,
      }),
    });
  }

  // Insights & Analytics
  async getPageInsights(
    metrics: string[],
    period: 'day' | 'week' | 'days_28' = 'day',
    pageId?: string
  ): Promise<{ data: PageInsight[] }> {
    const id = pageId || this.config.pageId;
    return this.request(
      `/${id}/insights?metric=${metrics.join(',')}&period=${period}`
    );
  }

  async getPostInsights(
    postId: string,
    metrics: string[] = ['post_impressions', 'post_engaged_users', 'post_clicks']
  ): Promise<{ data: PageInsight[] }> {
    return this.request(`/${postId}/insights?metric=${metrics.join(',')}`);
  }

  // Comments
  async getComments(postId: string, limit: number = 25): Promise<{ data: { id: string; message: string; from: { name: string } }[] }> {
    return this.request(`/${postId}/comments?limit=${limit}`);
  }

  async replyToComment(commentId: string, message: string): Promise<{ id: string }> {
    return this.request(`/${commentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        access_token: this.config.accessToken,
      }),
    });
  }

  // Messaging (Page Inbox)
  async getConversations(pageId?: string): Promise<{ data: { id: string; participants: { data: { name: string }[] } }[] }> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}/conversations`);
  }

  async sendMessage(recipientId: string, message: string, pageId?: string): Promise<{ recipient_id: string; message_id: string }> {
    const id = pageId || this.config.pageId;
    return this.request(`/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: this.config.accessToken,
      }),
    });
  }
}

export function createFacebookClient(
  accessToken: string,
  pageId?: string,
  apiVersion?: string
): FacebookClient {
  return new FacebookClient({ accessToken, pageId, apiVersion });
}

// Common metrics for insights
export const PAGE_METRICS = [
  'page_impressions',
  'page_engaged_users',
  'page_fan_adds',
  'page_fans',
  'page_views_total',
] as const;

export const POST_METRICS = [
  'post_impressions',
  'post_engaged_users',
  'post_clicks',
  'post_reactions_by_type_total',
] as const;
