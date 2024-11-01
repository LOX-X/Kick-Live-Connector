export enum Events {
  ChatMessage = "chatMessage",
  MessageDeleted = "messageDeleted",
  PinnedMessageCreated = "pinnedMessageCreated",
  PinnedMessageDeleted = "pinnedMessageDeleted",
  PollUpdate = "pollUpdate",
  PollDelete = "pollDelete",
  UserBanned = "userBanned",
  UserUnBanned = "userUnBanned",
  Subscription = "subscription",
  GiftedSubscriptions = "giftedSubscriptions",
  LuckyUsersWhoGotGiftSubscriptions = "luckyUsersWhoGotGiftSubscriptions",
  GiftsLeaderboardUpdated = "giftsLeaderboardUpdated",
  ChatMoveToSupportedChannel = "chatMoveToSupportedChannel",
  StreamHost = "streamHost",
  ChatroomClear = "chatroomClear",
  StreamEnd = "streamEnd",
  StreamerIsLive = "streamerIsLive",
  ViewerCount = "viewerCount",
  Connected = "connected",
  Disconnected = "disconnected",
  Error = "error",
}

export interface KickConnectionEvents {
  [Events.ChatMessage]: {
    id: string;
    chatroom_id: number;
    content: string;
    type: "message" | "reply";
    created_at: string;
    sender: {
      id: number;
      username: string;
      slug: string;
      identity: {
        color: string;
        badges: [{ type: string; text: string; count?: number }];
      };
    };
    metadata?: {
      original_sender: { id: number; username: string };
      original_message: { id: string; content: string };
    };
  };
  [Events.MessageDeleted]: {
    id: string;
    message: { id: string };
    aiModerated: boolean;
  };
  [Events.PinnedMessageCreated]: {
    message: {
      id: string;
      chatroom_id: number;
      content: string;
      type: string;
      created_at: string;
      sender: {
        id: number;
        username: string;
        slug: string;
        identity: {
          color: string;
          badges: [{ type: string; text: string; count: number }];
        };
      };
      metadata: null | any;
    };
    duration: string;
    pinnedBy: {
      id: number;
      username: string;
      slug: string;
      identity: {
        color: string;
        badges: [
          { type: string; text: string; count?: number; active?: boolean }
        ];
      };
    };
  };
  [Events.PinnedMessageDeleted]: void;
  [Events.PollUpdate]: {
    poll: {
      title: string;
      options: [{ id: number; label: string; votes: number }];
      duration: number;
      remaining: number;
      result_display_duration: number;
      has_voted: boolean;
      voted_option_id: null | any;
    };
  };
  [Events.PollDelete]: void;
  [Events.UserBanned]: {
    id: string;
    user: { id: number; username: string; slug: string };
    banned_by: { id: number; username: string; slug: string };
    permanent: boolean;
    duration: number;
    expires_at: string;
  };
  [Events.UserUnBanned]: {
    id: string;
    user: { id: number; username: string; slug: string };
    unbanned_by: { id: number; username: string; slug: string };
    permanent: boolean;
  };
  [Events.Subscription]: {
    chatroom_id: number;
    username: string;
    months: number;
  };
  [Events.GiftedSubscriptions]: {
    chatroom_id: number;
    gifted_usernames: Array<string>;
    gifter_username: string;
    gifter_total: number;
  };
  [Events.GiftsLeaderboardUpdated]: {
    channel: {
      id: number;
      user_id: number;
      slug: string;
      is_banned: boolean;
      playback_url: string;
      name_updated_at: null;
      vod_enabled: boolean;
      subscription_enabled: boolean;
      can_host: boolean;
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
    };
    leaderboard: [{ user_id: number; username: string; quantity: number }];
    weekly_leaderboard: [
      { user_id: number; username: string; quantity: number }
    ];
    monthly_leaderboard: [
      { user_id: number; username: string; quantity: number }
    ];
    gifter_id: number;
    gifted_quantity: number;
    gifter_username: string;
  };
  [Events.LuckyUsersWhoGotGiftSubscriptions]: {
    channel: {
      id: number;
      user_id: number;
      slug: string;
      is_banned: boolean;
      playback_url: string;
      name_updated_at: null;
      vod_enabled: boolean;
      subscription_enabled: boolean;
      can_host: boolean;
    };
    usernames: string[];
    gifter_username: string;
  };

  [Events.ChatMoveToSupportedChannel]: {
    channel: {
      id: number;
      user_id: number;
      slug: string;
      is_banned: false;
      playback_url: string;
      name_updated_at: null | any;
      vod_enabled: true;
      subscription_enabled: boolean;
      can_host: boolean;
      current_livestream: {
        id: number;
        slug: string;
        channel_id: number;
        created_at: string;
        session_title: string;
        is_live: boolean;
        risk_level_id: null | any;
        start_time: string;
        source: null | any;
        twitch_channel: null | any;
        duration: number;
        language: string;
        is_mature: boolean;
        viewer_count: number;
      };
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
      };
    };
    slug: string;
    hosted: {
      id: number;
      username: string;
      slug: string;
      viewers_count: number;
      is_live: true;
      profile_pic: string;
      category: string;
      preview_thumbnail: {
        srcset: string;
        src: string;
      };
    };
  };
  [Events.StreamHost]: {
    chatroom_id: number;
    optional_message: string;
    number_viewers: number;
    host_username: string;
  };
  [Events.ChatroomClear]: { id: string };
  [Events.StreamEnd]: { username: string };
  [Events.StreamerIsLive]: {
    livestream: {
      id: number;
      channel_id: number;
      session_title: string;
      source: null | any;
      created_at: string;
    };
  };
  [Events.ViewerCount]: { livestream_id: number; viewers: number };
  [Events.Connected]: { roomID: number };
  [Events.Disconnected]: void;
  [Events.Error]: any;
}
