import React from "react";
import { MdClose } from "react-icons/md";
import { useSpring, animated } from "react-spring";
import { setView } from "../../actions/stream_actions";
import "./view_stream.scss";
import { ReduxStore } from "../../reducers/reducer";
import { useSelector, useDispatch } from "react-redux";

const ViewStream = () => {
  const view = useSelector((state: ReduxStore) => state.streamData.view);
  const dispatch = useDispatch();
  const videoAnim = useSpring({
    from: { opacity: 0, transform: "translateY(100%)" },
    transform: "translateY(0%)",
    opacity: 1,
    reverse: view ? false : true
  });
  return (
    <animated.div className="video" style={videoAnim}>
      <div className="sub-video">
        {view && (
          <React.Fragment>
            <div className="close-div" onClick={() => dispatch(setView(null))}>
              <MdClose />
            </div>
            <div className="video-container">
              {view && (
                <iframe
                  allowFullScreen={true}
                  src={`https://player.twitch.tv/?channel=${view.channel.display_name}&autoplay=true`}
                  frameBorder="0"
                />
              )}
            </div>

            <a
              target="_blank"
              href={view ? view.channel.url : "https://twitch.tv"}
              rel="noopener noreferrer"
              className="twitch-button btn"
            >
              Visit Twitch Channel
            </a>
            <span className="viewer-count">{view.viewers} viewers</span>
          </React.Fragment>
        )}
      </div>
      {window.innerWidth >= 1000 && view && (
        <div className="chat">
          <iframe
            className="chat"
            src={`https://www.twitch.tv/embed/${view.channel.display_name}/chat?darkpopout`}
          />
        </div>
      )}
    </animated.div>
  );
};

export default ViewStream;
