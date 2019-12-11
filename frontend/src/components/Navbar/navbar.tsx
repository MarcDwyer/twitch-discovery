import React, { useState } from 'react'
import { Payload } from '../../reducers/reducer'
import { FaMoon, FaHamburger } from 'react-icons/fa'
import { SubStream } from '../../data_types/data_types';

import Modal from '../Modal/modal'
import CreateOffset from '../Offset-Change/change-offset'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'

import './navbar.scss'

interface Props {
    appData: Payload;
    view: SubStream | null;
}



const Navbar = (props: Props) => {
    const [showOffset, setShowOffset] = useState<boolean>(false)
    const [showDiag, setShowDiag] = useState<boolean>(false)
    return (
        <div className="navbar"
            style={props.view ? { backgroundColor: 'black' } : { backgroundColor: '#262626' }}
        >
            <FaHamburger
                className="show-diag"
                onClick={() => setShowDiag(!showDiag)}
            />
            <Modal
                children={<Diagnostic appData={props.appData}  showDiag={showDiag} setShowDiag={setShowDiag} />}
                shouldOpen={showDiag}
                close={setShowDiag}
            />
            <div className="timer-or-viewing">
                {props.view ? (
                    <span>Currently viewing {props.view.channel.name}</span>
                ) : (
                        <Timer nextRefresh={props.appData.nextRefresh} />
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
}


export default Navbar