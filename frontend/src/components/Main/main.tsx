import React, { useEffect, useState, useCallback } from 'react'
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
    const [featured, setFeatured] = useState<SubStream | null>(null)
    const [key, setKey] = useState<number>(0)

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => setAppData(data))
            })
        }
    }, [socket])

    useEffect(() => {
        if (appData) {
            if (!featured) {
                const stream = appData.online[0]
                setFeatured(stream)
            }
        }
    }, [appData])

    useEffect(() => {
        if (featured && appData) {
            if (featured.channel.name === appData.online[key].channel.name) setKey(k => k + 1)
            setFeatured(appData.online[key])
        }
    }, [key])

    const incKey = useCallback(() => {
        if (!appData) return
        setKey(k => {
            if (!appData.online[k + 1]) {
                return 0
            } else {
                return k + 1
            }
        })
    }, [appData, key])
    return (
        <div className="main">
            {appData && (
                <div className="loaded">
                    <Navbar appData={appData} />
                    {featured && (
                        <Featured featured={featured} incKey={incKey} />
                    )}
                    <div className="streamer-grid">
                        {Object.values(appData.streams).map(stream => (
                            <StreamCard streamer={stream} key={stream.streamName} setFeatured={setFeatured} />
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