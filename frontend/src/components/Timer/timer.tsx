import React from "react";
import { useTimer } from "../../hooks/hooks";

import "./timer.scss";

interface Props {
  nextRefresh: number;
}

const Timer = (props: Props) => {
  const timer = useTimer(props.nextRefresh);
  return (
    <div className="timer-parent">
      <React.Fragment>
        {timer && <span>{`Next update in ${timer.minutes} minutes`}</span>}
        {!timer && <span>Fetching new streams...</span>}
      </React.Fragment>
    </div>
  );
};

export default Timer;
