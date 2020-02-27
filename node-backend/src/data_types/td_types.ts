import { Channel, SubStream } from "../data_types/stream_responses";

export interface IStreamers {
  streamData: SubStream | null;
  streamName: string;
  channelData: Channel;
  id: number;
}

export type StructureStreams = {
  [key: string]: IStreamers;
};
