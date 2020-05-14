import { fetchTwitch } from "./util.ts";
import { Types } from "./twitch_types.ts";

const getTwitchKey = () => {
  const key = Deno.env.get("TWITCH");
  if (!key) {
    throw new Error("No twitch key was found");
  }
  return key;
};

export default class TwitchMethods {
  private key = getTwitchKey();

  async getStreams(limit: number = 5, offset: number) {
    const url =
      `https://api.twitch.tv/kraken/streams/?limit=${limit}&offset=${offset}`;
    const streamData: Types.Streams = await fetchTwitch(url, this.key);
    return streamData;
  }
}
