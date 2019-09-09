import React from 'react'
import { IStreamers } from '../Main/main'
import { FaTwitch } from 'react-icons/fa'
import { SubStream } from '../../data_types/data_types'

import './stream-card.scss'

interface Props {
    streamer: IStreamers;
    setFeatured(stream: SubStream): void;
}
// https://www.twitch.tv/
const StreamCard = React.memo((props: Props) => {
    const { streamData, channelData } = props.streamer
    const twitchColor = "#6441A5"
    console.log('streamcard rendered')
    return (
        <div className="stream-card">
            <div className="center">
                <img
                style={streamData ? {border: `solid 3px ${twitchColor}`, cursor: 'pointer'} : {}} 
                onClick={() => {
                    if (!streamData) return
                    props.setFeatured(streamData)
                }}
                src={channelData.logo} />
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
                    style={streamData ? { color: twitchColor } : { color: '#eee' }}
                />
            </a>
        </div>
    )
})

export default StreamCard