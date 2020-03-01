import Vue from "vue";
import Vuex from "vuex";
import { Socket } from "socket.io-client";
import { ParentData } from "@/data_types";

Vue.use(Vuex);

export type MyState = {
  socket: SocketIOClient.Socket | null;
  twitchData: null | ParentData;
};

export default new Vuex.Store<MyState>({
  state: {
    socket: null,
    twitchData: null
  },
  mutations: {
    setSocket(state: MyState, ws: SocketIOClient.Socket) {
      state.socket = ws;
    }
  },
  actions: {},
  modules: {}
});
