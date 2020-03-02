import { Channel, SubStream } from "../data_types/stream_responses";

export interface IStreamers {
  streamData: SubStream | null;
  streamName: string;
  channelData: Channel;
  id: number;
}

// export type StructureStreams = {
//   [key: string]: IStreamers;
// };


export type Payload = {
  nextRefresh?: number;
  streams: IStreamers[];
  diagnostic: Diag;
  online: SubStream[];
};
export type Diag = {
  skippedOver: number;
};

export type TDConfig = {
  skipOver: number;
  getListEvery: number;
  refreshEvery: number;
};