import React, { useState, useEffect } from 'react'
import { IStreamers, Payload, StructureStreams } from '../Main/main'
import { FaSync } from 'react-icons/fa'
import './featured.scss'

interface Props {
    data: Payload;
}
type FStreamers = {
    live: StructureStreams;
    keys: string[];
}
const Featured = (props: Props) => {
    const [featData, setFeatData] = useState<FStreamers | null>(null)
    const [key, setKey] = useState<number>(0)
    const [featured, setFeatured] = useState<null | IStreamers>(null)

    useEffect(() => {
        const filtered = Object.values(props.data.streams).filter(stream => stream.streamData)
        if (filtered.length <= 1) {
            setFeatData(null)
        } else {
            const streamer = filtered.reduce((obj: StructureStreams, stream) => {
                obj[stream.streamName] = stream
                return obj
            }, {})
            setFeatData({ live: streamer, keys: Object.keys(streamer) })
        }
    }, [props.data.streams])

    useEffect(() => {
        if (!featData) return
        const { live, keys } = featData
        const selected = live[keys[key]] ? live[keys[key]] : null
        if (!selected && featData.keys.length >= 1) {
            setKey(0)
        } else if (featData.keys.length === 0) {
            setFeatured(null)
        } else {
            setFeatured(live[keys[key]])
        }
    }, [featData, key])
    
    return (
        <div className="featured-parent">
            {featured && featured.streamData && (
                <div className="featured">
                    <div className="header">
                        <FaSync
                            onClick={() => setKey(key + 1)}
                        />
                        <div className="title">
                            <h2>{featured.streamData.channel.display_name}</h2>
                            <span>{featured.streamData.viewers} viewers</span>
                        </div>
                    </div>
                    <div className="twitch">
                        <div className="video">
                            <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${featured.streamName}&autoplay=true`} frameBorder="0" />
                            <a
                                className="twitch-button"
                                href={`https://twitch.tv/${featured.channelData.display_name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit Twitch channel
                    </a>
                        </div>
                        <iframe className="chat" src={`https://www.twitch.tv/embed/${featured.streamName}/chat?darkpopout`} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Featured