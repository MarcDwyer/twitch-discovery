import React from "react";
import { useSelector } from "react-redux";
import { useTimer } from "../../hooks/hooks";
import { ReduxStore } from "../../reducers/reducer";

import "./timer.scss";

const Timer = () => {
  const nextRefresh = useSelector(
    (store: ReduxStore) => store.streamData.nextRefresh
  );
  const timer = useTimer(nextRefresh);
  if (!timer) return null;
  return (
    <div className="timer-parent">
      <React.Fragment>
        {timer && (
          <span>{`Next update in ${timer.minutes} minutes and ${timer.seconds} seconds`}</span>
        )}
        {!timer && <span>Fetching new streams...</span>}
      </React.Fragment>
    </div>
  );
};

export default Timer;
