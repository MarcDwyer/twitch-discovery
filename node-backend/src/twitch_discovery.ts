import TwitchMethods from "./twitch_methods.ts";
import { Types } from "./twitch_types.ts";
import { futureTime } from "./time.ts";
import Hub from "./hub.ts";
import { FREFRESH, FPAYLOAD } from "./ws_cases.ts";

type Config = {
  limit: number;
  offset: number;
};
export type Payload = {
  nextRefresh: number;
  streams: Types.Streams;
  config: Config;
  view: Types.Stream | null;
};
export default class TwitchDiscovery {
  private tm = new TwitchMethods();
  private config: Config;
  private oldConf: Config;
  private nextRefresh: number | null = null;
  public streams: Types.Streams | null = null;

  constructor(limit: number, private hub: Hub) {
    const config: Config = {
      limit,
      offset: 0,
    };
    this.config = config;
    this.oldConf = config;
  }
  async fetchNewPayload() {
    const { config } = this;
    try {
      console.log("fetching new payload...");
      this.oldConf = config;
      let limit = config.limit,
        offset = config.offset > 25000 ? 0 : config.offset;
      const streams = await this.tm.getStreams(limit, offset);
      this.streams = streams;
      offset += limit;
      this.nextRefresh = futureTime(1);
      this.config = { limit, offset };
      await this.hub.broadCast(
        JSON.stringify(
          { type: FPAYLOAD, payload: this.payload },
        ),
      );
      setTimeout(() => this.fetchNewPayload(), this.nextRefresh - Date.now());
    } catch (err) {
      // Perhaps find a way to handle the error, or notify client of error
      console.error(err);
    }
  }
  public get payload() {
    const payload = {
      streams: this.streams?.streams,
      nextRefresh: this.nextRefresh,
      config: this.oldConf,
    };
    return payload;
  }
}
