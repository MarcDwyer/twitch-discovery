import Vue from "vue";
import Vuex from "vuex";
import { Socket } from "socket.io-client";
import { TwitchPayload } from "@/data_types";

Vue.use(Vuex);

export type MyState = {
  socket: SocketIOClient.Socket | null;
  twitchData: null | TwitchPayload;
};

export default new Vuex.Store<MyState>({
  state: {
    socket: null,
    twitchData: null
  },
  mutations: {
    setSocket(state: MyState, ws: SocketIOClient.Socket) {
      state.socket = ws;
    },
    setNewData(state, data: TwitchPayload) {
      state.twitchData = data;
    }
  },
  actions: {},
  modules: {}
});
