import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger, FaGithub } from 'react-icons/fa'
import { ITimer, usePercentage } from '../../hooks/hooks'
import { SubStream } from '../../data_types/data_types'

import './diag.scss'

type Props = {
    diagnostic: IDiag;
    time: ITimer;
    streams: SubStream[];
}
const Diag = (props: Props) => {
    const { total, offset, pullPercent } = props.diagnostic
    const [time, waiting] = props.time
    const [showDiag, setShowDiag] = useState<boolean>(false)

    const diagAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-100%)' },
        reverse: !showDiag
    })
    const average = Math.round(props.streams.reduce((num, stream) => num += stream.viewers, 0) / props.streams.length)
    const top = usePercentage(pullPercent)
    return (
        createPortal(
            <React.Fragment>
                <FaHamburger
                    className="show-diag"
                    onClick={() => setShowDiag(!showDiag)}
                />
                <div className="diagnostic"
                    style={!showDiag ? { display: 'none' } : {}}
                    onClick={(e) => {
                        //@ts-ignore
                        if (e.target.classList.value !== 'diagnostic') return
                        setShowDiag(false)
                    }}
                >
                </div>
                <animated.div className="innertext" style={diagAnim}>
                    <h2>Twitch Data</h2>
                    <span className="top">
                        Top {top} of streamers
                            </span>
                    <span>Total Streams: {total}</span>
                    <span>Average viewership: {average}</span>
                    <span>Skipped over: {offset}</span>
                    <span>Streamers left: {total - offset}</span>
                    {time && (
                        <span>{`Next refresh: ${time.hours}:${time.minutes}:${time.seconds}`}</span>
                    )}
                    <a
                    href="https://github.com/MarcDwyer/twitch-discovery"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                        <FaGithub />
                    </a>
                </animated.div>
            </React.Fragment>,
            //@ts-ignore
            document.querySelector('#root')
        )
    )
}
// document.querySelector('#root')
export default Diag