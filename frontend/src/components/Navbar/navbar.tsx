import React, { useState } from 'react'
import { Payload } from '../Main/main'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'
import { useTimer } from '../../hooks/hooks'
import { FaMoon, FaHamburger } from 'react-icons/fa'

import Modal from '../Modal/modal'
import CreateOffset from '../Offset-Change/change-offset'

import './navbar.scss'
interface Props {
    appData: Payload;
}



const Navbar = React.memo((props: Props) => {
    const { appData } = props
    const [showOffset, setShowOffset] = useState<boolean>(false)
    const [showDiag, setShowDiag] = useState<boolean>(false)
    const time = useTimer(appData.nextRefresh)

    return (
        <div className="navbar">
            <FaHamburger
                className="show-diag"
                onClick={() => setShowDiag(!showDiag)}
            />
            <Modal
                children={<Diagnostic streams={appData.online} diagnostic={appData.diagnostic} time={time} showDiag={showDiag} />}
                shouldOpen={showDiag}
                close={setShowDiag}
            />
            <Timer time={time} />
            <FaMoon
                className="offset-trigger"
                onClick={() => setShowOffset(!showOffset)}
            />
            <Modal
                children={<CreateOffset showOffset={showOffset} setShowOffset={setShowOffset} />}
                shouldOpen={showOffset}
                close={setShowOffset}
            />
        </div>
    )
})


export default Navbar