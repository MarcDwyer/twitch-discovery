import React, { useRef, useState, useEffect } from 'react'
import { IStreamers, StructureStreams, Payload } from '../Main/main'
import { FaSync } from 'react-icons/fa'
import './featured.scss'

interface Props {
    data: Payload;
}
const Featured = (props: Props) => {
    const [streamers, setStreamers] = useState<IStreamers[]>(Object.values(props.data.streams))
    const [key, setKey] = useState<number>(0)
    const [featured, setFeatured] = useState<IStreamers | null>(null)
    useEffect(() => {
        setStreamers(Object.values(props.data.streams).filter(stream => stream.streamData))
    }, [props.data.streams])

    useEffect(() => {
        if (streamers[key]) {
            setFeatured(streamers[key])
        } else {
            setKey(0)
        }
    }, [key])

    useEffect(() => {
        if (featured && !featured.streamData) setKey(0)
    }, [featured])

    useEffect(() => {
        if (featured && streamers[key].streamName !== featured.streamName || featured && !featured.streamData) {
            setFeatured(streamers[key])
        }
    }, [streamers])
    return (
        <div className="featured">
            {featured && featured.streamData && (
                <React.Fragment>
                    <div className="header">
                        <FaSync
                            onClick={() => setKey(key + 1)}
                        />
                        <div className="title">
                            <h1>{featured.streamData.channel.display_name}</h1>
                            <span>{featured.streamData.viewers} viewers</span>
                        </div>
                    </div>
                    <div className="twitch">
                        <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${featured.streamName}&autoplay=true`} frameBorder="0" />
                        <iframe className="chat" src={`https://www.twitch.tv/embed/${featured.streamName}/chat?darkpopout`} />
                    </div>
                </React.Fragment>
            )}
        </div>
    )
}

export default Featured