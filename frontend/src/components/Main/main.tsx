import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import StreamerGrid from "../Streamer-Grid/stream-grid";
import Navbar from "../Navbar/navbar";
import ViewStream from "../View-Stream/view_stream";

import { ReduxStore } from "../../reducers/reducer";
import { setSocket } from "../../actions/socket_actions";

import "./main.scss";

export const isDev = !process.env.NODE_ENV ||
  process.env.NODE_ENV === "development";

const Main = React.memo(() => {
  const [streamData, socket] = useSelector(
    (state: ReduxStore) => [state.streamData, state.socket],
    shallowEqual,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) {
      const url = isDev
        ? "ws://localhost:5010/ws/"
        : `wss://${document.location.hostname}/ws/`;

      dispatch(setSocket(url));
    }
  }, [socket]);

  return (
    <div className="main">
      {streamData && (
        <React.Fragment>
          <Navbar />
          <div className="loaded">
            <StreamerGrid />
            <ViewStream />
          </div>
        </React.Fragment>
      )}
      {(!streamData || !streamData.streams) && (
        <div className="no-data">
          <h1>Looking for streams...</h1>
          <BounceLoader color="#eee" />
        </div>
      )}
    </div>
  );
});

export default Main;
