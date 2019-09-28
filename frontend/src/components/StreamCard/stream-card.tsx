import React from 'react'
import { FaTwitch } from 'react-icons/fa'
import { SubStream } from '../../data_types/data_types';

import './stream-card.scss'


interface Props {
    streamer: SubStream;
    updateFeatured(feat: SubStream): void;
}
const twitchColor = "#9147ff"
// TODO 
// HUGE BUG,
// Index being passed here does not reflect the index of the online array



const StreamCard = React.memo((props: Props) => {
    const { streamer } = props

    return (
        <div
            className="stream-card"
            onClick={(e) => {
                props.updateFeatured(streamer)
            }}
        >
            <div className="center-image"
                style={streamer.channel.profile_banner.length > 0 ? { backgroundImage: `url(${streamer.channel.profile_banner})` } : { backgroundColor: "#eee" }}
            ></div>
            <div className="center">
                <img
                    style={{ border: `4px solid ${twitchColor}`, cursor: 'pointer', boxShadow: `15px ${twitchColor}` }}
                    src={streamer.channel.logo} />
                <div className="text-info">
                    <span>{streamer.channel.display_name}</span>
                    <React.Fragment>
                        <span>Is playing {streamer.game}</span>
                        <span>{streamer.viewers} viewers</span>
                    </React.Fragment>
                </div>
            </div>
            <FaTwitch
            />
        </div>
    )
})

export default StreamCard