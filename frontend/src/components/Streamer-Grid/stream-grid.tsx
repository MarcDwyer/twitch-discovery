import React, { useCallback } from 'react'
import { IDiag, IStreamers } from '../Main/main';
import { SET_FEATURED } from '../../reducers/reducer'
import { usePercentage } from '../../hooks/hooks'
import StreamCard from '../StreamCard/stream-card'

import './stream-grid.scss'
import { SubStream } from '../../data_types/data_types';

interface Props {
    streams: IStreamers[];
    diag: IDiag;
    dispatchApp: Function;
}
const StreamerGrid = (props: Props) => {

    const updateFeatured = useCallback((payload: SubStream) => {
        props.dispatchApp({ type: SET_FEATURED, payload })
    }, [props.streams])

    const top = usePercentage(props.diag.offset)

    return (
        <React.Fragment>
            <h2>
                {`Top ${top} of streamers`}
            </h2>
            <div className="streamer-grid">
                {props.streams.map((stream, i) => (
                    <StreamCard streamer={stream} key={stream.id} updateFeatured={updateFeatured} />
                ))}
            </div>
        </React.Fragment>
    )
}

export default StreamerGrid