import { V5StreamersPayload } from "twitch-getter/lib/v5_twitch_api/v5_types";
import { IStreamers } from "../data_types/td_types";

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

export const incSkipped = (curr: number) => {
  if (curr > 10000) return 0;
  return curr + 25;
};
