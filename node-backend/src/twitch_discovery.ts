import TwitchMethods from "./twitch_methods.ts";
import { Types } from "./twitch_types.ts";
import { WebSocket } from "https://deno.land/std@v0.50.0/ws/mod.ts";
type Config = {
  limit: number;
  offset: number;
};

export default class TwitchDiscovery {
  private tm = new TwitchMethods();
  private config: Config;
  public streams: Types.Streams | null = null;
  constructor(limit: number, public hub: Map<string, WebSocket>) {
    this.config = {
      limit,
      offset: 0,
    };
  }
  async fetchNewPayload() {
    const { config } = this;
    try {
      let limit = config.limit,
        offset = config.offset;
      const streams = await this.tm.getStreams(limit, offset);
      this.streams = streams;
      offset += limit;
      this.config = { limit, offset };
    } catch (err) {
      // Perhaps find a way to handle the error, or notify client of error
      console.error(err);
    }
  }
}
