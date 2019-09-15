import React, { useEffect, useReducer, useState } from 'react'
import { BounceLoader } from 'react-spinners'
import { Channel, SubStream } from '../../data_types/data_types'
import { useSocket } from '../../hooks/hooks'

import {
    appReducer, APP_INIT, APP_UPDATE
} from '../../reducers/reducer'

import StreamerGrid from '../Streamer-Grid/stream-grid'
import Featured from '../Featured/featured'
import Navbar from '../Navbar/navbar'


import './main.scss'

export type Payload = {
    nextRefresh: number;
    streams: IStreamers[];
    diagnostic: IDiag;
    online: SubStream[];
    featured: Featured;
}
export type IStreamers = {
    streamData: SubStream | null;
    streamName: string;
    channelData: Channel;
    id: number;
}
export type StructureStreams = {
    [key: string]: IStreamers;
}
export type IDiag = {
    offset: number;
    total: number;
    skippedOver: number;
}
export type Featured = {
    stream: SubStream | null;
    index: number;
}

const isDev = (): string => document.location.hostname.startsWith('local') ? `${document.location.hostname}:5010` : document.location.hostname

const Main = () => {
    const [socket, setSocker] = useState<WebSocket>(new WebSocket(`ws://${document.location.hostname}:5010/ws`))
    const [appData, dispatchApp] = useReducer(appReducer, null)

    useEffect(() => {
        socket.addEventListener('message', (msg: any) => {
            const parsed = JSON.parse(msg.data)
            console.log(parsed)
            switch (parsed.type) {
                case "init-data":
                    console.log('huh')
                    dispatchApp({ type: APP_INIT, payload: parsed.data })
            }
        })
    }, [socket])
    console.log(appData)
    return (
        <div className="main">
            {appData && (
                <div className="loaded">
                    <Navbar appData={appData} />
                    {appData.featured.stream && (
                        <Featured featured={appData.featured.stream} dispatchApp={dispatchApp} />
                    )}
                    <StreamerGrid streams={appData.streams} dispatchApp={dispatchApp} diag={appData.diagnostic} />
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