
import fetch from 'node-fetch'
import { Payload } from './twitch_discovery'
import { structureData } from './structure_data'
import { SubStream } from './data_types/data_types'

type IData = {
    _total?: number;
    streams?: SubStream[];
    stream?: SubStream;
}

async function fetchTwitch(url: string): Promise<IData> {
    try {
        const fetchThis = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.twitchtv.v5+json',
                'Client-ID': process.env.TWITCH
            }
        })
        const data = await fetchThis.json()
        return data
    } catch (err) {
        console.log(err)
    }
}

async function fetchStreamData(ids: number[]): Promise<SubStream[]> {
    const url = `https://api.twitch.tv/kraken/streams/?channel=${ids.join(',')}`
    try {
        const data = await fetchTwitch(url)
        if (data['error']) throw new Error(`error at fetchstreamdata`)
        return data.streams.filter(stream => stream)
    } catch (err) {
        console.log(err)
    }
}

async function fetchTotal(): Promise<number> {
    const url = `https://api.twitch.tv/kraken/streams/?limit=1&language=en`
    try {
        const data = await fetchTwitch(url)
        return data._total
    } catch (err) {
        return 2000
    }
}

async function fetchRandomStreams(totalOffset: number[]): Promise<Payload> {
    const [skippedOver, total, offset] = totalOffset
    const url = `https://api.twitch.tv/kraken/streams/?limit=10&offset=${skippedOver}&language=en`
    try {
        const data = await fetchTwitch(url)

        return { streams: data.streams, diagnostic: { skippedOver, offset, total } }
    } catch (err) {
        console.log(err)
    }
}


export default { fetchRandomStreams, fetchTotal, fetchStreamData, fetchTwitch }