import { Server } from "socket.io";
import { SubStream } from "../data_types/stream_responses";
import { V5TwitchAPI } from "twitch-getter";
import { IStreamers } from "../data_types/td_types";

import { structureResp, incSkipped } from "./td_utils";
import { BPAYLOAD } from "../data_types/socket_cases";

import dotenv from "dotenv";

dotenv.config();

export type Payload = {
  nextRefresh?: number;
  streams: IStreamers[];
  diagnostic: Diag;
  online: SubStream[];
};
type Diag = {
  skippedOver: number;
};

type TDConfig = {
  skipOver: number;
  getListEvery: number;
  refreshEvery: number;
};
const tfetcher = new V5TwitchAPI(process.env.TWITCH);

class TwitchDiscovery {
  config: TDConfig;
  payload: Payload | null;
  wss: Server;
  constructor(io: Server, config: TDConfig) {
    this.config = config;
    this.payload = null;
    this.wss = io;
  }
  async getNewPayload() {
    const { payload, config } = this;
    if (payload) {
      this.config.skipOver = incSkipped(config.skipOver);
    }
    const nextRefresh = new Date().getTime() + config.refreshEvery;
    const response = await tfetcher.GetV5Streams({
      offset: config.skipOver,
      limit: 10,
      language: "en"
    });
    const streams = structureResp(response);
    const diagnostic: Diag = {
      skippedOver: config.skipOver
    };

    this.payload = {
      ...this.payload,
      streams,
      nextRefresh,
      diagnostic
    };
    this.wss.emit(BPAYLOAD, this.payload);
  }
}

export default TwitchDiscovery;

// function TwitchDiscovery(this: TwitchDisc, io: Server) {
//   this.data = null;
//   this.io = io;
//   this.settings = {
//     offset: 0,
//     popTime: minutes * 38,
//     refreshTime: minutes * 1
//   };

//   this.nextRefresh = () => new Date().getTime() + this.settings.popTime;

//   this.intervalPopulate = new Timer(
//     async () => await this.populateRandom(),
//     this.settings.popTime
//   );
//   this.intervalRefresh = new Timer(
//     async () => await this.refreshRandom(),
//     this.settings.refreshTime
//   );

//   this.refreshRandom = async () => {
//     console.log(`Refresh ran on ${new Date()}`);
//     const streams = await Promise.all(
//       this.data.streams.map(
//         async stream => await twitch.fetchStreamData(stream)
//       )
//     );
//     const online = streams
//       .filter(stream => stream.streamData)
//       .map(stream => stream.streamData);
//     this.data = { ...this.data, streams, online };
//     this.io.sockets.emit("updated-data", { streams, online });
//   };

//   this.populateRandom = async update => {
//     console.log(`Populate random has run on: ${new Date()}`);
//     if (this.data) {
//       this.intervalRefresh.reset(this.settings.refreshTime);
//       if (update) {
//         this.intervalPopulate.reset(this.settings.popTime);
//       }
//     }
//     const total = await twitch.fetchTotal();
//     const streamData = await twitch.fetchRandomStreams(this.getOffset(total));
//     this.data = { ...streamData, nextRefresh: this.nextRefresh() };
//     this.io.sockets.emit("init-data", this.data);
//   };

//   this.getOffset = (total: number) => {
//     let offset = this.settings.offset;
//     if (offset >= 0.85) offset = 0;
//     const skippedOver = Math.floor(total * offset);
//     this.settings.offset = offset + 0.0025;
//     return [skippedOver, total, offset];
//   };
// }
