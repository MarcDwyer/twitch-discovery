import React, { useEffect, useCallback } from "react";
import { BounceLoader } from "react-spinners";
import {
  APP_INIT,
  APP_UPDATE,
  REMOVE_VIEW
} from "../../reducers/streams_reducer";
import { useDispatch, useSelector } from "react-redux";

import StreamerGrid from "../Streamer-Grid/stream-grid";
import Navbar from "../Navbar/navbar";
import ViewStream from "../View-Stream/view_stream";

import "./main.scss";
import { setStreamData } from "../../actions/stream_actions";
import { ReduxStore } from "../../reducers/reducer";
import { setTimer } from "../../actions/timer_actions";
import { setSocket } from "../../actions/socket_actions";

const isDev = (): string =>
  document.location.hostname.startsWith("local")
    ? `ws://${document.location.hostname}:5010/ws`
    : `wss://${document.location.hostname}/ws`;

const Main = () => {
  // make useSocket return data as well

  // Handles websocket messages
  const state = useSelector((state: ReduxStore) => state);
  const { streamData, timer, socket } = state;
  const dispatch = useDispatch();

  console.log(state);
  // Sets View to null if escape key is pressed
  const removeView = (e: KeyboardEvent) => {
    // if (!appData || (appData && !appData.view) || e.keyCode !== 27) return;
    // dispatchApp({ type: REMOVE_VIEW, payload: null });
  };
  const changeTimer = () => dispatch(setTimer(streamData.nextRefresh));

  useEffect(() => {
    document.addEventListener("keydown", removeView);

    return function() {
      document.removeEventListener("keydown", removeView);
    };
  }, [streamData]);
  useEffect(() => {
    if (!socket) {
      dispatch(setSocket(isDev()));
    }
  }, [socket]);
  return (
    <div className="main">
      {timer && <span>{timer.minutes}</span>}
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
};

export default Main;
