import { Dispatch } from "redux";
import { APP_INIT, APP_UPDATE } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";
import { FPAYLOAD, FREFRESH } from "../data_types/socket_cases";

const attachListeners = (socket: WebSocket, dispatch: Dispatch) => {
  socket.addEventListener("message", ({ data }) => {
    if (!("type" in data)) {
      throw "No type in payload";
    }
    switch (data.type) {
      default:
        console.log("No case found");
    }
  });
};

export const setSocket = (url: string) => (dispatch: Dispatch) => {
  console.log(url);
  const ws = new WebSocket(url);
  attachListeners(ws, dispatch);
  dispatch({
    type: SET_SOCKET,
    payload: ws,
  });
};
