import React, { useCallback } from 'react'
import { IDiag, Featured } from '../Main/main';
import { SET_FEATURED } from '../../reducers/reducer'
import { SubStream } from '../../data_types/data_types'
import { usePercentage } from '../../hooks/hooks'
import StreamCard from '../StreamCard/stream-card'

import './stream-grid.scss'
interface Props {
    streams: SubStream[];
    diag: IDiag;
    dispatchApp: Function;
}
const StreamerGrid = (props: Props) => {

    const updateFeatured = useCallback((payload: Featured) => {
        props.dispatchApp({ type: SET_FEATURED, payload })
    }, [props.streams])

    const top = usePercentage(props.diag.pullPercent)
    return (
        <React.Fragment>
            <h2>
                {`Top ${top} of streamers`}
            </h2>
            <div className="streamer-grid">
                {Object.values(props.streams).map((stream, i) => (
                    <StreamCard index={i} streamer={stream} key={stream._id} updateFeatured={updateFeatured} />
                ))}
            </div>
        </React.Fragment>
    )
}

export default StreamerGrid