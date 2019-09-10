import express from 'express'
import http from 'http'
import ioSetup from 'socket.io'
import dotenv from 'dotenv'
import TwitchDiscovery, { TwitchDisc } from './twitch_discovery'


dotenv.config()

const app = express(),
    port = 5005,
    server = new http.Server(app),
    io = ioSetup(server);
(async () => {
    const streams: TwitchDisc = new TwitchDiscovery(io)
    await streams.populateRandom()
    io.on('connection', (socket) => socket.emit('random-data', streams.data))

    app.use('/test', (req, res) => res.send(JSON.stringify(streams.data)))
    server.listen(port)
})()