// YouTube Client using Data API v3
// Documentation: https://developers.google.com/youtube/v3

interface YouTubeConfig {
  accessToken: string;
  apiKey?: string;
}

interface VideoUploadParams {
  title: string;
  description?: string;
  tags?: string[];
  categoryId?: string;
  privacyStatus?: 'private' | 'public' | 'unlisted';
  publishAt?: string;
  thumbnailUrl?: string;
}

interface Video {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    channelId: string;
    thumbnails: {
      default: { url: string };
      medium: { url: string };
      high: { url: string };
    };
    tags?: string[];
    categoryId: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
  status: {
    privacyStatus: string;
    uploadStatus: string;
  };
}

interface Channel {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    thumbnails: {
      default: { url: string };
      high: { url: string };
    };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

interface Comment {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        textDisplay: string;
        authorDisplayName: string;
        authorProfileImageUrl: string;
        likeCount: number;
        publishedAt: string;
      };
    };
    totalReplyCount: number;
  };
}

interface Playlist {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
    };
  };
  contentDetails: {
    itemCount: number;
  };
}

export class YouTubeClient {
  private config: YouTubeConfig;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(config: YouTubeConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    } else if (this.config.apiKey) {
      url.searchParams.append('key', this.config.apiKey);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Channel
  async getMyChannel(): Promise<{ items: Channel[] }> {
    return this.request('/channels?part=snippet,statistics,contentDetails&mine=true');
  }

  async getChannel(channelId: string): Promise<{ items: Channel[] }> {
    return this.request(`/channels?part=snippet,statistics,contentDetails&id=${channelId}`);
  }

  // Videos
  async getMyVideos(maxResults: number = 25): Promise<{ items: Video[] }> {
    const channel = await this.getMyChannel();
    if (!channel.items.length) throw new Error('No channel found');
    
    return this.request(
      `/search?part=snippet&channelId=${channel.items[0].id}&type=video&maxResults=${maxResults}`
    );
  }

  async getVideo(videoId: string): Promise<{ items: Video[] }> {
    return this.request(
      `/videos?part=snippet,statistics,status,contentDetails&id=${videoId}`
    );
  }

  async updateVideo(
    videoId: string,
    params: Partial<VideoUploadParams>
  ): Promise<Video> {
    return this.request('/videos?part=snippet,status', {
      method: 'PUT',
      body: JSON.stringify({
        id: videoId,
        snippet: {
          title: params.title,
          description: params.description,
          tags: params.tags,
          categoryId: params.categoryId,
        },
        status: {
          privacyStatus: params.privacyStatus,
          publishAt: params.publishAt,
        },
      }),
    });
  }

  async deleteVideo(videoId: string): Promise<void> {
    await this.request(`/videos?id=${videoId}`, { method: 'DELETE' });
  }

  // For video upload, you need to use resumable upload
  async initiateVideoUpload(params: VideoUploadParams): Promise<string> {
    const response = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          snippet: {
            title: params.title,
            description: params.description,
            tags: params.tags,
            categoryId: params.categoryId || '22',
          },
          status: {
            privacyStatus: params.privacyStatus || 'private',
            publishAt: params.publishAt,
          },
        }),
      }
    );

    const uploadUrl = response.headers.get('Location');
    if (!uploadUrl) throw new Error('Failed to initiate upload');
    return uploadUrl;
  }

  // Comments
  async getComments(videoId: string, maxResults: number = 25): Promise<{ items: Comment[] }> {
    return this.request(
      `/commentThreads?part=snippet&videoId=${videoId}&maxResults=${maxResults}&order=relevance`
    );
  }

  async postComment(videoId: string, text: string): Promise<Comment> {
    return this.request('/commentThreads?part=snippet', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      }),
    });
  }

  async replyToComment(parentId: string, text: string): Promise<Comment> {
    return this.request('/comments?part=snippet', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          parentId,
          textOriginal: text,
        },
      }),
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.request(`/comments?id=${commentId}`, { method: 'DELETE' });
  }

  // Playlists
  async getMyPlaylists(maxResults: number = 25): Promise<{ items: Playlist[] }> {
    return this.request(
      `/playlists?part=snippet,contentDetails&mine=true&maxResults=${maxResults}`
    );
  }

  async createPlaylist(
    title: string,
    description?: string,
    privacyStatus: 'private' | 'public' | 'unlisted' = 'private'
  ): Promise<Playlist> {
    return this.request('/playlists?part=snippet,status', {
      method: 'POST',
      body: JSON.stringify({
        snippet: { title, description },
        status: { privacyStatus },
      }),
    });
  }

  async addToPlaylist(playlistId: string, videoId: string): Promise<{ id: string }> {
    return this.request('/playlistItems?part=snippet', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId,
          },
        },
      }),
    });
  }

  // Analytics (requires YouTube Analytics API)
  async getVideoAnalytics(
    videoId: string,
    startDate: string,
    endDate: string,
    metrics: string[] = ['views', 'estimatedMinutesWatched', 'averageViewDuration', 'likes', 'comments']
  ): Promise<{ rows: unknown[][] }> {
    const url = new URL('https://youtubeanalytics.googleapis.com/v2/reports');
    url.searchParams.append('ids', 'channel==MINE');
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);
    url.searchParams.append('metrics', metrics.join(','));
    url.searchParams.append('filters', `video==${videoId}`);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`);
    }

    return response.json();
  }

  // Search
  async search(
    query: string,
    type: 'video' | 'channel' | 'playlist' = 'video',
    maxResults: number = 25
  ): Promise<{ items: { id: { videoId?: string; channelId?: string; playlistId?: string }; snippet: { title: string; description: string } }[] }> {
    return this.request(
      `/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=${maxResults}`
    );
  }

  // Live Streaming
  async getLiveBroadcasts(): Promise<{ items: { id: string; snippet: { title: string; scheduledStartTime: string } }[] }> {
    return this.request('/liveBroadcasts?part=snippet,status&mine=true');
  }

  async createLiveBroadcast(
    title: string,
    scheduledStartTime: string,
    privacyStatus: 'private' | 'public' | 'unlisted' = 'private'
  ): Promise<{ id: string }> {
    return this.request('/liveBroadcasts?part=snippet,status', {
      method: 'POST',
      body: JSON.stringify({
        snippet: {
          title,
          scheduledStartTime,
        },
        status: {
          privacyStatus,
        },
      }),
    });
  }
}

export function createYouTubeClient(
  accessToken: string,
  apiKey?: string
): YouTubeClient {
  return new YouTubeClient({ accessToken, apiKey });
}

// Video categories
export const VIDEO_CATEGORIES = {
  '1': 'Film & Animation',
  '2': 'Autos & Vehicles',
  '10': 'Music',
  '15': 'Pets & Animals',
  '17': 'Sports',
  '19': 'Travel & Events',
  '20': 'Gaming',
  '22': 'People & Blogs',
  '23': 'Comedy',
  '24': 'Entertainment',
  '25': 'News & Politics',
  '26': 'Howto & Style',
  '27': 'Education',
  '28': 'Science & Technology',
  '29': 'Nonprofits & Activism',
} as const;
