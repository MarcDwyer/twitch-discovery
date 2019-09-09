import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger } from 'react-icons/fa'
import { ITimer } from '../../hooks/hooks'
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
    const percent = pullPercent * 100

    const average = Math.round(props.streams.reduce((num, stream) => num += stream.viewers, 0) / props.streams.length)


    return (
        createPortal(
            <React.Fragment>
                <FaHamburger
                    className="show-diag"
                    onClick={() => setShowDiag(!showDiag)}
                />
                <div className="diagnostic"
                    style={!showDiag ? { transform: 'translateX(-100%)' } : { transform: 'translateX(0)' }}
                    onClick={(e) => {
                        //@ts-ignore
                        if (e.target.classList.value !== 'diagnostic') return
                        setShowDiag(false)
                    }}
                >
                    <animated.div className="innertext" style={diagAnim}>
                        <h2>Twitch Data</h2>
                        <span className="top">
                            Top {percent.toString().length >= 4 ? percent.toFixed(2) : percent}% of streamers
                            </span>
                        <span>Total Streams: {total}</span>
                        <span>Average viewership: {average}</span>
                        <span>Skipped over: {offset}</span>
                        <span>Streamers left: {total - offset}</span>
                        {time && (
                            <span>{`Next refresh: ${time.hours}:${time.minutes}:${time.seconds}`}</span>
                        )}
                    </animated.div>
                </div>
            </React.Fragment>,
            //@ts-ignore
            document.querySelector('#root')
        )
    )
}
// document.querySelector('#root')
export default Diag