import { Channel, SubStream } from "../data_types/stream_responses";
import { V5Types } from "twitch-getter";
import Timer from "../timers";

export interface IStreamers {
  streamData: V5Types.StreamData | null;
  streamName: string;
  channelData: Channel;
  id: number;
}
export type Payload = {
  nextRefresh?: number;
  streams: Streams;
  diagnostic: Diag;
  online: SubStream[];
};
export type Streams = {
  [channel_id: string]: IStreamers;
};
export type Diag = {
  skippedOver: number;
};

export type TDConfig = {
  skipOver: number;
  incBy: number;
  getListEvery: number;
  refreshEvery: number;
};
export type V5StreamsConfig = {
  [key: string]: any;
  channel?: string;
  game?: string;
  language?: string;
  stream_type?: string;
  limit?: number;
  offset?: number;
};

export type MyTimers = {
  refresh: Timer;
  newPayload: Timer;
};
