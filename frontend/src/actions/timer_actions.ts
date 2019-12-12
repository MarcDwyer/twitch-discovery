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

  const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export const setTimer = (futureTime: number) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  console.log("timer ran");
  // const newTime = getTime(futureTime);
  // const timer = getState().timer;
  dispatch({ type: UPDATE_TIME, payload: getTime(futureTime) });
};
