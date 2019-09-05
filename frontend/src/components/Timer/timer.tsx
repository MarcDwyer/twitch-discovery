import React, { useEffect, useState } from 'react'
import './timer.scss'


interface Props {
    nextRefresh: number;
}
type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}
interface ITimer extends Array<Time | null | boolean>{0: Time | null; 1:boolean}
const useTimer = (futureTime: number): ITimer => {
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

const Timer = (props: Props) => {
    const [time, waiting] = useTimer(props.nextRefresh)
    return (
        <div className="timer-parent">
            {!waiting && time ? (
                <span>
                    {`Pulling new streamers in ${time.hours} hours ${time.minutes} minutes and ${time.seconds} seconds`}
                </span>
            ) : (
                    <span>
                        Fetching new streams...
                </span>
                )}
        </div>
    )
}


export default Timer