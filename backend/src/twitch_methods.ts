
import { RandomStreamers, Stream } from './data_types/data_types'
import fetch from 'node-fetch'

export interface ITwitchMethods {
    getStreamData(name: string): Stream;
    fetchRandomStreams(): Promise<RandomStreamers>;
}

function TwitchMethods(this: ITwitchMethods) {}

TwitchMethods.prototype.getStreamData = async function (this: ITwitchMethods, name: string) {
    const url = `https://api.twitch.tv/kraken/streams/${name}?client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
            data['streamName'] = name
        return data
    } catch (err) {
        return { error: 'Error fetching stream data' }
    }
}

TwitchMethods.prototype.fetchRandomStreams = async function (this: ITwitchMethods) {
    const url = `https://api.twitch.tv/kraken/streams/?limit=5&client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return data
    } catch (err) {
        return { error: 'Error fetching data' }
    }
}

export default TwitchMethods