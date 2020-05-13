import { Action } from "./reducer";
import { FTypes } from "../data_types/data_types";
export type IDiag = {
  skippedOver: number;
};
export type Config = {
  offset: number;
  limit: number;
};
export type Payload = {
  streams: FTypes.Stream[];
  view: FTypes.Stream | null;
  nextRefresh: number;
  config: Config;
};
export const INC_KEY = Symbol(),
  RESET_FEATURED = Symbol(),
  SET_VIEW = Symbol(),
  REMOVE_VIEW = Symbol();

export const APP_INIT = Symbol(),
  APP_UPDATE = Symbol();

function AppReducer(state: Payload | null = null, { type, payload }: Action) {
  switch (type) {
    case APP_INIT:
      return { ...payload, view: state?.view || null };
    case APP_UPDATE:
      return { ...state, streams: payload };
    case SET_VIEW:
      return { ...state, view: payload };
    case REMOVE_VIEW:
      return { ...state, view: null };
    default:
      return state;
  }
}

export default AppReducer;
