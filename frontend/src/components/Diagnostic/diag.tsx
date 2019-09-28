import React from 'react'
import { Payload } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaGithub } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'
import { usePercentage, useTimer } from '../../hooks/hooks'



import './diag.scss'


interface Props {
    showDiag: boolean;
    appData: Payload;
    setShowDiag(boolean): void;
}
const Diag = (props: Props) => {
    const { total, offset, skippedOver } = props.appData.diagnostic
    const [timer, waiting] = useTimer(props.appData.nextRefresh)
    const diagAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(-100%)' },
        reverse: !props.showDiag
    })
    const average = Math.round(props.appData.streams.reduce((num, stream) => num += stream.viewers, 0) / props.appData.streams.length)
    const top = usePercentage(offset)

    return (
        <React.Fragment>
            <animated.div className="innertext" style={diagAnim}>
                <MdClose
                    onClick={() => props.setShowDiag(false)}
                />
                <h2>Twitch Data</h2>
                <span className="top">
                    Top {top} of streamers
                            </span>
                <span>Total Streams: {total}</span>
                <span>Average viewership: {average}</span>
                <span>Skipped over streams: {skippedOver}</span>
                <span>Streamers left: {total - skippedOver}</span>
                {timer && (
                    <span>{`Next refresh: ${timer.hours}:${timer.minutes}:${timer.seconds}`}</span>
                )}
                <div className="links">
                    <a
                        href="https://github.com/MarcDwyer/twitch-discovery"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub />
                    </a>
                </div>
            </animated.div>
        </React.Fragment>
    )
}
// document.querySelector('#root')
export default Diag