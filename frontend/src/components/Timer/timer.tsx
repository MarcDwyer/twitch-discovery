import React from "react";

import "./timer.scss";

type Props = {
  minutes: number;
  seconds: number;
  headline: string;
};

const Timer = (props: Props) => {
  const { minutes, seconds, headline } = props;
  return (
    <div className="timer-parent">
      <React.Fragment>
        <span>{`${headline} ${minutes} minutes and ${seconds} seconds`}</span>
      </React.Fragment>
    </div>
  );
};

export default Timer;
