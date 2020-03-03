import React, { useState } from "react";
import { FaTwitch } from "react-icons/fa";
import { SubStream, Stream } from "../../data_types/data_types";

import "./stream-card.scss";

interface Props {
  streamer: Stream;
  updateFeatured(feat: SubStream): void;
}
const twitchColor = "#9147ff";

const StreamCard = React.memo((props: Props) => {
  const { streamData, channelData } = props.streamer;
  const [hover, setHover] = useState<boolean>(false);

  const getStyles = () => {
    let styles = {};
    if (hover && streamData) {
      styles = {
        ...styles,
        border: "3px solid #9147ff"
      };
    } else if (!streamData && !hover) {
      styles = {
        ...styles,
        opacity: ".55"
      };
    } else if (hover && !streamData) {
      styles = {
        ...styles,
        opacity: ".75"
      };
    }
    return styles;
  };
  return (
    <div
      className="stream-card"
      onClick={() => {
        if (!streamData) {
          window.open(channelData.url);
          return;
        }
        props.updateFeatured(streamData);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={getStyles()}
    >
      <div
        className="center-image"
        style={
          channelData.profile_banner
            ? { backgroundImage: `url(${channelData.profile_banner})` }
            : { backgroundColor: "#eee" }
        }
      ></div>
      <div className="center">
        <img
          style={
            streamData
              ? {
                  border: `4px solid ${twitchColor}`,
                  cursor: "pointer",
                  boxShadow: `15px ${twitchColor}`
                }
              : { border: "4px solid #eee" }
          }
          src={channelData.logo}
        />
        <div className="text-info">
          <span>{channelData.display_name}</span>
          {streamData ? (
            <React.Fragment>
              <span>Live</span>
              <span>Is playing {streamData.game}</span>
              <span>{streamData.viewers} viewers</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>was Playing {channelData.game}</span>
              <span>Offline</span>
            </React.Fragment>
          )}
        </div>
      </div>
      <FaTwitch />
    </div>
  );
});

export default StreamCard;
