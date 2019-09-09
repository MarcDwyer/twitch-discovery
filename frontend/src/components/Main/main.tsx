import React, { useEffect, useReducer, useRef, useCallback } from 'react'
import { BounceLoader } from 'react-spinners'
import { Channel, SubStream } from '../../data_types/data_types'
import { useSocket } from '../../hooks/hooks'

import {
    appReducer, APP_INIT, APP_UPDATE,
    featReducer, RESET_FEATURED, SET_FEATURED
} from '../../reducers/reducer'

import StreamCard from '../StreamCard/stream-card'
import Featured from '../Featured/featured'
import Navbar from '../Navbar/navbar'

import './main.scss'

export type Payload = {
    nextRefresh: number;
    streams: SubStream[];
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
type Featured = {
    stream: SubStream | null;
    index: number;
}
// Use channel data for channel info. Check stream key in streamData if null because streamers can go offline. 
// `${document.location.hostname}:5000`
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
        dispatchFeat({ type: SET_FEATURED, payload: { stream: appData.streams[value], index: value } })
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
                dispatchFeat({ type: RESET_FEATURED, payload: { stream: appData.streams[0], index: 0 } })
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
                    <div className="streamer-grid">
                        {Object.values(appData.streams).map((stream, i) => (
                            <StreamCard index={i} streamer={stream} key={stream._id} dispatchFeat={dispatchFeat} />
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