import { Streams } from "../data_types/td_types";
import { V5Types } from "twitch-getter";

export const structureResp = (streams: V5Types.StreamData[]): Streams => {
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

export const incSkipped = (curr: number, incBy: number) => {
  if (curr > 10000) return 0;
  return curr + incBy;
};
