import React, { useState, useEffect } from 'react'
import { SubStream } from '../../data_types/data_types';
import { MdClose } from 'react-icons/md'
import { useSpring, animated } from 'react-spring';
import { REMOVE_VIEW } from '../../reducers/reducer';
import './view_stream.scss'

type Props = {
    stream: SubStream | null;
    dispatchApp: Function;
}
const ViewStream = (props: Props) => {
    const { stream } = props
    const [showVideo, setShowVideo] = useState<boolean>(false)


    const videoAnim = useSpring({
        from: { opacity: 0, transform: 'translateY(100%)' },
        transform: 'translateY(0%)',
        opacity: 1,
        reverse: props.stream ? false : true
    })

    useEffect(() => {
        if (props.stream) {
            setTimeout(() => {
                if (props.stream) {
                    setShowVideo(true)
                }
            }, 650)
        } else {
            setShowVideo(false)
        }
    }, [props.stream])
 
    return (
        <animated.div className="video" style={videoAnim}>
            <div className="sub-video">
                {props.stream && (
                    <React.Fragment>
                        <div className="close-div"
                            onClick={() => props.dispatchApp({ type: REMOVE_VIEW })}
                        >
                            <MdClose />
                        </div>
                        <div className="video-container">
                            {showVideo && (
                                <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${stream.channel.display_name}&autoplay=true`} frameBorder="0" />
                            )}
                        </div>
                        
                        <a
                            target="_blank"
                            href={props.stream ? props.stream.channel.url : "https://twitch.tv"}
                            rel="noopener noreferrer"
                            className="twitch-button btn"
                        >Visit Twitch Channel
            </a>
            <span className="viewer-count">{stream.viewers} viewers</span>

                    </React.Fragment>
                )}
            </div>
            {window.innerWidth >= 1000 && props.stream && (
                <div className="chat">
                    {props.stream && (
                        <iframe className="chat" src={`https://www.twitch.tv/embed/${stream.channel.display_name}/chat?darkpopout`} />
                    )}
                </div>
            )}
        </animated.div>
    )
}

export default ViewStream