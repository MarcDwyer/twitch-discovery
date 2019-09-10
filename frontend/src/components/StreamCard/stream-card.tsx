import React from 'react'
import { FaTwitch } from 'react-icons/fa'
import './stream-card.scss'
import { IStreamers } from '../Main/main';

interface Props {
    streamer: IStreamers;
    index: number;
    updateFeatured: Function;
}
const twitchColor = "#6441A5"
// https://www.twitch.tv/
const StreamCard = React.memo((props: Props) => {
    const { streamData, channelData } = props.streamer
    return (
        <div className="stream-card">
            <div className="center">
                <img
                    style={streamData ? { border: `3px solid ${twitchColor}`} : {border: 'solid 3px #eee'}}
                    onClick={() => {
                        if (!streamData) return
                        props.updateFeatured(streamData, props.index)
                    }}
                    src={channelData.logo} />
                <div className="text-info">
                    <span>{channelData.display_name}</span>
                    {streamData && (
                        <React.Fragment>
                            <span>Is playing {streamData.game}</span>
                            <span>{streamData.viewers} viewers</span>
                        </React.Fragment>
                    )}
                </div>
            </div>
            <a
                href={`https://www.twitch.tv/${channelData.name}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <FaTwitch
                    style={{ color: twitchColor }}
                />
            </a>
        </div>
    )
})

export default StreamCard