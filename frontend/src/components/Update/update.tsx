import React from 'react'

import './update.scss'

type Props = {
    closeUpdate(boolean): void
}

const Update = (props: Props) => {
    return (
        <div className="update">
            <div className="innerupdate">
                <span>App has been updated! Restart browser for new features.</span>
            </div>
            <button
            onClick={() => props.closeUpdate(true)}
            >Close</button>
        </div>
    )
}

export default Update