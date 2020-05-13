import React, { useState } from "react";
import { FaTwitch } from "react-icons/fa";
import { FTypes } from "../../data_types/data_types";

import "./stream-card.scss";

interface Props {
  streamer: FTypes.Stream;
  updateFeatured(feat: FTypes.Stream): void;
}
const twitchColor = "#9147ff";

const StreamCard = React.memo((props: Props) => {
  const { channel } = props.streamer;
  const [hover, setHover] = useState<boolean>(false);

  const getStyles = () => {
    let styles = {};
    if (hover) {
      styles = {
        ...styles,
        border: "3px solid #9147ff",
      };
    } else if (!hover) {
      styles = {
        ...styles,
        opacity: ".75",
      };
    } else if (hover) {
      styles = {
        ...styles,
        opacity: "1",
      };
    }
    return styles;
  };

  return (
    <div
      className="stream-card"
      onClick={() => {
        props.updateFeatured(props.streamer);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={getStyles()}
    >
      <div
        className="center-image"
        style={channel.profile_banner
          ? { backgroundImage: `url(${channel.profile_banner})` }
          : { backgroundColor: "#eee" }}
      >
      </div>
      <div className="center">
        <img
          style={{
            border: `4px solid ${twitchColor}`,
            cursor: "pointer",
            boxShadow: `15px ${twitchColor}`,
          }}
          src={channel.logo}
        />
        <div className="text-info">
          <span>{channel.display_name}</span>
          <React.Fragment>
            <span>Live</span>
            <span>Is playing {props.streamer.game}</span>
            <span>{props.streamer.viewers} viewers</span>
          </React.Fragment>
        </div>
      </div>
      <FaTwitch />
    </div>
  );
});

export default StreamCard;
