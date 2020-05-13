import { Dispatch } from "redux";
import { APP_INIT, APP_UPDATE } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";
import { FPAYLOAD, FREFRESH } from "../data_types/socket_cases";

const attachListeners = (socket: WebSocket, dispatch: Dispatch) => {
  socket.onopen = () => console.log("connected");

  socket.addEventListener("message", ({ data }) => {
    try {
      const parsed = JSON.parse(data);
      if ("type" in parsed) {
        console.log(parsed);
        const { type, payload } = parsed;
        switch (type) {
          case FPAYLOAD:
            dispatch({
              type: APP_INIT,
              payload,
            });
            break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export const setSocket = (url: string) =>
  (dispatch: Dispatch) => {
    console.log(url);
    const ws = new WebSocket(url);
    attachListeners(ws, dispatch);
    dispatch({
      type: SET_SOCKET,
      payload: ws,
    });
  };
