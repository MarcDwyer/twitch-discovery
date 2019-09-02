import React, { useRef, useState, useEffect } from 'react'
import { IStreamers, StructureStreams } from '../Main/main'

import './featured.scss'

interface Props {
    streamers: StructureStreams;
}

const useFeatured = (data: StructureStreams) => {
    const [feat, setFeat] = useState<IStreamers | null>(null)

    useEffect(() => {
        if (!feat || feat && !data[feat.streamName].streamData) {
            const dataArray = Object.values(data)
            for (let x = 0; x < dataArray.length; x++) {
                const stream = dataArray[x]
                if (stream.streamData) {
                    setFeat(stream)
                    break;
                }
            }
        }
    }, [data])
    return feat
}
// `https://player.twitch.tv/?channel=${one.name}&autoplay=true`
//https://www.twitch.tv/embed/${stream.name}/chat?darkpopout
const Featured = (props: Props) => {
    const featured = useFeatured(props.streamers)
    return (
        <div className="featured">
            {featured && featured.streamData && (
                <React.Fragment>
                    <h1>{featured.streamData.channel.display_name}</h1>
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