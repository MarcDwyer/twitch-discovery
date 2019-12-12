import React, { useCallback } from "react";
import { IDiag } from "../../reducers/streams_reducer";
import { SET_VIEW } from "../../reducers/streams_reducer";
import { usePercentage } from "../../hooks/hooks";
import StreamCard from "../StreamCard/stream-card";
import { useSelector, useDispatch } from "react-redux";
import "./stream-grid.scss";

import { SubStream } from "../../data_types/data_types";
import { ReduxStore } from "../../reducers/reducer";
import { setView } from "../../actions/stream_actions";

const StreamerGrid = () => {
  const [streams, diag] = useSelector((state: ReduxStore) => [
    state.streamData.streams,
    state.streamData.diagnostic
  ]);
  const dispatch = useDispatch();
  const updateFeatured = useCallback(
    (payload: SubStream) => {
      dispatch(setView(payload));
    },
    [streams]
  );

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
};

export default StreamerGrid;
