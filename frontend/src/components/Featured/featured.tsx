import React, { useRef, useState, useEffect } from 'react'
import { IStreamers, StructureStreams } from '../Main/main'
import { FaSync } from 'react-icons/fa'
import './featured.scss'

interface Props {
    streamers: StructureStreams;
}
const Featured = (props: Props) => {
    const [streamers, setStreamers] = useState<IStreamers[]>(Object.values(props.streamers))
    const [key, setKey] = useState<number>(0)
    const [featured, setFeatured] = useState<IStreamers | null>(null)
    useEffect(() => {
        setStreamers(Object.values(props.streamers).filter(stream => stream.streamData))
    }, [props.streamers])

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
    return (
        <div className="featured">
            {featured && featured.streamData && (
                <React.Fragment>
                    <div className="header">
                        <h1>{featured.streamData.channel.display_name}</h1>
                        <FaSync
                            onClick={() => setKey(key + 1)}
                        />
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