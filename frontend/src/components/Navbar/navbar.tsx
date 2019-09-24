import React, { useState } from 'react'
import { Payload } from '../Main/main'
import { useTimer } from '../../hooks/hooks'
import { FaMoon, FaHamburger } from 'react-icons/fa'
import { SubStream } from '../../data_types/data_types';

import Modal from '../Modal/modal'
import CreateOffset from '../Offset-Change/change-offset'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'

import './navbar.scss'

interface Props {
    appData: Payload;
    view: SubStream;
}



const Navbar = React.memo((props: Props) => {
    const { appData } = props
    const [showOffset, setShowOffset] = useState<boolean>(false)
    const [showDiag, setShowDiag] = useState<boolean>(false)
    const time = useTimer(appData.nextRefresh)

    return (
        <div className="navbar"
        >
            <FaHamburger
                className="show-diag"
                onClick={() => setShowDiag(!showDiag)}
            />
            <Modal
                children={<Diagnostic streams={appData.online} diagnostic={appData.diagnostic} time={time} showDiag={showDiag} setShowDiag={setShowDiag} />}
                shouldOpen={showDiag}
                close={setShowDiag}
            />
            <div className="timer-or-viewing">
                {props.view ? (
                        <span>Viewing {props.view.channel.name}</span>
                ) : (
                        <Timer time={time} />
                    )}
            </div>
            <FaMoon
                className="offset-trigger buttons"
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