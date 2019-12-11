import { UPDATE_TIME, Time } from "../reducers/timer_reducer";
import { ReduxStore } from "../reducers/reducer";
import { Dispatch } from "redux";

export type GetState = {
  (): ReduxStore;
};
const getTime = (futureTime: number): Time | null => {
  const now = new Date().getTime();
  if (now >= futureTime) {
    return null;
  }
  const distance = futureTime - now;

  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
};

export const setTimer = (futureTime: number) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const timer = getState().timer;
  if (!timer) {
    dispatch({ type: UPDATE_TIME, payload: getTime(futureTime) });
    return;
  }
  const { minutes } = timer;
  const newTime = getTime(futureTime);
  if (newTime && minutes > newTime.minutes) {
    dispatch({
      type: UPDATE_TIME,
      payload: newTime
    });
  }
};
