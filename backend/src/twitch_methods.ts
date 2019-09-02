
import { RandomStreamers } from './data_types/data_types'
import { IStreamers } from './twitch_discovery'
import fetch from 'node-fetch'

export interface ITwitchMethods {
    fetchStreamData(param: IStreamers): IStreamers;
    fetchRandomStreams(): Promise<RandomStreamers>;
    fetchOffset(): Promise<number>;
}

function TwitchMethods(this: ITwitchMethods) { }

TwitchMethods.prototype.fetchStreamData = async function (this: ITwitchMethods, { streamName, channelData }: IStreamers) {
    const url = `https://api.twitch.tv/kraken/streams/${streamName}?client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return {
            stream: data.stream,
            channelData,
            streamName
        }
    } catch (err) {
        return { error: 'Error fetching stream data' }
    }
}
// `https://api.twitch.tv/kraken/streams/?limit=5&client_id=${process.env.TWITCH}`
TwitchMethods.prototype.fetchRandomStreams = async function (this: ITwitchMethods) {
    const offsetVal = await this.fetchOffset()
    const url = `https://api.twitch.tv/kraken/streams/?limit=15&offset=${Math.floor(offsetVal * .33)}&language=en&client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return data
    } catch (err) {
        return { error: 'Error fetching data' }
    }
}

TwitchMethods.prototype.fetchOffset = async function (this: ITwitchMethods) {
    const url = `https://api.twitch.tv/kraken/streams/?limit=1&language=en&client_id=${process.env.TWITCH}`
    try {
        const fetchData = await fetch(url),
            data = await fetchData.json()
        return data._total
    } catch (err) {
        return { error: 'Error fetching data' }
    }
}
export default TwitchMethods