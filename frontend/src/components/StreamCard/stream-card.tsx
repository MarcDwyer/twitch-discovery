import React from 'react'
import { SubStream } from '../../data_types/data_types'
import { FaTwitch } from 'react-icons/fa'
import { SET_FEATURED } from '../../reducers/reducer'
import './stream-card.scss'

interface Props {
    streamer: SubStream;
    index: number;
    dispatchFeat: Function;
}
const twitchColor = "#6441A5"
// https://www.twitch.tv/
const StreamCard = React.memo((props: Props) => {
    const { streamer } = props
    console.log('re')
    return (
        <div className="stream-card">
            <div className="center">
                <img
                    style={{ border: `3px solid ${twitchColor}`, cursor: 'pointer' }}
                    onClick={() => {
                        console.log(streamer)
                        props.dispatchFeat({type: SET_FEATURED, payload: {stream: streamer, index: props.index}})
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