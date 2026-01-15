// Twitter/X Client using API v2
// Documentation: https://developer.twitter.com/en/docs/twitter-api

interface TwitterConfig {
  bearerToken?: string;
  accessToken?: string;
  accessTokenSecret?: string;
  apiKey?: string;
  apiKeySecret?: string;
}

interface TweetParams {
  text: string;
  mediaIds?: string[];
  pollOptions?: string[];
  pollDurationMinutes?: number;
  replyToTweetId?: string;
  quoteTweetId?: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at?: string;
  author_id?: string;
  conversation_id?: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count: number;
  };
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };
}

interface User {
  id: string;
  name: string;
  username: string;
  description?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  verified?: boolean;
  created_at?: string;
}

interface Media {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
  duration_ms?: number;
  width?: number;
  height?: number;
}

interface DirectMessage {
  id: string;
  text: string;
  sender_id: string;
  created_at: string;
  dm_conversation_id: string;
}

export class TwitterClient {
  private config: TwitterConfig;
  private baseUrl = 'https://api.twitter.com/2';

  constructor(config: TwitterConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.bearerToken) {
      headers['Authorization'] = `Bearer ${this.config.bearerToken}`;
    } else if (this.config.accessToken) {
      // For user context, you'd need OAuth 1.0a signing
      // This is simplified - in production, use a proper OAuth library
      headers['Authorization'] = `OAuth oauth_token="${this.config.accessToken}"`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || error.title || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Users
  async getMe(): Promise<{ data: User }> {
    return this.request('/users/me?user.fields=description,profile_image_url,public_metrics,verified,created_at');
  }

  async getUser(userId: string): Promise<{ data: User }> {
    return this.request(`/users/${userId}?user.fields=description,profile_image_url,public_metrics,verified,created_at`);
  }

  async getUserByUsername(username: string): Promise<{ data: User }> {
    return this.request(`/users/by/username/${username}?user.fields=description,profile_image_url,public_metrics,verified,created_at`);
  }

  async getFollowers(userId: string, maxResults: number = 100): Promise<{ data: User[]; meta: { next_token?: string } }> {
    return this.request(`/users/${userId}/followers?max_results=${maxResults}&user.fields=description,profile_image_url,public_metrics`);
  }

  async getFollowing(userId: string, maxResults: number = 100): Promise<{ data: User[]; meta: { next_token?: string } }> {
    return this.request(`/users/${userId}/following?max_results=${maxResults}&user.fields=description,profile_image_url,public_metrics`);
  }

  async followUser(targetUserId: string): Promise<{ data: { following: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/following`, {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId }),
    });
  }

  async unfollowUser(targetUserId: string): Promise<{ data: { following: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/following/${targetUserId}`, {
      method: 'DELETE',
    });
  }

  // Tweets
  async createTweet(params: TweetParams): Promise<{ data: { id: string; text: string } }> {
    const body: Record<string, unknown> = { text: params.text };

    if (params.mediaIds?.length) {
      body.media = { media_ids: params.mediaIds };
    }

    if (params.pollOptions?.length) {
      body.poll = {
        options: params.pollOptions,
        duration_minutes: params.pollDurationMinutes || 1440,
      };
    }

    if (params.replyToTweetId) {
      body.reply = { in_reply_to_tweet_id: params.replyToTweetId };
    }

    if (params.quoteTweetId) {
      body.quote_tweet_id = params.quoteTweetId;
    }

    return this.request('/tweets', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async deleteTweet(tweetId: string): Promise<{ data: { deleted: boolean } }> {
    return this.request(`/tweets/${tweetId}`, { method: 'DELETE' });
  }

  async getTweet(tweetId: string): Promise<{ data: Tweet; includes?: { media?: Media[] } }> {
    return this.request(
      `/tweets/${tweetId}?tweet.fields=created_at,author_id,public_metrics,attachments&expansions=attachments.media_keys&media.fields=url,preview_image_url,duration_ms`
    );
  }

  async getUserTweets(userId: string, maxResults: number = 10): Promise<{ data: Tweet[]; meta: { next_token?: string } }> {
    return this.request(
      `/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at,public_metrics,attachments`
    );
  }

  async getMyTweets(maxResults: number = 10): Promise<{ data: Tweet[] }> {
    const me = await this.getMe();
    return this.getUserTweets(me.data.id, maxResults);
  }

  // Engagement
  async likeTweet(tweetId: string): Promise<{ data: { liked: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/likes`, {
      method: 'POST',
      body: JSON.stringify({ tweet_id: tweetId }),
    });
  }

  async unlikeTweet(tweetId: string): Promise<{ data: { liked: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/likes/${tweetId}`, {
      method: 'DELETE',
    });
  }

  async retweet(tweetId: string): Promise<{ data: { retweeted: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/retweets`, {
      method: 'POST',
      body: JSON.stringify({ tweet_id: tweetId }),
    });
  }

  async undoRetweet(tweetId: string): Promise<{ data: { retweeted: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/retweets/${tweetId}`, {
      method: 'DELETE',
    });
  }

  async bookmark(tweetId: string): Promise<{ data: { bookmarked: boolean } }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/bookmarks`, {
      method: 'POST',
      body: JSON.stringify({ tweet_id: tweetId }),
    });
  }

  // Search
  async searchRecentTweets(
    query: string,
    maxResults: number = 10
  ): Promise<{ data: Tweet[]; meta: { next_token?: string; result_count: number } }> {
    return this.request(
      `/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=${maxResults}&tweet.fields=created_at,author_id,public_metrics`
    );
  }

  // Direct Messages
  async sendDirectMessage(
    participantId: string,
    text: string
  ): Promise<{ data: { dm_event_id: string } }> {
    return this.request('/dm_conversations/with/' + participantId + '/messages', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async getDirectMessages(maxResults: number = 20): Promise<{ data: DirectMessage[] }> {
    return this.request(`/dm_events?max_results=${maxResults}&dm_event.fields=created_at,sender_id,text`);
  }

  async getConversationMessages(conversationId: string, maxResults: number = 20): Promise<{ data: DirectMessage[] }> {
    return this.request(`/dm_conversations/${conversationId}/dm_events?max_results=${maxResults}`);
  }

  // Media Upload (uses v1.1 API)
  async uploadMedia(mediaData: string, mediaType: 'image' | 'video'): Promise<{ media_id_string: string }> {
    // Note: This uses the v1.1 upload endpoint
    const response = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.bearerToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        media_data: mediaData,
        media_category: mediaType === 'video' ? 'tweet_video' : 'tweet_image',
      }),
    });

    if (!response.ok) {
      throw new Error(`Media upload failed: ${response.status}`);
    }

    return response.json();
  }

  // Lists
  async getMyLists(): Promise<{ data: { id: string; name: string }[] }> {
    const me = await this.getMe();
    return this.request(`/users/${me.data.id}/owned_lists`);
  }

  async createList(name: string, description?: string, isPrivate: boolean = false): Promise<{ data: { id: string; name: string } }> {
    return this.request('/lists', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
      }),
    });
  }

  async addListMember(listId: string, userId: string): Promise<{ data: { is_member: boolean } }> {
    return this.request(`/lists/${listId}/members`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  // Spaces (Audio)
  async getSpaces(spaceIds: string[]): Promise<{ data: { id: string; title: string; state: string }[] }> {
    return this.request(`/spaces?ids=${spaceIds.join(',')}&space.fields=title,state,host_ids,created_at`);
  }

  async searchSpaces(query: string): Promise<{ data: { id: string; title: string; state: string }[] }> {
    return this.request(`/spaces/search?query=${encodeURIComponent(query)}&space.fields=title,state,host_ids`);
  }

  // OAuth 2.0 PKCE helpers
  static getAuthorizationUrl(
    clientId: string,
    redirectUri: string,
    scopes: string[],
    state: string,
    codeChallenge: string
  ): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(
    clientId: string,
    code: string,
    redirectUri: string,
    codeVerifier: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
  }> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.status}`);
    }

    return response.json();
  }
}

export function createTwitterClient(
  bearerToken?: string,
  accessToken?: string
): TwitterClient {
  return new TwitterClient({ bearerToken, accessToken });
}

// Available OAuth 2.0 scopes
export const TWITTER_SCOPES = {
  TWEET_READ: 'tweet.read',
  TWEET_WRITE: 'tweet.write',
  TWEET_MODERATE_WRITE: 'tweet.moderate.write',
  USERS_READ: 'users.read',
  FOLLOWS_READ: 'follows.read',
  FOLLOWS_WRITE: 'follows.write',
  OFFLINE_ACCESS: 'offline.access',
  SPACE_READ: 'space.read',
  MUTE_READ: 'mute.read',
  MUTE_WRITE: 'mute.write',
  LIKE_READ: 'like.read',
  LIKE_WRITE: 'like.write',
  LIST_READ: 'list.read',
  LIST_WRITE: 'list.write',
  BLOCK_READ: 'block.read',
  BLOCK_WRITE: 'block.write',
  BOOKMARK_READ: 'bookmark.read',
  BOOKMARK_WRITE: 'bookmark.write',
  DM_READ: 'dm.read',
  DM_WRITE: 'dm.write',
} as const;
