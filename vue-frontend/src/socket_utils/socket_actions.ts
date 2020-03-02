import { Store } from "vuex";
import { MyState } from "../store";
import { FPAYLOAD, FREFRESH } from "./socket_msgs_types";
import { TwitchPayload } from "../data_types";

export const socketActions = (
  socket: SocketIOClient.Socket,
  store: Store<MyState>
) => {
  socket.on(FPAYLOAD, (data: TwitchPayload) => {
    store.commit("setNewData", data);
  });
  socket.on(FREFRESH, (data: any) => {
    console.log(data);
  });
};
