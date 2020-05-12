import { Dispatch } from "redux";
import { APP_INIT, APP_UPDATE } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";
import { FPAYLOAD, FREFRESH } from "../data_types/socket_cases";

const attachListeners = (socket: WebSocket, dispatch: Dispatch) => {
  socket.addEventListener("message", ({ data }) => {
    console.log("from actions", data);
  });
};

export const setSocket = (url: string) => (dispatch: Dispatch) => {
  console.log(url);
  const ws = new WebSocket(url);
  ws.onopen = function () {
    console.log("this thing is on");
    console.log(this);
    this.send("hello we are totally connected and stuff");
  };
  attachListeners(ws, dispatch);
  dispatch({
    type: SET_SOCKET,
    payload: ws,
  });
};
