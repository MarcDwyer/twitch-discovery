import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger } from 'react-icons/fa'
import { ITimer } from '../Navbar/navbar'
import './diag.scss'

type Props = {
    diag: IDiag;
    time: ITimer;
}
const Diag = (props: Props) => {
    const { total, offset } = props.diag
    const [time, waiting] = props.time
    const [showDiag, setShowDiag] = useState<boolean>(false)

    const diagAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-100%)' },
        reverse: !showDiag
    })
    const skippedOver = Math.floor(total * offset)
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
                        <span>Total Streams: {total}</span>
                        <span>Offset Value: {offset}</span>
                        <span>Skipped over: {skippedOver}</span>
                        <span>Streamers left: {total - skippedOver}</span>
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