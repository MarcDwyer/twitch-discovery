import { useState, useEffect } from 'react'
import io from 'socket.io-client'

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
        let interval;

        const getTime = () => {
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
        }
        getTime()
     
        interval = setInterval(getTime, 1000)
       
        return function() {
            clearInterval(interval)
        }
    }, [futureTime])

    return [timer, waiting]
}


export const useSocket = (url: string): WebSocket | null => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        if (!socket) {
            setSocket(new WebSocket(url))
        }
    }, [url])
    return socket
}

export const usePercentage = (num: number) => {
    const [top, setTop] = useState<string | number>('Calculating percentage...')
    useEffect(() => {
        let top: number | string = num * 100
        if (top.toString().length >= 3) {
            top = top.toFixed(2)
        }
        top = `${top}%`
        setTop(top)
    }, [num])
    return top
}