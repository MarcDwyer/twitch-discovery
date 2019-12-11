import { combineReducers } from "redux";
import StreamsReducer, { Payload } from "./streams_reducer";
import TimeReducer, { Time } from "./timer_reducer";

export type ReduxStore = {
  streamData: Payload;
  timer: Time | null;
};
export type Action = {
  payload: any;
  type: Symbol;
};
export default combineReducers({
  streamData: StreamsReducer,
  timer: TimeReducer
});
