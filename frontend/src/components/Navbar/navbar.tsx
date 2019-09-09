import React from 'react'
import { Payload } from '../Main/main'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'
import { useTimer, useAverage } from '../../hooks/hooks'

import './navbar.scss'
interface Props {
    appData: Payload;
}



const Navbar = React.memo((props: Props) => {
    const { appData } = props
    const time = useTimer(appData.nextRefresh)
    const average = useAverage(appData.online)
    return (
        <div className="navbar">
            <Diagnostic average={average} diagnostic={appData.diagnostic} time={time} />
            <Timer time={time} />
        </div>
    )
})


export default Navbar