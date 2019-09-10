import express from 'express'
import http from 'http'
import ioSetup from 'socket.io'
import dotenv from 'dotenv'
import TwitchDiscovery, { TwitchDisc } from './twitch_discovery'
import bodyParser from 'body-parser'


dotenv.config()

const app = express(),
    port = 5005,
    server = new http.Server(app),
    io = ioSetup(server);

app.use(bodyParser.json());

(async () => {
    const streams: TwitchDisc = new TwitchDiscovery(io)
    await streams.populateRandom()
    io.on('connection', (socket) => socket.emit('random-data', streams.data))

    app.use('/test', (req, res) => res.send(JSON.stringify(streams.data)))
    app.post('/set-offset', async (req, res) => {
        const { offset, secret } = req.body
        if (!offset || !secret) {
            res.send({ error: 'Two parameters are required' })
            return
        }
        if (secret === process.env.YEET) {
            if (offset < 0.85) {
                streams.pullPercentage = offset
                await streams.populateRandom()
                res.send({ success: 'Success!' })
            } else {
                res.send({ error: 'offset must be a float' })
            }
        }
    })
    server.listen(port)
})()