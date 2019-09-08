import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Payload } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger } from 'react-icons/fa'
import { ITimer } from '../Navbar/navbar'
import './diag.scss'

type Props = {
    appData: Payload;
    time: ITimer;
}
const Diag = (props: Props) => {
    const { total, offset, pullPercent } = props.appData.diagnostic
    const [time, waiting] = props.time
    const [showDiag, setShowDiag] = useState<boolean>(false)

    const diagAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-100%)' },
        reverse: !showDiag
    })
    const streams = Object.values(props.appData.streams)
    const percent = pullPercent * 100,
        //@ts-ignore
        totalViewers = streams.filter(stream => stream.streamData).reduce((num, stream) => num += stream.streamData.viewers, 0)
    // percent < .9 ? 1 : 
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
                        <span>Average viewership: {Math.round(totalViewers / streams.length)}</span>
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