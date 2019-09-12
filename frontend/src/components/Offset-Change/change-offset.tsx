import React, { useState } from 'react'
import { animated, useSpring } from 'react-spring'
import { RouteComponentProps } from 'react-router-dom'
import './change-offset.scss'
import { Link } from 'react-router-dom';


const URL = () => document.location.hostname.startsWith('localhost') ? 'http://localhost:5005' : `https://${document.location.hostname}`

const ChangeOffset = (props: RouteComponentProps) => {
    const [secret, setSecret] = useState<string>('')
    const [offset, setOffset] = useState<string>('')
    const [count, setCount] = useState<number>(0)

    const offsetAnim = useSpring({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(100%)' }
    })
    return (
        <animated.div className="offset" style={offsetAnim}>
            {count <= 3 && (
                <form
                    className="inner-offset"
                    onSubmit={async (e) => {
                        e.preventDefault()
                        if (offset.length < 1 || secret.length < 1 || isNaN(parseFloat(offset))) {
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
                    <span>{count}</span>
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
            )}
            <Link to="/">
                Go back
                </Link>
        </animated.div>
    )
}

export default ChangeOffset