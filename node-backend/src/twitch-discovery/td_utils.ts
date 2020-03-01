import { V5StreamersPayload } from "twitch-getter/lib/v5_twitch_api/v5_types";
import { IStreamers } from "../data_types/td_types";
import { SubStream } from "../data_types/stream_responses";
import { tfetcher } from "./twitch-data";

export const structureResp = (data: V5StreamersPayload): IStreamers[] => {
  //@ts-ignore
  return data.streams.map(stream => {
    return {
      streamData: stream,
      streamName: stream.channel.display_name,
      channelData: stream.channel,
      id: stream._id
    };
  });
};

export const getStreams = async (ids: number[]) => {
  try {
    const newStreams = await Promise.all(
      ids.map(async id => {
        console.log(id);
        const data = await tfetcher.GetV5Streams({
          channel: String(id)
        });
        return structureResp(data);
      })
    );
    console.log(newStreams);
    const online = newStreams.filter(stream => stream);
    return [newStreams, online];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getIds = (streamData: IStreamers[]) => {
  return streamData.map(stream => stream.channelData._id);
};

export const incSkipped = (curr: number) => {
  if (curr > 10000) return 0;
  return curr + 25;
};
