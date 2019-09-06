import React, { useEffect, useState } from 'react'
import { ITimer } from '../Navbar/navbar'
import './timer.scss'


interface Props {
    time: ITimer;
}


const Timer = (props: Props) => {
    const [time, waiting] = props.time
    return (
        <div className="timer-parent">
            {!waiting && time ? (
                <span>
                    {`Pulling new streamers in ${time.hours} hours ${time.minutes} minutes and ${time.seconds} seconds`}
                </span>
            ) : (
                    <span>
                        Fetching new streams...
                </span>
                )}
        </div>
    )
}


export default Timer