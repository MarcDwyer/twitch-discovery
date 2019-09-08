
import { IStreamers } from './twitch_discovery'
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

async function fetchStreamData({ streamName, channelData }: IStreamers): Promise<IStreamers> {
    const url = `https://api.twitch.tv/kraken/streams/${channelData._id}`
    try {
        const data = await fetchTwitch(url)
        if (data['error']) throw new Error(`error at fetchstreamdata`)
        return {
            streamData: data.stream,
            streamName,
            channelData
        }
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


// `https://api.twitch.tv/kraken/streams/?limit=5&client_id=${process.env.TWITCH}`
async function fetchRandomStreams(totalOffset: number[]): Promise<Payload> {
    const [offset, total, pullPercent] = totalOffset
    const url = `https://api.twitch.tv/kraken/streams/?limit=10&offset=${offset}&language=en`
    try {
        const data = await fetchTwitch(url)
        return { streams: structureData(data.streams), online: data.streams, diagnostic: { total, offset, pullPercent } }
    } catch (err) {
        console.log(err)
    }
}


export default { fetchRandomStreams, fetchTotal, fetchStreamData, fetchTwitch }