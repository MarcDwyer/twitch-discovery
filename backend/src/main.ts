import express from 'express'
import http from 'http'
import ioSetup from 'socket.io'

import TwitchDiscovery, { TwitchDisc } from './twitch_discovery'

const app = express(),
    port = 5000,
    server = new http.Server(app),
    io = ioSetup(server);
// TODO 
(async () => {
    console.log('unused variables')
    const streams: TwitchDisc = new TwitchDiscovery(io)
    await streams.populateRandom()

    io.on('connection', (socket) => {
        console.log('socket connected...')
        socket.emit('random-data', streams.randomResults)
        //  socket.send('connect', (socket) => socket.send(streamers.Results))
    })

    app.use('/test', (req, res) => res.send(JSON.stringify(streams.randomResults)))

    server.listen(port)
})()