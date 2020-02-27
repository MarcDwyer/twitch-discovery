import { Dispatch } from "redux";
import io from "socket.io-client";
import { APP_INIT, APP_UPDATE } from "../reducers/streams_reducer";
import { SET_SOCKET } from "../reducers/socket_reducer";
import { FPAYLOAD, FREFRESH } from "../data_types/socket_cases";

const attachListeners = (socket: SocketIOClient.Socket, dispatch: Dispatch) => {
  socket.on(FPAYLOAD, (payload: any) => {
    dispatch({
      type: APP_INIT,
      payload
    });
  });
  socket.on(FREFRESH, (data: any) => {
    dispatch({
      type: APP_UPDATE,
      payload: data.streams
    });
  });
};
export const setSocket = (url: string) => (dispatch: Dispatch) => {
  const ws = io(url, {
    secure: true
  });
  attachListeners(ws, dispatch);
  dispatch({
    type: SET_SOCKET,
    payload: ws
  });
};
