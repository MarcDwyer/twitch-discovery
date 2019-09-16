import express from 'express'
import http from 'http'
import ioSetup from 'socket.io'
import dotenv from 'dotenv'
import TwitchDiscovery, { TwitchDisc } from './twitch_discovery'
import { handleOffset } from './offset-change'

import bodyParser from 'body-parser'
import cors from 'cors'


dotenv.config()

const app = express(),
    port = 5005,
    server = new http.Server(app),
    io = ioSetup(server);

app.use(bodyParser.json());
app.use(cors());

(async () => {
    const streams: TwitchDisc = new TwitchDiscovery(io)
    await streams.populateRandom()

    io.on('connection', (socket) => socket.emit('init-data', streams.data))

    app.use('/test', (req, res) => res.send(JSON.stringify(streams.data)))

    app.post('/set-offset/', async (req, res) => handleOffset(req, res, streams))

    server.listen(port)
})()