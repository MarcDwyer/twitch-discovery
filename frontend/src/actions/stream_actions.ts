import { APP_INIT, Payload, SET_VIEW } from "../reducers/streams_reducer";
import { Dispatch } from "redux";
import { FTypes } from "../data_types/data_types";

export const setStreamData = (payload: Payload) =>
  (dispatch: Dispatch) => {
    dispatch({
      type: APP_INIT,
      payload,
    });
  };

export const setView = (stream: FTypes.Stream | null) => {
  console.log(stream);
  return {
    type: SET_VIEW,
    payload: stream,
  };
};
