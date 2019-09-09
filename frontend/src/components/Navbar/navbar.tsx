import React from 'react'
import { Payload } from '../Main/main'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'
import { useTimer } from '../../hooks/hooks'

import './navbar.scss'
interface Props {
    appData: Payload;
}



const Navbar = React.memo((props: Props) => {
    const { appData } = props
    const time = useTimer(appData.nextRefresh)

    return (
        <div className="navbar">
            <Diagnostic streams={appData.streams} diagnostic={appData.diagnostic} time={time} />
            <Timer time={time} />
        </div>
    )
})


export default Navbar