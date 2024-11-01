# Kick-Live-Connector

A Node.js library to receive real-time events from Kick LIVE by connecting to Kick's WebSocket service. This package enables tracking live stream events using a straightforward setup requiring only the streamer's username. You can connect to your own or other streamers' live chats without needing any credentials. Supported events include [Chat Messages](#chat-message), [Gifted Subscriptions](#gifted-subscriptions), [User Subscriptions](#subscription), [Viewer Counts](#viewer-count), and other events like [Streamer Is Live](#streamer-is-live).

**NOTE:** This is not an official API. It's a reverse engineering project. While Kick has its own API, it currently requires registration for access. A public API is expected to be released by Kick in the future.

**Library Design Tip:** This library is written in TypeScript to provide enhanced type safety and better support for development. You can still use the library in JavaScript, but using TypeScript will allow you to see detailed type definitions for incoming data, making it simpler to handle each event. Some type definitions may still be refined, and improvements will be released in future updates.

**NOTE:** This library is designed for use in Node.js environments. If you want to process or display the data on the client side (in the browser), you’ll need to transfer it from the Node.js environment. One effective approach for this is to use Socket.IO or a similar low-latency communication framework.


#### Overview
- [Getting started](#getting-started)
- [Events](#events)
- [Contributing](#contributing)

## Getting started

1. Install the package via NPM
```
npm i kick-live-connector
```

2. Create your first chat connection

```javascript
import { KickConnection , Events} from "kick-live-connector";

const username = "lox-x";

const kickConnection = new KickConnection(username);

// Connect to the chat (await can be used as well)
kickConnection.connect().then((status) => {
    console.log(`Connected to chatroom ${status.roomID}`);
  })
  .catch((error) => {
    console.error("Connection failed:", error);
  });

// Define the events that you want to handle
kickConnection.on(Events.ChatMessage, (data) => {
  const { content, sender } = data;
  console.log(`${sender.username} says: ${content}`);
});

// ... more events described in the documentation below
```

3. For typeScript run the following command.

This will create a tsconfig.json file in your project root, which you can modify to suit your project's specific TypeScript settings.
```
tsc --init
```

## Events

Connection Events:
- [connected](#connected)
- [disconnected](#disconnected)
- [error](#error)

Chat Events:
- [ChatMessage](#chat-message)
- [MessageDeleted](#message-deleted)
- [PinnedMessageCreated](#pinned-message-created)
- [PinnedMessageDeleted](#pinned-message-deleted)
- [PollUpdate](#poll-update)
- [PollDelete](#poll-delete)
- [UserBanned](#user-banned)
- [UserUnBanned](#user-unbanned)
- [Subscription](#subscription)
- [GiftedSubscriptions](#gifted-subscriptions)
- [LuckyUsersWhoGotGiftSubscriptions](#lucky-users-who-got-gift-subscriptions)
- [GiftsLeaderboardUpdated](#gifts-leaderboard-updated)

Stream Events:
- [StreamEnd](#streamend)
- [StreamerIsLive](#streamer-is-live)
- [StreamHost](#stream-host)
- [ChatMoveToSupportedChannel](#chat-move-to-supported-channel)
- [ViewerCount](#viewer-count)
- [ChatroomClear](#chatroom-clear)

<br><br>

### Connection Events

### `Connected`
Triggered when the connection is successfully established.

```javascript
tiktokLiveConnection.on(Events.Connected, state => {
    console.log(`Connected. RoomID:${state.roomID}`);
})
```

### `Disconnected`
Triggered when the connection gets disconnected. In that case you can call `connect()` again to have a reconnect logic.

```javascript
tiktokLiveConnection.on(Events.Disconnected, () => {
    console.log('Disconnected');
})
```
<br>

### `Error`
General error event. You should handle this.

```javascript
tiktokLiveConnection.on(Events.Error, err => {
    console.error('Error!', err);
})
```
<br>

### Chat Events

### `Chat Message`
Triggered every time a new chat comment arrives.

```javascript
tiktokLiveConnection.on(Events.ChatMessage, message => {
    if(message.type == "reply") {
        console.log(`${message.sender.username} replyed to ${metadata.original_sender.username} said: ${message.content}`);
    }else{
        console.log(`${message.sender.username} said: ${message.content}`);
    }
})

```

<details><summary>Show Data Structure</summary><p>

```javascript
//Message
{
  id: '00000000-0000-0000-0000-000000000000',
  chatroom_id: 0000,
  content: 'test',
  type: 'message',
  created_at: '2024-10-27T14:11:52+00:00',
  sender: {
    id: 346148,
    username: 'User',
    slug: 'user',
    identity: { color: '#FF9D00', badges: [
        { type: 'subscriber', text: 'Subscriber', count: 4 },
        { type: 'sub_gifter', text: 'Sub Gifter', count: 4 }
    ]}
  }
}

//Reply
{
  id: '00000000-0000-0000-0000-000000000000',
  chatroom_id: 00000000,
  content: 'test2',
  type: 'reply',
  created_at: '2024-10-27T14:21:32+00:00',
  sender: {
    id: 000000,
    username: 'User2',
    slug: 'user2',
    identity: { color: '#E9113C', badges: [] }
  },
  metadata: {
    original_sender: { id: 44065611, username: 'User1' },
    original_message: { id: '579f6afc-88ea-45fc-8dfd-1336e29ecb8b', content: 'test' }
  }
}
```
</p></details>

<br>

### `Message Deleted`
Triggered every time a message is deleted.

```javascript
kickConnection.on(Events.MessageDeleted,(message)=>{
    console.log(`Message Deleted ${message.id}`)
})
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
{
  id: '00000000-0000-0000-0000-000000000000',
  message: { id: '00000000-0000-0000-0000-000000000000' },
  aiModerated: false // True if deleted by bot
}
}
```
</p></details>
<br>

### `Pinned Message Created`
Triggered every time a message is pinned. If a new message is pinned while there’s already a pinned message, the existing pinned message will be replaced, and this event will trigger again.

```javascript
kickConnection.on(Events.PinnedMessageCreated,(message)=>{
    console.log(message)
})
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
  message: {
    id: '00000000-0000-0000-0000-000000000000',
    chatroom_id: 00000000,
    content: 'test',
    type: 'message',
    created_at: '2024-10-27T14:48:44+00:00',
    sender: {
      id: 00000000,
      username: 'User',
      slug: 'user',
      identity: [{
        color: string;
         badges: [ { type: 'broadcaster', text: 'Broadcaster', active: true } ];
      }]
    },
    metadata: null
  },
  duration: '1200',
  pinnedBy: {
    id: 44065611,
    username: 'User',
    slug: 'user',
    identity: { color: '#E9113C', badges: [] }
  }
}

```
</p></details>
<br>

### `Pinned Message Deleted`
Triggered when a previously pinned message is unpinned.

```javascript
kickConnection.on(Events.PinnedMessageDeleted,()=>{
    console.log(`Pinned Message Unpinned`)
})
```


### `Poll Update`
Triggered when a poll is created or updated. When a poll is created, when a user votes, this event provides the latest details about the poll, including the current vote counts for each option and the remaining time.

```javascript
kickConnection.on(Events.PollUpdate, (data) => {
    if(data.poll.has_voted === false){
        console.log(`Poll Created: "${data.poll.title}" - Remaining Time: ${data.poll.remaining} seconds`);
    }else{
        console.log(`Poll Updated: "${data.poll.title}" - Remaining Time: ${data.poll.remaining} seconds`);
        data.poll.options.forEach(option => {
            console.log(`Option: ${option.label}, Votes: ${option.votes}`);
        });
    }
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
//when poll is created
{
  poll: {
    title: 'What do you prefer?',
    options: [
        { id: 0, label: 'javascript', votes: 0 },
        { id: 1, label: 'typescript', votes: 0 }
    ],
    duration: 30,
    remaining: 30,
    result_display_duration: 15,
    has_voted: false,
    voted_option_id: null
  }
}

// When a user votes (poll update)
{
  poll: {
    title: 'What do you prefer?',
    options: [ 
        { id: 0, label: 'javascript', votes: 0 },
        { id: 1, label: 'typescript', votes: 1 }
    ],
    duration: 30,
    remaining: 22,
    result_display_duration: 15
  }
}


```
</p></details>
<br>

### `Poll Delete`
Triggered when a poll is deleted. This event indicates that the poll is no longer active, and any associated data, such as vote counts and options, will no longer be available.

```javascript
kickConnection.on(Events.PollDelete, () => {
    console.log(`Poll Deleted`);
});
```

### `User Banned`
Triggered every time a user get Permanent ban or Timeout.

```javascript

kickConnection.on(Events.UserBanned,  (data) => {
    if(permanent){
        console.log(`${data.user.username} was permanently banned by ${data.banned_by.username}`)
        //User2 was permanently banned by User1
    }else{
        console.log(`User ${data.user} was timed out by ${data.banned_by} for ${data.duration}`);
        //User2 was timed out by User1 for 1440(1 day)
    }
});


```

<details><summary>Show Data Structure</summary><p>

```javascript
//Permanent Ban
{
  id: '00000000-0000-0000-0000-000000000000',
  user: { id: 00000000, username: 'User2', slug: 'user2' },
  banned_by: { id: 00000000, username: 'User1', slug: 'user1' },
  permanent: true
}

//Timeout
{
  id: '00000000-0000-0000-0000-000000000000',
  user: { id: 00000000, username: 'User2', slug: 'user2' },
  banned_by: { id: 00000000, username: 'User1', slug: 'user1' },
  permanent: false,
  duration: 1440,//1 day
  expires_at: '2024-10-27T16:48:34+00:00'
}
```
</p></details>
<br>

### `User UnBanned`
Triggered every time a user get UnBanned or UnMuted.

```javascript
kickConnection.on(Events.UserUnBanned,  (data) => {
     if(permanent){
        console.log(`${data.user.username} has unbanned by ${data.banned_by.username}`)
    }else{
        console.log(`User ${data.user} has been unmuted by ${data.banned_by} for ${data.duration}`);
    }
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
//Permanent Ban Removed
{
  id: '00000000-0000-0000-0000-000000000000',
  user: { id: 00000000, username: 'User2', slug: 'user2' },
  unbanned_by: { id: 00000000, username: 'User1', slug: 'user1' },
  permanent: true
}

//Timeout Removed
{
  id: '00000000-0000-0000-0000-000000000000',
  user: { id: 00000000, username: 'User2', slug: 'user2' },
  unbanned_by: { id: 00000000, username: 'User1', slug: 'user1' },
  permanent: false,
}
```
</p></details>
<br>

### `Subscription`
Triggered every time someone subscribe to the channel.

```javascript
kickConnection.on(Events.Subscription,  (data) => {
    console.log(`${data.username} has Subscribed for ${data.months} month`)
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
    chatroom_id: 0000;
    username: "user";
    months: 12;
};
```
</p></details>
<br>

### `Gifted Subscriptions`
Triggered every time a user gift subscription to users. After this event, [Gifts Leaderboard Updated](#gifts-leaderboard-updated) will be triggered and [Lucky Users Who Got Gift Subscriptions](#lucky-users-who-got-gift-subscriptions).

```javascript
kickConnection.on(Events.GiftedSubscriptions,  (data) => {
    const giftedAmount = data.gifted_usernames.length
    console.log(`${data.gifter_username} gifted ${giftedAmount} subscriptions! 🎁`);
    console.log(`Total gifts by ${gifter_username}: ${gifter_total} subscriptions.`);
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
  chatroom_id: 0000,
  gifted_usernames: [ 'user1', 'user2', 'user3', 'user4', 'user5' ],
  gifter_username: 'user',
  gifter_total: 10
}
```
</p></details>
<br>

### `Lucky Users Who Got Gift Subscriptions`
Triggered after the [Gifted Subscriptions](#gifted-subscriptions) event, this event provides details about users who received gift subscriptions, including the gifter.

```javascript
kickConnection.on(Events.LuckyUsersWhoGotGiftSubscriptions,(data)=>{
     console.log(`${data.gifter_username} gifted subscriptions to the following users:`);
    data.usernames.forEach(username => {
        console.log(`* ${username}`);
    });
})
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
  channel: {
    id: 0000,
    user_id: 0000,
    slug: 'hostName',
    is_banned: false,
    playback_url: 'https://',
    name_updated_at: null,
    vod_enabled: true,
    subscription_enabled: true,
    can_host: true
  },
  usernames: [ 'user1', 'user2', 'user3', 'user4', 'user5' ],
  gifter_username: 'user'
}
```
</p></details>
<br>

### `Gifts Leaderboard Updated`
Triggered after a [Gifted Subscriptions](#gifted-subscriptions) event, updating the leaderboard with the latest gift data.

```javascript
kickConnection.on(Events.GiftsLeaderboardUpdated,(data)=>{
    console.log(`${data.gifter_username} gifted ${data.gifted_quantity} subscriptions! 🎁`)
})
```
<details><summary>Show Data Structure</summary><p>

```javascript
{
  channel: {
    id: 0000,
    user_id: 0000,
    slug: 'user',
    is_banned: false,
    playback_url: 'https://',
    name_updated_at: null,
    vod_enabled: true,
    subscription_enabled: true,
    can_host: true,
    chatroom: {
      id: 0000,
      chatable_type: 'App\\Models\\Channel',
      channel_id: 0000,
      created_at: '2022-11-19T21:18:18.000000Z',
      updated_at: '2024-10-27T15:50:44.000000Z',
      chat_mode_old: 'public',
      chat_mode: 'followers_only',
      slow_mode: true,
      chatable_id: 0000,
      followers_mode: true,
      subscribers_mode: false,
      emotes_mode: false,
      message_interval: 2,
      following_min_duration: 10
    }
  },
  leaderboard: [
    { user_id: 00000000, username: 'user1', quantity: 3889 },
    { user_id: 00000000, username: 'user2', quantity: 3281 },
    { user_id: 00000000, username: 'user3', quantity: 661 },
    { user_id: 00000000, username: 'user4', quantity: 560 },
    { user_id: 00000000, username: 'user5', quantity: 450 },
    { user_id: 00000000, username: 'user6', quantity: 330 },
    { user_id: 00000000, username: 'user7', quantity: 309 },
    { user_id: 00000000, username: 'user8', quantity: 250 },
    { user_id: 00000000, username: 'user9', quantity: 230 },
    { user_id: 00000000, username: 'user10', quantity: 175 }
  ],
  weekly_leaderboard: [],
  monthly_leaderboard: [
    { user_id: 00000000, username: 'user11', quantity: 450 },
    { user_id: 00000000, username: 'user12', quantity: 299 },
    { user_id: 00000000, username: 'user13', quantity: 54 },
    { user_id: 00000000, username: 'user14', quantity: 45 },
    { user_id: 00000000, username: 'user15', quantity: 20 },
    { user_id: 00000000, username: 'user16', quantity: 15 },
    { user_id: 00000000, username: 'user17', quantity: 9 },
    { user_id: 00000000, username: 'user18', quantity: 8 },
    { user_id: 00000000, username: 'user19', quantity: 6 },
    { user_id: 00000000, username: 'user20', quantity: 6 }
  ],
  gifter_id: 0000,
  gifted_quantity: 5,
  gifter_username: 'user'
}
```
</p></details>

<br>

### Stream Events

### `Stream End`

Triggers when the host end the live. This event takes some time after the streamer is offline.

```javascript
kickConnection.on(Events.StreamEnd,  (data) => {
    console.log(`${data.username} went offline`)
}); 

```
</p></details>

<br>

### `Streamer Is Live`

Triggers when the host is back online.

```javascript
kickConnection.on(Events.StreamerIsLive,  () => {
    console.log(`I am back`)
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
    livestream: {
      id: number;
      channel_id: number;
      session_title: string;
      source: null | any;
      created_at: string;
    };
}
```
</p></details>

<br>

### `Stream Host`
Triggered when a streamer hosts another user.

```javascript
kickConnection.on(Events.StreamHost,  (data) => {
    console.log(`Hosting Stream: ${data.host_username} with ${data.number_viewers} viewers.`);
}); 

```

<details><summary>Show Data Structure</summary><p>

```javascript
{
  chatroom_id: 0000,
  optional_message: 'have fun',
  number_viewers: 77,
  host_username: 'user'
}
```
</p></details>

<br>

### `Chat Move To Supported Channel`
This event's triggering conditions are currently unknown.

```javascript
kickConnection.on(Events.ChatMoveToSupportedChannel, (data) => {
    console.log("Chat has moved to a supported channel:", data);
});
```

<details><summary>Show Data Structure</summary><p>

```javascript
{
  channel: {
    id: 0000,
    user_id: 0000,
    slug: 'user1',
    is_banned: false,
    playback_url: 'https://',
    name_updated_at: null,
    vod_enabled: true,
    subscription_enabled: true,
    can_host: false,
    current_livestream: {
      id: 0000000,
      slug: '0000000-0000-0000-0000',
      channel_id: 0000,
      created_at: '2024-10-27 14:19:25',
      session_title: 'title',
      is_live: true,
      risk_level_id: null,
      start_time: '2024-10-27 14:19:21',
      source: null,
      twitch_channel: null,
      duration: 0,
      language: 'English',
      is_mature: true,
      viewer_count: 13617
    },
    user: {
      id: 0000,
      username: 'user1',
      agreed_to_terms: true,
      email_verified_at: '2022-11-19T21:18:59.000000Z',
      bio: 'you are the best',
      country: '',
      state: '',
      city: '',
      instagram: '',
      twitter: '',
      youtube: '',
      discord: '',
      tiktok: '',
      facebook: ''
    }
  },
  slug: 'user2',
  hosted: {
    id: 0000,
    username: 'user2',
    slug: 'user2',
    viewers_count: 13747,
    is_live: true,
    profile_pic: 'https://',
    category: 'just-chatting',
    preview_thumbnail: {
      srcset: 'https://',
      src: 'https://'
    }
  }
}
```
</p></details>

<br>

### `Viewer Count`

Triggered every 1 minute, providing the current viewer count.This event may lead to rate limiting.

```javascript
kickConnection.on(Events.ViewerCount,(data)=>{
    console.log(data.viewers)
})
```

<br>

### `Chatroom Clear`
Triggers when the host clear the chat.

```javascript
kickConnection.on(Events.ChatroomClear,()=>{
    console.log("The chatroom has been cleared by the host.")
})
```
<br>

## Contributing
Your improvements are welcome! Feel free to open an <a href="https://github.com/LOX-X/Kick-Live-Connector/issues">issue</a> or <a href="https://github.com/LOX-X/Kick-Live-Connector/pulls">pull request</a>.
