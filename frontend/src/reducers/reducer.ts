import { SubStream, ParentData } from "../../data_types/data_types";

export type IDiag = {
  offset: number;
  total: number;
  skippedOver: number;
};
export type Action = {
  payload: any;
  type: string;
};
export type Payload = {
  nextRefresh: number;
  streams: ParentData;
  diagnostic: IDiag;
  online: SubStream[];
  view: SubStream | null;
};
export const INC_KEY = "inc_key",
  RESET_FEATURED = "resetplas",
  SET_VIEW = "set_view",
  REMOVE_VIEW = "qwedqwdqwed";

export const APP_INIT = "appinitbro",
  APP_UPDATE = "holdmybeer";

export function appReducer(state: Payload | null, { type, payload }: Action) {
  switch (type) {
    case APP_INIT:
      return { ...payload, view: state && state.view ? state.view : null };
    case APP_UPDATE:
      const { streams } = payload;
      return { ...state, streams };
    case SET_VIEW:
      return { ...state, view: payload };
    case REMOVE_VIEW:
      return { ...state, view: null };
    default:
      return state;
  }
}
