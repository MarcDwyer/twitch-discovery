
import { IStreamers } from './twitch_discovery'
import fetch from 'node-fetch'
import { Payload } from './twitch_discovery'
import { structureData } from './structure_data'
import { SubStream } from './data_types/data_types'

type IData = {
    _total: number;
    streams: SubStream[];
    stream: SubStream;
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
    } catch(err) {
        console.log(err)
    }
}

export async function fetchStreamData({ streamName, channelData }: IStreamers): Promise<IStreamers> {
    const url = `https://api.twitch.tv/kraken/streams/${streamName}`
    try {
        const data = await fetchTwitch(url)
        if (data['error']) throw new Error('TWITCH Api error')
        return {
            streamData: data.stream,
            channelData,
            streamName
        }
    } catch (err) {
        console.log(err)
    }
}

async function fetchOffset(): Promise<number> {
    const url = `https://api.twitch.tv/kraken/streams/?limit=1&language=en`
    try {
        const fetchData = await fetchTwitch(url)
        return fetchData._total
    } catch (err) {
        return 2000
    }
}


// `https://api.twitch.tv/kraken/streams/?limit=5&client_id=${process.env.TWITCH}`
 export async function fetchRandomStreams(): Promise<Payload> {
    const total = await fetchOffset(),
        offset = Math.random()
    const url = `https://api.twitch.tv/kraken/streams/?limit=15&offset=${Math.floor(total * offset)}&language=en`
    try {
        const data = await fetchTwitch(url)
        return { streams: structureData(data.streams), diagnostic: { total, offset } }
    } catch (err) {
        console.log(err)
    }
}
