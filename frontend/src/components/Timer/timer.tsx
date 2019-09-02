import React, { useEffect, useState } from 'react'
import './timer.scss'


interface Props {
    nextRefresh: number;
}

const useTimer = (futureTime: number): number[] => {
    const [timer, setTimer] = useState<number[]>([])
    useEffect(() => {
        let interval: number | undefined;
        clearTimeout(interval)
        interval = setInterval(() => {
            const distance = futureTime - new Date().getTime()
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setTimer([hours, minutes, seconds])
        })
        return function () {
            if (interval) clearInterval(interval)
        }
    }, [futureTime])
    return timer
}

const Timer = (props: Props) => {
    const [hours, minutes, seconds] = useTimer(props.nextRefresh)
    return (
        <div className="timer-parent">
            <span>
                {`Pulling new streamers in ${hours} hours ${minutes} minutes and ${seconds} seconds`}
            </span>
        </div>
    )
}


export default Timer