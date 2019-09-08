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
    online: SubStream[];
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
    pullPercent: number;
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
    const [ifeatured, setFeatured] = useState<number | null>(null)

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => setAppData(data))
            })
        }
    }, [socket])

    useEffect(() => {
        if (!appData) return
        if (ifeatured === null) {
            setFeatured(0)
        }
    }, [appData])
    const getFeatured = (name: string) => {
        if (!appData) return
        for (let x = 0, len = appData.online.length; x < len; x++) {
            const stream = appData.online[x]
            if (stream.channel.name === name) {
                setFeatured(x)
                break
            }
        }
    }
    return (
        <div className="main">
            {appData && (
                <div className="loaded">
                    <Navbar appData={appData} />
                    {ifeatured !== null && appData.online[ifeatured] && (
                        <Featured appData={appData} ifeatured={ifeatured} setFeatured={setFeatured} />
                    )}
                    <div className="streamer-grid">
                        {Object.values(appData.streams).map(stream => (
                            <StreamCard streamer={stream} key={stream.streamName} getFeatured={getFeatured} />
                        ))}
                    </div>
                </div>
            )}
            {!appData && (
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