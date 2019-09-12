import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger, FaGithub, FaMoon } from 'react-icons/fa'
import { ITimer, usePercentage } from '../../hooks/hooks'
import { SubStream } from '../../data_types/data_types'
import { withRouter, RouteComponentProps, Link } from 'react-router-dom'

import './diag.scss'

interface Props extends RouteComponentProps {
    diagnostic: IDiag;
    time: ITimer;
    streams: SubStream[];
}
const Diag = (props: Props) => {
    const { total, offset, skippedOver } = props.diagnostic
    const [time, waiting] = props.time
    const [showDiag, setShowDiag] = useState<boolean>(false)

    const diagAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-100%)' },
        reverse: !showDiag
    })
    const average = Math.round(props.streams.reduce((num, stream) => num += stream.viewers, 0) / props.streams.length)
    const top = usePercentage(offset)

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
                    <span>Skipped over streams: {skippedOver}</span>
                    <span>Streamers left: {total - skippedOver}</span>
                    {time && (
                        <span>{`Next refresh: ${time.hours}:${time.minutes}:${time.seconds}`}</span>
                    )}
                    <div className="links">
                        <a
                            href="https://github.com/MarcDwyer/twitch-discovery"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaGithub />
                        </a>
                        <Link
                            to="/set-offset"
                        >
                            <FaMoon />
                        </Link>
                    </div>
                </animated.div>
            </React.Fragment>,
            //@ts-ignore
            document.querySelector('#root')
        )
    )
}
// document.querySelector('#root')
export default withRouter(Diag)