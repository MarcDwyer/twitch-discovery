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

    app.post('/set-offset/', async (req, res) => {
        const { secret } = req.body
        if (!secret || secret && secret !== process.env.YEET || !req.body.offset) {
            res.status(401).send({ error: 'It is Forbidden' })
            return
        }
        const offset = parseFloat(req.body.offset)
        if (isNaN(offset)) {
            res.status(400).send({ error: "Offset is incorrect" })
            return
        }
        if (offset > 0.85) {
            res.status(400).send({ error: 'Offset too high' })
        } else {
            console.log({ offset, body: req.body })
            streams.settings = { ...streams.settings, offset }
            await streams.populateRandom(true)
            res.send({ Success: `Offset ${offset} now set` })
        }
    })

    server.listen(port)
})()