import { V5StreamersPayload } from "twitch-getter/lib/v5_twitch_api/v5_types";
import { IStreamers, Streams } from "../data_types/td_types";
import { tfetcher } from "./twitch-data";
import { StreamData } from "twitch-getter/lib/v5_twitch_api/v5_types";

export const structureResp = (streams: StreamData[]): Streams => {
  return streams.reduce((obj, stream) => {
    obj[stream.channel._id] = {
      streamData: stream,
      id: stream.channel._id,
      channelData: stream.channel,
      streamName: stream.channel.name
    };
    return obj;
  }, {});
};

export const getStreams = async (ids: number[]) => {
  try {
    const newStreams = await Promise.all(
      ids.map(async id => {
        console.log(id);
        const data = await tfetcher.GetV5Streams({
          channel: String(id),
          language: "en"
        });
        return structureResp(data.streams);
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

export const incSkipped = (curr: number, incBy: number) => {
  if (curr > 10000) return 0;
  return curr + incBy;
};
