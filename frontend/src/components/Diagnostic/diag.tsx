import React from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'

import './diag.scss'
type Props = {
    diag: IDiag;
    setShowDiag: Function;
}
const Diag = (props: Props) => {
    const { total, offset } = props.diag
    const diagAnim = useSpring({
        opacity: 1,
        from: { opacity: 0 }
    })
    const skippedOver = Math.floor(total * offset)
    return (
        createPortal(
            <div className="diagnostic"
                onClick={() => props.setShowDiag(false)}
            >
                <animated.div className="innertext" style={diagAnim}>
                    <h2>Diagnostic Data</h2>
                    <span>Total: {total}</span>
                    <span>Offset: {offset}</span>
                    <span>Skipped over: {skippedOver}</span>
                    <span>Streamers left: {total - skippedOver}</span>
                </animated.div>
            </div>,
            //@ts-ignore
            document.querySelector('#root')
        )
    )
}
// document.querySelector('#root')
export default Diag