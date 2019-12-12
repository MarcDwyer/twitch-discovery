import React from "react";
import { useSpring, animated } from "react-spring";
import { FaGithub } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { usePercentage, useAverage, useTimer } from "../../hooks/hooks";
import { useSelector } from "react-redux";

import "./diag.scss";
import { ReduxStore } from "../../reducers/reducer";

interface Props {
  showDiag: boolean;
  setShowDiag(p: boolean): void;
}
const Diag = (props: Props) => {
  const [
    streams,
    nextRefresh,
    { total, offset, skippedOver }
  ] = useSelector((state: ReduxStore) => [
    state.streamData.streams,
    state.streamData.nextRefresh,
    state.streamData.diagnostic
  ]);
  const diagAnim = useSpring({
    opacity: 1,
    transform: "translateX(0)",
    from: { opacity: 0, transform: "translateX(-100%)" },
    reverse: !props.showDiag
  });
  const average = useAverage(streams);
  const top = usePercentage(offset);
  const timer = useTimer(nextRefresh);

  return (
    <React.Fragment>
      <animated.div className="innertext" style={diagAnim}>
        <MdClose onClick={() => props.setShowDiag(false)} />
        <h2>Twitch Data</h2>
        <span className="top">Top {top} of streamers</span>
        <span>Total Streams: {total}</span>
        <span>Average viewership: {average}</span>
        <span>Skipped over streams: {skippedOver}</span>
        <span>Streamers left: {total - skippedOver}</span>
        {timer && (
          <span>{`Next refresh: ${timer.minutes} mins and ${timer.seconds} sec`}</span>
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
    </React.Fragment>
  );
};
// document.querySelector('#root')
export default Diag;
