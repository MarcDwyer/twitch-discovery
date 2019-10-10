import React, { useCallback } from 'react'
import { IDiag } from '../Main/main';
import { SET_VIEW } from '../../reducers/reducer'
import { usePercentage } from '../../hooks/hooks'
import StreamCard from '../StreamCard/stream-card'

import './stream-grid.scss'

import { SubStream, ParentData } from '../../data_types/data_types';

interface Props {
    streams: ParentData;
    diag: IDiag;
    dispatchApp: Function;
}
const StreamerGrid = (props: Props) => {
    const updateFeatured = useCallback((payload: SubStream) => {
        props.dispatchApp({ type: SET_VIEW, payload })
    }, [props.streams])

    const top = usePercentage(props.diag.offset)
    const streams = Object.values(props.streams)
    return (
        <div className="grid-parent">
            <h1>
                {`Top ${top} of streamers`}
            </h1>
            <div className="streamer-grid">
                {streams.map((stream) => (
                    <StreamCard streamer={stream} key={stream.id} updateFeatured={updateFeatured} />
                ))}
            </div>
        </div>
    )
}

export default StreamerGrid