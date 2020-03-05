import { Streams } from "../data_types/td_types";
import { tfetcher } from "../main";

export const diffStreams = async (twitchStreams: Streams): Promise<Streams> => {
  try {
    const result: Streams = {};

    for (const stream of Object.values(twitchStreams)) {
      const response = await tfetcher.GetV5Streams({
        channel: String(stream.id)
      });
      const streamResp = response.streams[0];
      result[stream.id] = {
        ...stream,
        streamData: streamResp ? streamResp : null
      };
    }
    return result;
  } catch (err) {
    console.error(err);
  }
};
