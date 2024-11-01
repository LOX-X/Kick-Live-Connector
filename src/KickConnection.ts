import WebSocket from "ws";
import { EventEmitter } from "events";
import { KickWrapper } from "./KickWrapper";
import { KickConnectionEvents, Events } from "./Events";

declare interface KickConnection {
  on<U extends keyof KickConnectionEvents>(
    event: U | Events,
    listener: (data: KickConnectionEvents[U]) => void
  ): this;
  emit<U extends keyof KickConnectionEvents>(
    event: U | Events,
    data: KickConnectionEvents[U]
  ): boolean;
}

class KickConnection extends EventEmitter {
  private websocket: WebSocket | null = null;
  private readonly username: string;
  private isViewerCountRunning: boolean = false;
  constructor(username: string) {
    super();
    this.username = username;
  }

  public async connect(): Promise<{ roomID: string }> {
    try {
      const kickApi = new KickWrapper();
      return new Promise(async (resolve, reject) => {
        console.log(`Connecting to Live Stream...`);
        const { data } = await kickApi.getLiveStreamDetails(this.username);
        if (!data) return reject(`${this.username} is offline`);
        console.log(`Connected To Live Stream: ID:${data.id}`);
        const chatRoom = await kickApi.getChatRoomData(this.username);
        console.log(`Connected To Chat Room: ID:${chatRoom.id}`);
        const channelData = await kickApi.getChannelData(this.username);
        console.log(`Connected To Channel: ID:${channelData.id}`);

        this.websocket = new WebSocket(
          "wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0-rc2&flash=false"
        );

        this.websocket.on("open", () => {
          console.log("WebSocket connected.");
          const subscribeMessages = [
            {
              event: "pusher:subscribe",
              data: { channel: `chatrooms.${chatRoom.id}.v2` },
            },
            {
              event: "pusher:subscribe",
              data: { channel: `channel.${channelData.id}` },
            },
          ];
          subscribeMessages.forEach((subscribeMessage) => {
            this.websocket?.send(JSON.stringify(subscribeMessage));
          });
          this.emit(Events.Connected, { roomID: chatRoom.id });
          resolve({ roomID: `${chatRoom.id}` });
          if (this.listenerCount(Events.ViewerCount) > 0) {
            this.startViewerCountUpdates();
          }
        });

        this.websocket.on("message", (data: WebSocket.Data) => {
          this.handleMessage(JSON.parse(data.toString()));
        });

        this.websocket.on("error", (error: Error) => {
          this.emit(Events.Error, error);
          reject(error);
        });

        this.websocket.on("close", () => {
          console.log("WebSocket connection closed.");
          this.emit(Events.Disconnected, undefined);
        });
      });
    } catch (error) {
      this.emit(Events.Error, error);
      return { roomID: "" };
    }
  }

  public disconnect() {
    if (this.websocket) {
      console.log("Disconnecting WebSocket...");
      this.websocket.close();
      this.websocket = null;
      this.stopViewerCountUpdates();
    }
  }

  private async startViewerCountUpdates() {
    if (this.isViewerCountRunning) return;
    this.isViewerCountRunning = true;
    const fetchViewerCount = async () => {
      if (!this.isViewerCountRunning) return;
      try {
        const kickApi = new KickWrapper();
        const { data } = await kickApi.getLiveStreamDetails(this.username);
        if (!data) return;

        const viewerData = await kickApi.getCurrentViewers(`${data.id}`);
        const currentViewerCount = viewerData[0];
        this.emit(Events.ViewerCount, currentViewerCount);
        setTimeout(fetchViewerCount, 60000);
      } catch (error) {
        this.emit(Events.Error, error);
      }
    };
    await fetchViewerCount();
  }

  private stopViewerCountUpdates() {
    this.isViewerCountRunning = false;
  }

  private handleMessage({ data, event }: any) {
    try {
      const parseData = typeof data === "string" ? JSON.parse(data) : data;
      const e = event.split("\\")[2];
      if (!e) {
        return;
      }
      switch (e) {
        case "ChatMessageEvent":
          this.emit(Events.ChatMessage, parseData);
          break;
        case "MessageDeletedEvent":
          this.emit(Events.MessageDeleted, parseData);
          break;
        case "PinnedMessageCreatedEvent":
          this.emit(Events.PinnedMessageCreated, parseData);
          break;
        case "PinnedMessageDeletedEvent":
          this.emit(Events.PinnedMessageDeleted, undefined);
          break;
        case "PollUpdateEvent":
          this.emit(Events.PollUpdate, parseData);
          break;
        case "PollDeleteEvent":
          this.emit(Events.PollDelete, undefined);
          break;
        case "UserBannedEvent":
          this.emit(Events.UserBanned, parseData);
          break;
        case "UserUnbannedEvent":
          this.emit(Events.UserUnBanned, parseData);
          break;
        case "SubscriptionEvent":
          this.emit(Events.Subscription, parseData);
          break;
        case "GiftedSubscriptionsEvent":
          this.emit(Events.GiftedSubscriptions, parseData);
          break;
        case "LuckyUsersWhoGotGiftSubscriptionsEvent":
          this.emit(Events.LuckyUsersWhoGotGiftSubscriptions, parseData);
          break;
        case "GiftsLeaderboardUpdated":
          this.emit(Events.GiftsLeaderboardUpdated, parseData);
          break;
        case "ChatMoveToSupportedChannelEvent":
          this.emit(Events.ChatMoveToSupportedChannel, parseData);
          break;
        case "StreamHostEvent":
          this.emit(Events.StreamHost, parseData);
          break;
        case "ChatroomClearEvent":
          this.emit(Events.ChatroomClear, parseData);
          break;
        case "StopStreamBroadcast":
          this.emit(Events.StreamEnd, { username: this.username });
          break;
        case "StreamerIsLive":
          this.emit(Events.StreamerIsLive, parseData);
          break;
        default:
          break;
      }
    } catch (error) {
      this.emit(Events.Error, error);
    }
  }
}

export { KickConnection };
