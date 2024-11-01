import {
  chromium,
  Browser,
  BrowserContext,
  Page,
  LaunchOptions,
} from "playwright";
import {
  ChatRoomDataResponse,
  ChatRoomSettingsResponse,
  ChannelDataResponse,
  CurrentViewersResponse,
  LeaderboardsResponse,
  LiveStreamDetailsResponse,
  CategoriesResponse,
  SubcategoriesResponse,
  TopCategoriesResponse,
  FeaturedLivestreamsResponse,
} from "./wrapperTypes";

interface KickWrapperOptions {
  browser?: Browser;
  playwright?: LaunchOptions;
  userAgent?: string;
  gotoOptions?: any;
}

export class KickWrapper {
  private baseURL: string;
  private internalBaseURL: string;
  private streamBaseURL: string;
  private options: KickWrapperOptions;
  private browser?: Browser;

  constructor(options: KickWrapperOptions = {}) {
    this.baseURL = "https://kick.com/api";
    this.internalBaseURL = "https://kick.com/api/internal";
    this.streamBaseURL = "https://kick.com/stream/featured-livestreams";
    this.options = options;
    this.browser = options.browser;
  }

  private async fetchData(url: string): Promise<any> {
    let browser: Browser | null = null;
    let context: BrowserContext | null = null;
    let internalBrowser = false;

    try {
      const browserOptions: LaunchOptions = this.options.playwright || {};
      if (this.browser) {
        browser = this.browser;
      } else {
        browser = await chromium.launch({
          headless: true,
          ...browserOptions,
        });
        internalBrowser = true;
      }

      const userAgent =
        this.options.userAgent ||
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";

      context = await browser.newContext({
        userAgent: userAgent,
      });

      const page: Page = await context.newPage();

      const response = await page.goto(url, {
        waitUntil: "networkidle",
        ...this.options.gotoOptions,
      });

      if (response && response.ok()) {
        const body = await page.evaluate(() => document.body.textContent);
        const parsedData =
          typeof body === "string" ? JSON.parse(body as string) : body;
        return parsedData;
      } else {
        throw new Error(
          `Failed to load URL: ${response?.status()} - ${response?.statusText()}`
        );
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    } finally {
      if (context) {
        await context.close();
      }
      if (browser && internalBrowser) {
        await browser.close();
      }
    }
  }

  async getChatRoomData(username: string): Promise<ChatRoomDataResponse> {
    const url = `${this.baseURL}/v2/channels/${username}/chatroom`;
    return this.fetchData(url);
  }

  async getChatRoomSettings(
    username: string
  ): Promise<ChatRoomSettingsResponse> {
    const url = `${this.internalBaseURL}/v1/channels/${username}/chatroom/settings`;
    return this.fetchData(url);
  }

  async getCurrentViewers(
    LiveStreamID: string
  ): Promise<CurrentViewersResponse[]> {
    const url = `https://kick.com/current-viewers?ids[]=${LiveStreamID}`;
    return this.fetchData(url);
  }

  async getChannelData(username: string): Promise<ChannelDataResponse> {
    const url = `${this.baseURL}/v2/channels/${username}`;
    return this.fetchData(url);
  }

  async getLeaderboards(username: string): Promise<LeaderboardsResponse> {
    const url = `${this.baseURL}/v2/channels/${username}/leaderboards`;
    return this.fetchData(url);
  }

  async getLiveStreamDetails(
    username: string
  ): Promise<LiveStreamDetailsResponse> {
    const url = `${this.baseURL}/v2/channels/${username}/livestream`;
    return this.fetchData(url);
  }

  async getCategories(): Promise<CategoriesResponse> {
    const url = `${this.baseURL}/v1/categories`;
    return this.fetchData(url);
  }

  async getSubcategories(): Promise<SubcategoriesResponse> {
    const url = `${this.baseURL}/v1/subcategories`;
    return this.fetchData(url);
  }

  async getTopCategories(): Promise<TopCategoriesResponse[]> {
    const url = `${this.baseURL}/v1/categories/top`;
    return this.fetchData(url);
  }

  async getFeaturedLivestreams(
    region: string = "en"
  ): Promise<FeaturedLivestreamsResponse> {
    const url = `${this.streamBaseURL}/${region}`;
    return this.fetchData(url);
  }
}
