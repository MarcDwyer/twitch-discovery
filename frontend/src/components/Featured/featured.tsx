import React, { useState, useEffect } from 'react'
import { IStreamers, Payload } from '../Main/main'
import { FaSync } from 'react-icons/fa'
import './featured.scss'

interface Props {
    data: Payload;
}
const Featured = (props: Props) => {
    const [streamers, setStreamers] = useState<IStreamers[] | null>(null)
    const [key, setKey] = useState<number>(0)

    useEffect(() => {
        const filtered = Object.values(props.data.streams).filter(stream => stream.streamData)
        if (filtered.length <= 1) {
            setStreamers(null)
        } else {
            setStreamers(filtered)
        }
    }, [props.data.streams])

    useEffect(() => {
        if (streamers && !streamers[key]) setKey(0)
    }, [key])

    const featured = streamers ? streamers[key] : null

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