import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import io from 'socket.io-client'

const App: React.FC = () => {
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    if (!socket) {
      const socket1 = io(`${document.location.hostname}:5000`)
      socket1.on('connect', () => {
        socket1.on('random-data', (data: any) => {
          console.log(data)
        })
        socket1.on('updated-data', (data: any) => {
          console.log('updated', data)
        })
        socket1.on('next-refresh', (data: any) => {
          console.log('time', data)
        })
        socket1.on('request-error', (data: any) => {
          console.log('error', data)
        })
      })

      setSocket(socket1)
    }
  }, [socket])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
