
import { RandomStreamers } from './data_types/data_types'
import { IStreamers } from './twitch_discovery'
import fetch from 'node-fetch'

export async function fetchStreamData({ streamName, channelData }: IStreamers): Promise<IStreamers> {
    const url = `https://api.twitch.tv/kraken/streams/${streamName}?client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
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
    const url = `https://api.twitch.tv/kraken/streams/?limit=1&language=en&client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return data._total
    } catch (err) {
        return .5
    }
}


// `https://api.twitch.tv/kraken/streams/?limit=5&client_id=${process.env.TWITCH}`
export async function fetchRandomStreams(): Promise<RandomStreamers> {
    const offsetVal = await fetchOffset()   
    console.log(offsetVal)
    const url = `https://api.twitch.tv/kraken/streams/?limit=15&offset=${Math.floor(offsetVal * Math.random())}&language=en&client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return data
    } catch (err) {
        console.log(err)
    }
}