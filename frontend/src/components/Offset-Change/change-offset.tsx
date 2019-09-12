import React, { useState, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'

import './change-offset.scss'

type Props = {
    showOffset: boolean;
    setShowOffset(param: boolean): void;
}

const URL = () => document.location.hostname.startsWith('localhost') ? 'http://localhost:5005' : `https://${document.location.hostname}`

const ChangeOffset = React.memo((props: Props) => {
    const [secret, setSecret] = useState<string>('')
    const [offset, setOffset] = useState<string>('')
    const [count, setCount] = useState<number>(0)

    const offsetAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(100%)' },
        reverse: !props.showOffset
    })
    useEffect(() => {
        if (count >= 3) {
            props.setShowOffset(false)
        }
    }, [count])
    return (
        <animated.div className="offset" style={offsetAnim}>
            <form
                className="inner-offset"
                onSubmit={async (e) => {
                    e.preventDefault()
                    if (offset.length < 1 || secret.length < 1 || isNaN(parseFloat(offset)) || count >= 3) {
                        setCount(count + 1)
                        return
                    } else {
                        const payload = {
                            secret,
                            offset
                        }
                        const sendThis = await fetch(`${URL()}/set-offset/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                        const res = await sendThis.json()
                        if (res['error'] || !sendThis.ok) {
                            setCount(count + 1)
                            return
                        } else {
                            console.log('cool story bro')
                        }
                    }
                }}
            >
                <input
                    value={offset}
                    placeholder="It gives a number..."
                    onChange={(e) => setOffset(e.target.value)}
                />
                <input
                    value={secret}
                    placeholder="It gives a riddle..."
                    onChange={(e) => setSecret(e.target.value)}
                />
                <button type='submit'>
                    Try
                    </button>
            </form>
            <button
                className="go-back"
                onClick={() => props.setShowOffset(false)}
            >
                Go back
                </button>
        </animated.div>
    )
})

export default ChangeOffset