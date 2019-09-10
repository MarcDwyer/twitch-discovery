import React, { useCallback } from 'react'
import { IStreamers, IDiag } from '../Main/main';
import { SET_FEATURED } from '../../reducers/reducer'
import { SubStream } from '../../data_types/data_types'
import { usePercentage } from '../../hooks/hooks'
import StreamCard from '../StreamCard/stream-card'

import './stream-grid.scss'
interface Props {
    streams: IStreamers[];
    diag: IDiag;
    dispatchFeat: Function;
}
const StreamerGrid = (props: Props) => {

    const updateFeatured = useCallback((streamData: SubStream, index: number) => {
        props.dispatchFeat({ type: SET_FEATURED, payload: { stream: streamData, index } })
    }, [props.streams])

    const top = usePercentage(props.diag.pullPercent)
    return (
        <React.Fragment>
            <h2>
                {`Top ${top} of streamers`}
        </h2>
            <div className="streamer-grid">
                {Object.values(props.streams).map((stream, i) => (
                    <StreamCard index={i} streamer={stream} key={stream.streamName} updateFeatured={updateFeatured} />
                ))}
            </div>
        </React.Fragment>
    )
}

export default StreamerGrid