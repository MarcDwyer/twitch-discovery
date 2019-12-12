import { Action } from "./reducer";

export const SET_SOCKET = Symbol();

const SocketReducer = (
  state: WebSocket | null = null,
  { type, payload }: Action
) => {
  switch (type) {
    case SET_SOCKET:
      return payload;
    default:
      return state;
  }
};

export default SocketReducer;
