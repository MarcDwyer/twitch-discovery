import React, { useState, useEffect } from 'react'
import { IStreamers, StructureStreams } from '../Main/main'
import { FaSync } from 'react-icons/fa'
import './featured.scss'

interface Props {
    streamers: StructureStreams;
}
const Featured = (props: Props) => {
    const [online, setOnline] = useState<IStreamers[] | null>(null)
    const [key, setKey] = useState<number>(0)
    const featured = online ? online[key] : null

    useEffect(() => {
        const live = Object.values(props.streamers).filter(stream => stream.streamData)
        setOnline(live)
    }, [props.streamers])

    useEffect(() => {
        if (!online) return
        if (!online[key] || online[key] && !props.streamers[online[key].streamName].streamData) {
            setKey(0)
        } 
    }, [key])
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
                            <span>is playing {featured.streamData.game}</span>
                            <span>{featured.streamData.viewers} viewers</span>
                        </div>
                    </div>
                    <div className="twitch">
                        <div className="video">
                            <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${featured.streamName}&autoplay=false`} frameBorder="0" />
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