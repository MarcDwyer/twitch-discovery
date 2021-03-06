import { Dispatch } from "redux";
import { APP_INIT } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";
import { FPAYLOAD } from "../data_types/socket_cases";

const attachListeners = (socket: WebSocket, dispatch: Dispatch) => {
  socket.onopen = () => console.log("connected");

  socket.addEventListener("message", ({ data }) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed instanceof Object) {
        if ("type" in parsed) {
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
      }
    } catch (err) {
      console.log(err);
    }
  });
};

export const setSocket = (url: string) => (dispatch: Dispatch) => {
  console.log(url);
  const ws = new WebSocket(url);
  ws.onclose = () => {
    console.log("connection closed");
  };
  attachListeners(ws, dispatch);
  dispatch({
    type: SET_SOCKET,
    payload: ws,
  });
};
