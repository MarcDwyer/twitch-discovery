import { Dispatch } from "redux";
import { GetState } from "./timer_actions";
import { APP_INIT, APP_UPDATE } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";

const attachListeners = (socket: WebSocket, dispatch: Dispatch): WebSocket => {
  socket.addEventListener("message", (payload: any) => {
    const data = JSON.parse(payload.data);
    if (!data["type"]) {
      dispatch({
        type: APP_INIT,
        payload: data
      });
      //   dispatchApp({ type: APP_INIT, payload: data });
      return;
    }
    switch (data.type) {
      case "updated-data":
        console.log(data);
        dispatch({
          type: APP_UPDATE,
          payload: data.streams
        });
    }
  });
  return socket;
};
export const setSocket = (uri: string) => (dispatch: Dispatch) => {
  const socket = attachListeners(new WebSocket(uri), dispatch);
  dispatch({
    type: SET_SOCKET,
    payload: socket
  });
};
