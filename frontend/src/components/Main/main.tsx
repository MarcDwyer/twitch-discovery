import React, { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { BounceLoader } from 'react-spinners'

import { Channel, SubStream } from '../../data_types/data_types'
import StreamCard from '../StreamCard/stream-card'
import Featured from '../Featured/featured'
import Navbar from '../Navbar/navbar'
import './main.scss'

export type Payload = {
    nextRefresh: number;
    streams: StructureStreams;
    diagnostic: IDiag;
}
export type IStreamers = {
    streamData: SubStream | null;
    streamName: string;
    channelData: Channel;
}
export type StructureStreams = {
    [key: string]: IStreamers;
}
export type IDiag = {
    offset: number;
    total: number;
}
// Use channel data for channel info. Check stream key in streamData if null because streamers can go offline. 
// `${document.location.hostname}:5000`
const isDev = (): string => document.location.hostname.startsWith('local') ? `${document.location.hostname}:5005` : document.location.hostname
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
    const socket = useSocket(isDev())
    const [appData, setAppData] = useState<Payload | null>(null)
    const dataRef = useRef<Payload | null>(null)

    const updateData = (refresh: StructureStreams) => {
        if (!dataRef.current) return
        dataRef.current.streams = refresh
        const shallow = { ...dataRef.current }
        setAppData(shallow)
    }

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => {
                    console.log(data)
                    setAppData(data)
                })
                socket.on('updated-data', (data: StructureStreams) => updateData(data))
                socket.on('request-error', (data: any) => {
                    console.log('error', data)

                })
            })
        }
    }, [socket])

    useEffect(() => {
        if (!appData) return
        dataRef.current = appData
    }, [appData])

    console.log(appData)
    return (
        <div className="main">
            { appData && (
                <div className="loaded">
                    <Navbar appData={appData} />
                    <Featured data={appData} />
                    <div className="streamer-grid">
                        {Object.values(appData.streams).map(stream => (
                            <StreamCard streamer={stream} key={stream.streamName} />
                        ))}
                    </div>
                </div>
            )}
{
!appData && (
    <div className="no-data">
        <h1>Looking for streams...</h1>
        <BounceLoader
            color="#eee"
        />
    </div>
)
}
        </div >
    )
}

export default Main