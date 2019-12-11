import { APP_INIT, Payload } from "../reducers/streams_reducer";
import { Dispatch } from "redux";
export const setStreamData = (payload: Payload) => (dispatch: Dispatch) => {
  dispatch({
    type: APP_INIT,
    payload
  });
};
