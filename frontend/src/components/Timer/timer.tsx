import React from 'react'
import { useTimer } from '../../hooks/hooks'

import './timer.scss'


interface Props {
    nextRefresh: number;
}

const Timer = (props: Props) => {
    const [timer, waiting] = useTimer(props.nextRefresh)

    console.log({timer, waiting})
    return (
        <div className="timer-parent">
            {timer && (
                <React.Fragment>
                    {!waiting ? (
                        <span>
                            {`Next update in ${timer.minutes} ${timer.minutes <  2 ? 'minute' : 'minutes'} and ${timer.seconds} seconds`}
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