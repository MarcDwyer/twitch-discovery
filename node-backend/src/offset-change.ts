import { TwitchDisc } from "./twitch_discovery";
import { Dictionary, Request, Response } from "express-serve-static-core";
// Request<Dictionary<string>>

export const handleOffset = async (req: Request<Dictionary<string>>, res: Response, streams: TwitchDisc) => {
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
        streams.settings = { ...streams.settings, offset }
        await streams.populateRandom(true)
        res.send({ success: `Offset ${offset} now set` })
    }
}