import React, { useEffect } from "react";
import { BounceLoader } from "react-spinners";

import { useDispatch, useSelector, shallowEqual } from "react-redux";

import StreamerGrid from "../Streamer-Grid/stream-grid";
import Navbar from "../Navbar/navbar";
import ViewStream from "../View-Stream/view_stream";

import { ReduxStore } from "../../reducers/reducer";
import { setSocket } from "../../actions/socket_actions";
import { setTimer } from '../../actions/timer_actions'
import "./main.scss";

const isDev = (): string =>
  document.location.hostname.startsWith("local")
    ? `ws://${document.location.hostname}:5010/ws`
    : `wss://${document.location.hostname}/ws`;

const Main = React.memo(() => {
  const [streamData, socket] = useSelector((state: ReduxStore) => [state.streamData, state.socket], shallowEqual);
  const dispatch = useDispatch();
  console.log("main rendered")
  useEffect(() => {
    if (!socket) {
      dispatch(setSocket(isDev()));
    }
  }, [socket]);

  useEffect(() => {
    let interval: any;
    if (streamData) {
      dispatch(setTimer(streamData.nextRefresh))
      interval = setInterval(() => dispatch(setTimer(streamData.nextRefresh)), 1000)
    }
    return function () {
      if (interval) clearInterval(interval)
    }
  }, [streamData])
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
