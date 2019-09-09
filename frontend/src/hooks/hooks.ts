import { useState, useEffect } from 'react'
import { SubStream } from '../data_types/data_types'

export interface ITimer extends Array<Time | null | boolean> { 0: Time | null; 1: boolean }

export type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}

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
            const distance = futureTime - now

            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setWaiting(false)
            setTimer({ hours, minutes, seconds })
        }, 1000)
        return function () {
            if (interval) clearInterval(interval)
        }
    }, [futureTime])

    return [timer, waiting]
}



export const useAverage = (online: SubStream[]) => {
    const [avg, setAvg] = useState<number>(0)

    useEffect(() => {
        const average = online.reduce((num, stream) => stream.viewers += num, 0) / online.length
        setAvg(Math.round(average))
    }, [online])

    return avg
}