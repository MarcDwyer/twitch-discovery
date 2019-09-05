import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { IDiag } from '../Main/main'
import { useSpring, animated } from 'react-spring'
import { FaHamburger } from 'react-icons/fa'

import './diag.scss'
type Props = {
    diag: IDiag;
}
const Diag = (props: Props) => {
    const { total, offset } = props.diag
    const [showDiag, setShowDiag] = useState<boolean>(false)

    const diagAnim = useSpring({
        opacity: 1,
        from: { opacity: 0 }
    })
    const skippedOver = Math.floor(total * offset)
    return (
        createPortal(
            <React.Fragment>
                <FaHamburger
                    className="show-diag"
                    onClick={() => setShowDiag(!showDiag)}
                />
                {showDiag && (
                    <div className="diagnostic"
                        onClick={() => setShowDiag(false)}
                    >
                        <animated.div className="innertext" style={diagAnim}>
                            <h2>Diagnostic Data</h2>
                            <span>Total: {total}</span>
                            <span>Offset: {offset}</span>
                            <span>Skipped over: {skippedOver}</span>
                            <span>Streamers left: {total - skippedOver}</span>
                        </animated.div>
                    </div>
                )}
            </React.Fragment>,
            //@ts-ignore
            document.querySelector('#root')
        )
    )
}
// document.querySelector('#root')
export default Diag