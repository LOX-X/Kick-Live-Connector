export interface ChatRoomDataResponse {
  id: number;
  slow_mode: { enabled: boolean; message_interval: number };
  subscribers_mode: { enabled: boolean };
  followers_mode: { enabled: boolean; min_duration: number };
  emotes_mode: { enabled: boolean };
  advanced_bot_protection: { enabled: boolean; remaining_time: number };
  pinned_message: null;
  show_quick_emotes: { enabled: boolean };
  show_banners: { enabled: boolean };
  gifts_enabled: { enabled: boolean };
  gifts_week_enabled: { enabled: boolean };
  gifts_month_enabled: { enabled: boolean };
}

export interface ChatRoomSettingsResponse {
  status: { error: boolean; code: number; message: string };
  data: {
    settings: {
      slow_mode: boolean;
      followers_mode: boolean;
      subscribers_mode: boolean;
      emotes_mode: boolean;
      message_interval: number;
      following_min_duration: number;
      email_verified_required: boolean;
      phone_verified_required: boolean;
      non_verified_email_min_age: number;
      non_verified_phone_min_age: boolean;
      anti_bot_mode: boolean;
      allow_link: boolean;
      bot_name: string;
      account_age_mode: boolean;
      account_age_min_duration: number;
      show_quick_emotes: boolean;
      show_banners: boolean;
      advanced_bot_protection: boolean;
      gifts_enabled: boolean;
      gifts_week_enabled: boolean;
      gifts_month_enabled: boolean;
    };
  };
}

export interface ChannelDataResponse {
  id: number;
  user_id: number;
  slug: string;
  is_banned: boolean;
  playback_url: string;
  vod_enabled: boolean;
  subscription_enabled: boolean;
  followers_count: number;
  subscriber_badges: [
    {
      id: number;
      channel_id: number;
      months: number;
      badge_image: [
        {
          srcset: string;
          src: string;
        }
      ];
    }
  ];
  banner_image: {
    url: string;
  };
  livestream?: {
    id: number;
    slug: string;
    channel_id: number;
    created_at: string;
    session_title: string;
    is_live: boolean;
    risk_level_id: null;
    start_time: string;
    source: null;
    twitch_channel: null;
    duration: number;
    language: string;
    is_mature: boolean;
    viewer_count: number;
    thumbnail: {
      url: string;
    };
    categories: [
      {
        id: number;
        category_id: number;
        name: string;
        slug: string;
        tags: string[];
        description: null;
        deleted_at: null;
        viewers: number;
        category: { id: number; name: string; slug: string; icon: string };
      }
    ];
    tags: Array<any>;
  };
  role: null;
  muted: boolean;
  follower_badges: [];
  offline_banner_image: null;
  verified: boolean;
  recent_categories: [
    {
      id: number;
      category_id: number;
      name: string;
      slug: string;
      tags: string[];
      description: null;
      deleted_at: null;
      viewers: number;
      banner: [
        {
          responsive: string;
          url: string;
        }
      ];
      category: [{ id: number; name: string; slug: string; icon: string }];
    }
  ];
  can_host: boolean;
  user: {
    id: number;
    username: string;
    agreed_to_terms: boolean;
    email_verified_at: string;
    bio: string;
    country: string;
    state: string;
    city: string;
    instagram: string;
    twitter: string;
    youtube: string;
    discord: string;
    tiktok: string;
    facebook: string;
    profile_pic: string;
  };
  chatroom: {
    id: number;
    chatable_type: string;
    channel_id: number;
    created_at: string;
    updated_at: string;
    chat_mode_old: string;
    chat_mode: string;
    slow_mode: boolean;
    chatable_id: number;
    followers_mode: boolean;
    subscribers_mode: boolean;
    emotes_mode: boolean;
    message_interval: number;
    following_min_duration: number;
  };
}

export interface CurrentViewersResponse {
  livestream_id: number;
  viewers: number;
}

export interface LeaderboardsResponse {
  gifts: [{ user_id: number; username: string; quantity: number }];
  gifts_enabled: boolean;
  gifts_week: [{ user_id: number; username: string; quantity: number }];
  gifts_week_enabled: boolean;
  gifts_month: [{ user_id: number; username: string; quantity: number }];
  gifts_month_enabled: boolean;
}

export interface LiveStreamDetailsResponse {
  data: {
    id: number;
    slug: string;
    session_title: string;
    created_at: string;
    language: string;
    is_mature: boolean;
    viewers: number;
    category: {
      id: number;
      name: string;
      slug: string;
      tags: [
        {
          id: number;
          name: string;
          slug: string;
          tags: string[];
          parent_category: { id: number; slug: string };
        }
      ];
      parent_category: [{ id: number; slug: string }];
    };
    playback_url: string;
    thumbnail: {
      src: string;
      srcset: string;
    };
  };
}

export interface CategoriesResponse {
  id: number;
  name: string;
  slug: string;
  icon: string;
}
[];

export interface SubcategoriesResponse {
  current_page: number;
  data: [
    {
      id: number;
      category_id: number;
      name: string;
      slug: string;
      tags: string[];
      description: null;
      deleted_at: null;
      viewers: number;
      banner: [
        {
          responsive: string;
          url: string;
        }
      ];
      category: [
        {
          responsive: string;
          url: string;
        }
      ];
    }
  ];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: [
    {
      url: string;
      label: string;
      active: boolean;
    }
  ];
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface TopCategoriesResponse {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  tags: string[];
  description: string;
  deleted_at: string | null;
  viewers: number;
  banner: {
    src: string;
    srcset: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    icon: string;
  };
}


export interface FeaturedLivestreamsResponse {
  data: [
    {
      id: number;
      slug: string;
      channel_id: number;
      created_at: string;
      session_title: string;
      is_live: boolean;
      risk_level_id: null;
      start_time: string;
      source: null;
      twitch_channel: null;
      duration: number;
      language: string;
      is_mature: boolean;
      viewer_count: number;
      order: number;
      thumbnail: [
        {
          srcset: string;
          src: string;
        }
      ];
      viewers: number;
      channel: [
        {
          srcset: string;
          src: string;
        }
      ];
      categories: string[];
    }
  ];
  first_page_url: string;
  from: number;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
}
