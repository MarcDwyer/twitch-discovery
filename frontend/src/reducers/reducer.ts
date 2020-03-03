import { combineReducers } from "redux";
import StreamsReducer, { Payload } from "./streams_reducer";
import SocketReducer from "./socket_reducer";

export type ReduxStore = {
  streamData: Payload;
  socket: WebSocket | null;
};
export type Action = {
  payload: any;
  type: Symbol;
};
export default combineReducers({
  streamData: StreamsReducer,
  socket: SocketReducer
});
