import React, { useState, useEffect } from 'react'
import { Payload } from '../Main/main'
import Timer from '../Timer/timer'
import Diagnostic from '../Diagnostic/diag'

import './navbar.scss'
interface Props {
    appData: Payload;
}
type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}
export interface ITimer extends Array<Time | null | boolean> { 0: Time | null; 1: boolean }

export const useTimer = (futureTime: number): ITimer => {
    const [timer, setTimer] = useState<Time | null>(null)
    const [waiting, setWaiting] = useState<boolean>(false)

    useEffect(() => {
        let interval: number | undefined;
        clearTimeout(interval)
        //@ts-ignore
        interval = setInterval(() => {
            const now = new Date().getTime()
            if (now >= futureTime) {
                setWaiting(true)
                return
            }
            if (waiting) setWaiting(false)
            const distance = futureTime - now

            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setTimer({ hours, minutes, seconds })
        }, 1000)
        return function () {
            if (interval) clearInterval(interval)
        }
    }, [futureTime])

    return [timer, waiting]
}

const Navbar = (props: Props) => {
    const { appData } = props
    const time = useTimer(appData.nextRefresh)
    return (
        <div className="navbar">
            <Diagnostic diag={appData.diagnostic} time={time} />
            <Timer time={time} />
        </div>
    )
}


export default Navbar