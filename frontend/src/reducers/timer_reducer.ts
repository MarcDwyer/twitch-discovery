import { Action } from "./reducer";

export interface ITimer extends Array<Time | null | boolean> {
  0: Time | null;
  1: boolean;
}

export type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export const UPDATE_TIME = Symbol();

const TimeReducer = (state: Time | null = null, { payload, type }: Action) => {
  switch (type) {
    case UPDATE_TIME:
      return payload;
    default:
      return state;
  }
};

export default TimeReducer;
