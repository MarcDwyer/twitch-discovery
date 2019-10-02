import React, { useState } from 'react'
import { FaTwitch } from 'react-icons/fa'
import { SubStream, StructurcedStreams } from '../../data_types/data_types';

import './stream-card.scss'


interface Props {
    streamer: StructurcedStreams;
    updateFeatured(feat: SubStream): void;
}
const twitchColor = "#9147ff"
// TODO 
// HUGE BUG,
// Index being passed here does not reflect the index of the online array



const StreamCard = React.memo((props: Props) => {
    const { streamData, channelData } = props.streamer
    const [hover, setHover] = useState<boolean>(false)
    return (
        <div
            className="stream-card"
            onClick={() => {
                if (!streamData) return
                props.updateFeatured(streamData)
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={hover && streamData ? { border: "3px solid #9147ff", cursor: 'pointer' } : {}}
        >
            <div className="center-image"
                style={channelData.profile_banner.length > 0 ? { backgroundImage: `url(${channelData.profile_banner})` } : { backgroundColor: "#eee" }}
            ></div>
            <div className="center">
                <img
                    style={streamData ? { border: `4px solid ${twitchColor}`, cursor: 'pointer', boxShadow: `15px ${twitchColor}` } : { border: "4px solid #eee" }}
                    src={channelData.logo} />
                <div className="text-info">
                    <span>{channelData.display_name}</span>
                    {streamData ? (
                        <React.Fragment>
                            <span>Is playing {streamData.game}</span>
                            <span>{streamData.viewers} viewers</span>
                        </React.Fragment>

                    ) : (
                            <React.Fragment>
                                <span>was Playing {channelData.game}</span>
                                <span>Offline</span>
                            </React.Fragment>
                        )
                    }
                </div>
            </div>
            <FaTwitch
            />
        </div>
    )
})

export default StreamCard