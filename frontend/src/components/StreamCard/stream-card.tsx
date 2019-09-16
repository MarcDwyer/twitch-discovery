import React from 'react'
import { FaTwitch } from 'react-icons/fa'
import { IStreamers } from '../Main/main';

import './stream-card.scss'
import { SubStream } from '../../data_types/data_types';

interface Props {
    streamer: IStreamers;
    updateFeatured(feat: SubStream): void;
}
const twitchColor = "#6441A5"
// TODO 
// HUGE BUG,
// Index being passed here does not reflect the index of the online array

const StreamCard = React.memo((props: Props) => {
    const { streamData, channelData } = props.streamer

    return (
        <div className="stream-card">
            <div className="center">
                <img
                    style={streamData ? { border: `3px solid ${twitchColor}`, cursor: 'pointer', boxShadow: `15px ${twitchColor}` } : { border: '3px solid grey' }}
                    onClick={() => {
                        if (!streamData) return
                        props.updateFeatured(streamData)
                    }}
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
            <a
                href={channelData.url}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaTwitch
                    style={streamData ? { color: twitchColor } : { color: '#eee' }}
                />
            </a>
        </div>
    )
})

export default StreamCard