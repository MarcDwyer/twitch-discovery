import React from 'react'
import './stream-card.scss'
import { IStream } from '../Main/main'
import { FaTwitch } from 'react-icons/fa'
interface Props {
    streamer: IStream;
}
// https://www.twitch.tv/
const StreamCard = (props: Props) => {
    const { stream, channelData } = props.streamer
    return (
        <div className="stream-card">
            <div className="center">
                <img src={channelData.logo} />
                <div className="text-info">
                    <span>{channelData.display_name}</span>
                    {stream && (
                        <span>is playing {stream.game}</span>
                    )}
                    <span>{stream ? `${stream.viewers} viewers` : 'Offline'}</span>
                </div>
            </div>
            <a
                href={`https://www.twitch.tv/${channelData.name}`}
                target="_blank"
            >
                <FaTwitch
                style={stream ? {color: "#6441A5"} : {color: '#eee'}}
                />
            </a>
        </div>
    )
}

export default StreamCard