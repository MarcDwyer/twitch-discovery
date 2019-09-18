import React, { useEffect, useReducer, useState } from 'react'
import { BounceLoader } from 'react-spinners'
import { Channel, SubStream } from '../../data_types/data_types'

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

const isDev = (): string => document.location.hostname.startsWith('local') ? `ws://${document.location.hostname}:5010` : `wss://${document.location.hostname}`

const Main = () => {
    const [socket, setSocket] = useState<WebSocket>(new WebSocket(`${isDev()}/ws`))
    const [appData, dispatchApp] = useReducer(appReducer, null)

    useEffect(() => {
        socket.addEventListener('message', (payload: any) => {
            const data = JSON.parse(payload.data)
            if (!data['type']) {
                dispatchApp({ type: APP_INIT, payload: data })
                return
            }
            switch (data.type) {
                case "updated-data":
                    dispatchApp({ type: APP_UPDATE, payload: data })
            }
        })
    }, [])
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