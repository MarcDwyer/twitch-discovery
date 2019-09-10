import React, { useEffect, useReducer, useRef, useCallback } from 'react'
import { BounceLoader } from 'react-spinners'
import { Channel, SubStream } from '../../data_types/data_types'
import { useSocket } from '../../hooks/hooks'

import {
    appReducer, APP_INIT, APP_UPDATE,
    featReducer, RESET_FEATURED, SET_FEATURED
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
type Featured = {
    stream: SubStream | null;
    index: number;
}
// TODO 
// Add more detail to the app
// Add viewing Top % of streams

const isDev = (): string => document.location.hostname.startsWith('local') ? `${document.location.hostname}:5005` : document.location.hostname

const Main = () => {
    const socket = useSocket(isDev())
    const [appData, dispatchApp] = useReducer(appReducer, null)
    const [featured, dispatchFeat] = useReducer(featReducer, { stream: null, index: 0 })

    const refreshRef = useRef<number | null>(null)

    const incFeatured = useCallback(() => {
        if (!appData) return
        let value = featured.index + 1
        if (!appData.streams[value]) value = 0
        dispatchFeat({ type: SET_FEATURED, payload: { stream: appData.online[value], index: value } })
    }, [appData, featured])

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                socket.on('random-data', (data: Payload) => dispatchApp({ type: APP_INIT, payload: data }))
                socket.on('updated-data', (data: SubStream[]) => dispatchApp({ type: APP_UPDATE, payload: data }))
            })
        }
    }, [socket])

    useEffect(() => {
        if (appData) {
            if (!featured.stream || refreshRef.current !== appData.nextRefresh) {
                dispatchFeat({ type: RESET_FEATURED, payload: { stream: appData.online[0], index: 0 } })
                refreshRef.current = appData.nextRefresh
            }
        }
    }, [appData])

    return (
        <div className="main">
            {appData && (
                <div className="loaded">
                    <Navbar appData={appData} />
                    {featured.stream && (
                        <Featured featured={featured.stream} incFeatured={incFeatured} />
                    )}
                    <StreamerGrid streams={appData.streams} dispatchFeat={dispatchFeat} diag={appData.diagnostic} />
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