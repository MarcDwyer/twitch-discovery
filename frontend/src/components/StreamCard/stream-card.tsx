import React from 'react'
import './stream-card.scss'
import { IStreamers } from '../Main/main'
import { FaTwitch } from 'react-icons/fa'

interface Props {
    streamer: IStreamers;
}
// https://www.twitch.tv/
const StreamCard = (props: Props) => {
    const { streamData, channelData } = props.streamer
    return (
        <div className="stream-card">
            <div className="center">
                <img src={channelData.logo} />
                <div className="text-info">
                    <span>{channelData.display_name}</span>
                    {streamData && (
                        <span>Is playing {streamData.game}</span>
                    )}
                    <span>{streamData ? `${streamData.viewers} viewers` : 'Offline'}</span>
                </div>
            </div>
            <a
                href={`https://www.twitch.tv/${channelData.name}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaTwitch
                    style={streamData ? { color: "#6441A5" } : { color: '#eee' }}
                />
            </a>
        </div>
    )
}

export default StreamCard