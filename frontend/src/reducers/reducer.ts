import { combineReducers } from "redux";
import StreamsReducer, { Payload } from "./streams_reducer";
import TimeReducer, { Time } from "./timer_reducer";
import SocketReducer from "./socket_reducer";

export type ReduxStore = {
  streamData: Payload;
  timer: Time | null;
  socket: WebSocket | null;
};
export type Action = {
  payload: any;
  type: Symbol;
};
export default combineReducers({
  streamData: StreamsReducer,
  timer: TimeReducer,
  socket: SocketReducer
});
