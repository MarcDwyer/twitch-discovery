import React from 'react'
import { ITimer } from '../../hooks/hooks'

import './timer.scss'


interface Props {
    time: ITimer;
}

const Timer = (props: Props) => {
    const [time, waiting] = props.time
    return (
        <div className="timer-parent">
            {time && (
                <React.Fragment>
                    {!waiting ? (
                        <span>
                            {`Next update in ${time.minutes} ${time.minutes <  2 ? 'minute' : 'minutes'}`}
                        </span>
                    ) : (
                            <span>
                                Fetching new streams...
                    </span>
                        )}
                </React.Fragment>
            )}
        </div>
    )
}


export default Timer