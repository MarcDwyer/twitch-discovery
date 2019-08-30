import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { hot } from 'react-hot-loader/root';
import { Channel, SubStream } from '../../data_types/data_types'
import StreamCard from '../StreamCard/stream-card'
import Timer from '../Timer/timer'
import './main.scss'
type Payload = {
    nextRefresh: number;
    streams: IStream[];
}
export type IStream = {
    stream: SubStream | null;
    streamName: string;
    channelData: Channel;
}
// Use channel data for channel info. Check stream key in streamData if null because streamers can go offline. 
// `${document.location.hostname}:5000`
const useSocket = (url: string): SocketIOClient.Socket | null => {
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)
    useEffect(() => {
        const socketRef = io(url)
        setSocket(socketRef)

        return function () {
            socketRef.disconnect()
        }
    }, [url])
    return socket
}


const Main = () => {
    const socket = useSocket(`${document.location.hostname}:5000`)
    const [streamData, setStreamData] = useState<Payload | null>(null)
    const dataRef = useRef<Payload | null>(null)

    const updateData = (refresh: IStream[]) => {
        if (!dataRef.current) return
        dataRef.current.streams = refresh
        const shallow = { ...dataRef.current }
        setStreamData(shallow)
    }
    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => {
                    setStreamData(data)
                })
                socket.on('updated-data', (data: IStream[]) => updateData(data))
                socket.on('request-error', (data: any) => {
                    console.log('error', data)

                })
            })
        }
    }, [socket])
    useEffect(() => {
        if (streamData) dataRef.current = streamData
    }, [streamData])

    console.log(streamData)
    return (
        <div className="main">
            {streamData && (
                <Timer nextRefresh={streamData.nextRefresh} />
            )}
            <div className="streamer-grid">
                {streamData && (
                    streamData.streams.map(stream => (
                        <StreamCard streamer={stream} key={stream.streamName} />
                    ))
                )}
            </div>
        </div>
    )
}

export default hot(Main)