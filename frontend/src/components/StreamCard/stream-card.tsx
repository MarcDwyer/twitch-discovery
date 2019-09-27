import React from 'react'
import { FaTwitch } from 'react-icons/fa'
import { IStreamers } from '../Main/main';
import { SubStream } from '../../data_types/data_types';

import './stream-card.scss'


interface Props {
    streamer: IStreamers;
    updateFeatured(feat: SubStream): void;
}
const twitchColor = "#9147ff"
// TODO 
// HUGE BUG,
// Index being passed here does not reflect the index of the online array



const StreamCard = React.memo((props: Props) => {
    const { streamData, channelData } = props.streamer

    return (
        <div
            className="stream-card"
            onClick={(e) => {
                if (!streamData) return
                props.updateFeatured(streamData)
            }}
        >
            <div className="center-image"
                style={channelData.profile_banner.length > 0 ? { backgroundImage: `url(${channelData.profile_banner})` } : { backgroundColor: "#eee" }}
            ></div>
            <div className="center">
                <img
                    style={streamData ? { border: `4px solid ${twitchColor}`, cursor: 'pointer', boxShadow: `15px ${twitchColor}` } : { border: '4px solid grey' }}
                    src={channelData.logo} />
                <div className="text-info">
                    <span>{channelData.display_name}</span>
                    {streamData && (
                        <React.Fragment>
                            <span>Online</span>
                            <span>Is playing {streamData.game}</span>
                            <span>{streamData.viewers} viewers</span>
                        </React.Fragment>
                    )}
                    {!streamData && (
                        <React.Fragment>
                            <span>Offline</span>
                            <span>was playing {channelData.game}</span>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <FaTwitch
            />
        </div>
    )
})

export default StreamCard