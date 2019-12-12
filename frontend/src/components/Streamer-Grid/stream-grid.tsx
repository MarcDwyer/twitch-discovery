import React, { useCallback } from "react";
import { usePercentage } from "../../hooks/hooks";
import StreamCard from "../StreamCard/stream-card";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { SubStream } from "../../data_types/data_types";
import { ReduxStore } from "../../reducers/reducer";
import { setView } from "../../actions/stream_actions";

import "./stream-grid.scss";

const StreamerGrid = React.memo(() => {
  const [streams, diag] = useSelector((state: ReduxStore) => [
    state.streamData.streams,
    state.streamData.diagnostic
  ], shallowEqual);
  const dispatch = useDispatch();
  const updateFeatured = useCallback(
    (payload: SubStream) => {
      dispatch(setView(payload));
    },
    [streams]
  );
  console.log("grid rendered")
  const top = usePercentage(diag.offset);

  return (
    <div className="grid-parent">
      <h1>{`Top ${top} of streamers`}</h1>
      <div className="streamer-grid">
        {Object.values(streams).map(stream => (
          <StreamCard
            streamer={stream}
            key={stream.id}
            updateFeatured={updateFeatured}
          />
        ))}
      </div>
    </div>
  );
});

export default StreamerGrid;
