import React, { useEffect, useReducer, useCallback } from 'react'
import { BounceLoader } from 'react-spinners'
import { Channel, SubStream } from '../../data_types/data_types'
import { useSocket } from '../../hooks/hooks';
import {
    appReducer, APP_INIT, APP_UPDATE, REMOVE_VIEW
} from '../../reducers/reducer'

import StreamerGrid from '../Streamer-Grid/stream-grid'
import Navbar from '../Navbar/navbar'
import ViewStream from '../View-Stream/view_stream'

import './main.scss'


export type Payload = {
    nextRefresh: number;
    streams: StructureStreams;
    diagnostic: IDiag;
    online: SubStream[];
    view: SubStream | null;
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

const isDev = (): string => document.location.hostname.startsWith('local') ? `ws://${document.location.hostname}:5010/ws` : `wss://${document.location.hostname}/ws`

const Main = () => {
    const socket = useSocket(isDev())
    const [appData, dispatchApp] = useReducer(appReducer, null)

    useEffect(() => {
        if (socket) {
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
        }
    }, [socket])

    const removeView = (e: KeyboardEvent) => {
        if (!appData || appData && !appData.view || e.keyCode !== 27) return
        dispatchApp({ type: REMOVE_VIEW, payload: null })
    }

    useEffect(() => {
        document.addEventListener('keydown', removeView)

        return function () {
            document.removeEventListener('keydown', removeView)
        }
    }, [appData])
    return (
        <div className="main">
            {appData && (
                <div className="loaded">
                    <Navbar appData={appData} view={appData.view} />
                    <StreamerGrid streams={appData.streams} dispatchApp={dispatchApp} diag={appData.diagnostic} />
                    <ViewStream stream={appData.view} dispatchApp={dispatchApp} />
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