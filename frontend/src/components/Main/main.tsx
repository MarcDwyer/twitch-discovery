import React, { useEffect, useReducer } from "react";
import { BounceLoader } from "react-spinners";
import { useSocket } from "../../hooks/hooks";
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

const isDev = (): string =>
  document.location.hostname.startsWith("local")
    ? `ws://${document.location.hostname}:5010/ws`
    : `wss://${document.location.hostname}/ws`;

const Main = () => {
  const socket = useSocket(isDev());
  // Handles websocket messages
  const state = useSelector((state: ReduxStore) => state);
  const { streamData, timer } = state;
  const dispatch = useDispatch();
  useEffect(() => {
    if (socket) {
      socket.addEventListener("message", (payload: any) => {
        const data = JSON.parse(payload.data);
        if (!data["type"]) {
          dispatch(setStreamData(data));
          //   dispatchApp({ type: APP_INIT, payload: data });
          return;
        }
        switch (data.type) {
          case "updated-data":
          // dispatchApp({ type: APP_UPDATE, payload: data });
        }
      });
    }
  }, [socket]);
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
    let interval: any;
    if (streamData) {
      changeTimer();
      interval = setInterval(changeTimer, 10000);
    }
    return function() {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [streamData]);
  return (
    <div className="main">
      {timer && <span>{timer.minutes}</span>}
      {/* {streamData && (
        <React.Fragment>
          <Navbar appData={streamData} view={streamData.view} />
          <div className="loaded">
            <StreamerGrid
              streams={streamData.streams}
              dispatchApp={() => console.log("yeet")}
              diag={streamData.diagnostic}
            />
            <ViewStream
              stream={streamData.view}
              dispatchApp={() => console.log("dispath something")}
            />
          </div>
        </React.Fragment>
      )}
      {(!streamData || !streamData.streams) && (
        <div className="no-data">
          <h1>Looking for streams...</h1>
          <BounceLoader color="#eee" />
        </div>
      )} */}
    </div>
  );
};

export default Main;
