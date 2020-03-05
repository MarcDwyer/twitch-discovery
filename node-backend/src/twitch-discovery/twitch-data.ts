import { Server } from "socket.io";
import { V5Types } from "twitch-getter";
import { diffStreams } from "./diffing";
import { TDConfig, Payload, Diag, MyTimers } from "../data_types/td_types";
import Timer from "../timers";
import { tfetcher } from "../main";

import { structureResp, incSkipped } from "./td_utils";
import { BPAYLOAD, BREFRESH } from "../data_types/socket_cases";

class TwitchDiscovery {
  payload: Payload | null;
  timers: MyTimers | null;
  tdConfig: TDConfig;
  twitchConfig: V5Types.V5StreamsConfig | undefined;
  private wss: Server;
  constructor(
    io: Server,
    tdConfig: TDConfig,
    twitchConfig?: V5Types.V5StreamsConfig
  ) {
    this.tdConfig = tdConfig;
    this.twitchConfig = twitchConfig;
    this.payload = null;
    this.timers = null;
    this.wss = io;
  }
  getNewPayload = async (tdConfig?: V5Types.V5StreamsConfig) => {
    if (this.payload) {
      this.tdConfig.skipOver = incSkipped(
        this.tdConfig.skipOver,
        this.tdConfig.incBy
      );
    }
    if (this.timers) {
      this.timers.refresh.reset();
    }
    const nextRefresh = new Date().getTime() + this.tdConfig.getListEvery;
    const response = await tfetcher.GetV5Streams({
      offset: this.tdConfig.skipOver,
      limit: this.tdConfig.incBy,
      ...tdConfig
    });
    const streams = structureResp(response.streams);
    const diagnostic: Diag = {
      skippedOver: this.tdConfig.skipOver
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
    const { refreshEvery, getListEvery } = this.tdConfig;
    const newPayload = new Timer(this.getNewPayload, getListEvery);
    const refresh = new Timer(this.refresh, refreshEvery);
    this.timers = {
      newPayload,
      refresh
    };
  }
}

export default TwitchDiscovery;
