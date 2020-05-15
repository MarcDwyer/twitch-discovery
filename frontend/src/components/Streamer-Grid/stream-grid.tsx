import React, { useCallback } from "react";
import StreamCard from "../StreamCard/stream-card";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { FTypes } from "../../data_types/data_types";
import { ReduxStore } from "../../reducers/reducer";
import { setView } from "../../actions/stream_actions";

import "./stream-grid.scss";

const StreamerGrid = React.memo(() => {
  const [streams, diag] = useSelector(
    (state: ReduxStore) => [
      state.streamData.streams,
      state.streamData.config,
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const updateFeatured = useCallback(
    (payload: FTypes.Stream) => {
      dispatch(setView(payload));
    },
    [streams],
  );

  return (
    <div className="grid-parent">
      <h2>Skipped the first {diag.offset} streams</h2>
      <div className="streamer-grid">
        {streams.map((stream) => (
          <StreamCard
            streamer={stream}
            key={stream._id}
            updateFeatured={updateFeatured}
          />
        ))}
      </div>
    </div>
  );
});

export default StreamerGrid;
