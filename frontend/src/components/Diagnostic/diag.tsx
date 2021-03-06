import React from "react";
import { useSpring, animated } from "react-spring";
import { FaGithub } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { PTime } from "../../hooks";

import Timer from "../Timer/timer";

import { ReduxStore } from "../../reducers/reducer";

import "./diag.scss";

interface Props {
  timer: PTime | null;
  showDiag: boolean;
  setShowDiag(p: boolean): void;
}
const Diag = (props: Props) => {
  const [streams, { offset }] = useSelector((state: ReduxStore) => [
    state.streamData.streams,
    state.streamData.config,
  ]);
  const { timer } = props;
  const diagAnim = useSpring({
    opacity: 1,
    transform: "translateX(0)",
    from: { opacity: 0, transform: "translateX(-100%)" },
    reverse: !props.showDiag,
  });
  const average = () => {
    const total = streams.reduce((num, stream) => {
      num += stream.viewers;
      return num;
    }, 0);
    return Math.round(total / streams.length);
  };
  return (
    <animated.div className="diagnostic-modal" style={diagAnim}>
      <MdClose onClick={() => props.setShowDiag(false)} />
      <h2>Twitch Data</h2>
      <span>Average viewership: {average()}</span>
      <span>Skipped over streams: {offset}</span>
      {timer && (
        <Timer
          headline="Next refresh in:"
          minutes={timer.minutes}
          seconds={timer.seconds}
        />
      )}
      <div className="links">
        <a
          href="https://github.com/MarcDwyer/twitch-discovery"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub />
        </a>
      </div>
    </animated.div>
  );
};
export default Diag;
