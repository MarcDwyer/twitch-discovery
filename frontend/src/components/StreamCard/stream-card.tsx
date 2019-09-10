import React from 'react'
import { FaTwitch } from 'react-icons/fa'
import './stream-card.scss'
import { SubStream } from '../../data_types/data_types';
import { Featured } from '../Main/main';

interface Props {
    streamer: SubStream;
    updateFeatured(feat: Featured): void;
    index: number;
}
const twitchColor = "#6441A5"
// TODO 
// Fix offline 
const StreamCard = React.memo((props: Props) => {
    const { streamer } = props

    return (
        <div className="stream-card">
            <div className="center">
                <img
                    style={{ border: `3px solid ${twitchColor}`, cursor: 'pointer' }}
                    onClick={() => {
                        props.updateFeatured({ stream: streamer, index: props.index })
                    }}
                    src={streamer.channel.logo} />
                <div className="text-info">
                    <span>{streamer.channel.display_name}</span>
                    <span>Is playing {streamer.game}</span>
                    <span>{streamer.viewers} viewers</span>
                </div>
            </div>
            <a
                href={`https://www.twitch.tv/${streamer.channel.name}`}
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