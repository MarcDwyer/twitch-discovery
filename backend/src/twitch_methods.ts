
import { RandomStreamers } from './data_types/data_types'
import { IStreamers } from './twitch_discovery'
import fetch from 'node-fetch'

export interface ITwitchMethods {
    getStreamData(param: IStreamers): IStreamers;
    fetchRandomStreams(): Promise<RandomStreamers>;
}

function TwitchMethods(this: ITwitchMethods) {}

TwitchMethods.prototype.getStreamData = async function (this: ITwitchMethods, {streamName, channelData}: IStreamers) {
    const url = `https://api.twitch.tv/kraken/streams/${streamName}?client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return {
            stream: data,
            channelData,
            streamName
        }
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