import React from 'react'
import { FaSync } from 'react-icons/fa'

import './featured.scss'
import { SubStream } from '../../data_types/data_types'

interface Props {
    featured: SubStream;
    incFeatured(): void;
}
const Featured = React.memo((props: Props) => {
    const { featured } = props
    return (
        <div className="featured-parent">
            <div className="featured">
                <div className="header">
                    <FaSync
                    onClick={() => props.incFeatured()}
                    />
                    <div className="title">
                        <h2>{featured.channel.display_name}</h2>
                        <span>is playing {featured.game}</span>
                        <span>{featured.viewers} viewers</span>
                    </div>
                </div>
                <div className="twitch">
                    <div className="video">
                        <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${featured.channel.display_name}&autoplay=false`} frameBorder="0" />
                        <a
                            className="twitch-button"
                            href={`https://twitch.tv/${featured.channel.display_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Twitch channel
                    </a>
                    </div>
                    <iframe className="chat" src={`https://www.twitch.tv/embed/${featured.channel.display_name}/chat?darkpopout`} />
                </div>
            </div>
        </div>
    )
})

export default Featured