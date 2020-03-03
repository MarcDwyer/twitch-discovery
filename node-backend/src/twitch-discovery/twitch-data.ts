import { Server } from "socket.io";
import { V5TwitchAPI, V5Types } from "twitch-getter";
import { diffStreams } from "./diffing";
import { TDConfig, Payload, Diag, MyTimers } from "../data_types/td_types";
import Timer from "../timers";

import { structureResp, incSkipped } from "./td_utils";
import { BPAYLOAD, BREFRESH } from "../data_types/socket_cases";

import dotenv from "dotenv";

dotenv.config();

export const tfetcher = new V5TwitchAPI(process.env.TWITCH);

class TwitchDiscovery {
  payload: Payload | null;
  timers: MyTimers | null;
  wss: Server;
  private config: TDConfig;
  constructor(io: Server, config: TDConfig) {
    this.config = config;
    this.payload = null;
    this.timers = null;
    this.wss = io;
  }
  getNewPayload = async (tdConfig?: V5Types.V5StreamsConfig) => {
    if (this.payload) {
      this.config.skipOver = incSkipped(
        this.config.skipOver,
        this.config.incBy
      );
    }
    if (this.timers) {
      this.timers.refresh.reset();
    }
    const nextRefresh = new Date().getTime() + this.config.getListEvery;
    const response = await tfetcher.GetV5Streams({
      offset: this.config.skipOver,
      limit: this.config.incBy,
      ...tdConfig
    });
    const streams = structureResp(response.streams);
    const diagnostic: Diag = {
      skippedOver: this.config.skipOver
    };
    this.payload = {
      ...this.payload,
      streams,
      nextRefresh,
      diagnostic
    };
    this.wss.emit(BPAYLOAD, this.payload);
  };
  refresh = async () => {
    const updatedPayload = await diffStreams(this.payload.streams);
    this.payload.streams = updatedPayload;
    this.wss.emit(BREFRESH, this.payload.streams);
  };
  setTimers() {
    const { refreshEvery, getListEvery } = this.config;
    const newPayload = new Timer(this.getNewPayload, getListEvery);
    const refresh = new Timer(this.refresh, refreshEvery);
    this.timers = {
      newPayload,
      refresh
    };
  }
}

export default TwitchDiscovery;
