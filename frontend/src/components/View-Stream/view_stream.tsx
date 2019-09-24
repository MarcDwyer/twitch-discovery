import React, { useEffect, useCallback, useState } from 'react'
import { SubStream } from '../../data_types/data_types';
import { MdClose } from 'react-icons/md'
import { useSpring, animated } from 'react-spring';
import { REMOVE_VIEW } from '../../reducers/reducer';
import './view_stream.scss'

type Props = {
    stream: SubStream;
    dispatchApp: Function;
}
const ViewStream = (props: Props) => {
    const { stream } = props
    const [showVideo, setShowVideo] = useState<boolean>(false)


    const anim = useSpring({
        from: {opacity: 0},
        opacity: 1,
    })
    const handleExit = useCallback((e: KeyboardEvent) => {
        if (e.keyCode !== 27) return
        props.dispatchApp({ type: REMOVE_VIEW })
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleExit)

        return function () {
            document.removeEventListener('keydown', handleExit)
        }
    }, [])

    useEffect(() => {
        setTimeout(() => setShowVideo(true), 450)
    }, [])

    return (
        <animated.div className="view-stream"
        style={anim}
        >
            <div className="video">
                <div className="sub-video">
                    <div className="close-div"
                        onClick={() => props.dispatchApp({ type: REMOVE_VIEW })}
                    >
                        <MdClose />
                    </div>
                    {showVideo && (
                        <iframe allowFullScreen={true} src={`https://player.twitch.tv/?channel=${stream.channel.display_name}&autoplay=true`} frameBorder="0" />
                    )}
                </div>
                <a
                    target="_blank"
                    href={stream.channel.url}
                    rel="noopener noreferrer"
                    className="twitch-button btn"
                >Visit Twitch Channel
            </a>
            </div>
            {window.innerWidth >= 1000 && (
                <div className="chat">
                    <iframe className="chat" src={`https://www.twitch.tv/embed/${stream.channel.display_name}/chat?darkpopout`} />
                </div>
            )}
        </animated.div>
    )
}

export default ViewStream