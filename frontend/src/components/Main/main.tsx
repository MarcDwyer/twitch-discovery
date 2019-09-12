import React, { useEffect, useReducer } from 'react'
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

const isDev = (): string => document.location.hostname.startsWith('local') ? `${document.location.hostname}:5005` : document.location.hostname

const Main = () => {
    const socket = useSocket(isDev())
    const [appData, dispatchApp] = useReducer(appReducer, null)

    useEffect(() => {
        if (socket) {
            console.log('this ran')
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => dispatchApp({ type: APP_INIT, payload: data }))
                socket.on('updated-data', (data: SubStream[]) => dispatchApp({ type: APP_UPDATE, payload: data }))
            })
        }
    }, [socket])

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