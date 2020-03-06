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
  getNewPayload = async (dontInc?: boolean): Promise<TwitchDiscovery> => {
    if (this.payload && !dontInc) {
      const { skipOver, incBy } = this.tdConfig;
      this.tdConfig.skipOver = incSkipped(skipOver, incBy);
    }
    if (this.timers) {
      this.timers.refresh.reset();
    }
    const nextRefresh = new Date().getTime() + this.tdConfig.getListEvery;
    const response = await tfetcher.GetV5Streams({
      ...this.twitchConfig,
      offset: this.tdConfig.skipOver
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
    return this;
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
  changeSkip(skip: number): TwitchDiscovery {
    this.tdConfig.skipOver = skip;
    return this;
  }
}

export default TwitchDiscovery;
