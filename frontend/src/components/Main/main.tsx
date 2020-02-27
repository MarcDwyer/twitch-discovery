import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import StreamerGrid from "../Streamer-Grid/stream-grid";
import Navbar from "../Navbar/navbar";
import ViewStream from "../View-Stream/view_stream";

import { ReduxStore } from "../../reducers/reducer";
import { setSocket } from "../../actions/socket_actions";
import { setTimer } from "../../actions/timer_actions";

import "./main.scss";

export const isDev =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const Main = React.memo(() => {
  const [streamData, socket] = useSelector(
    (state: ReduxStore) => [state.streamData, state.socket],
    shallowEqual
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!socket) {
      const url = isDev
        ? "http://localhost:5010"
        : `https://${document.location.hostname}`;

      dispatch(setSocket(url));
    }
  }, [socket]);

  console.log(streamData);
  useEffect(() => {
    let interval: any;
    if (streamData) {
      dispatch(setTimer(streamData.nextRefresh));
      interval = setInterval(
        () => dispatch(setTimer(streamData.nextRefresh)),
        1000
      );
    }
    return function() {
      if (interval) clearInterval(interval);
    };
  }, [streamData]);
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
