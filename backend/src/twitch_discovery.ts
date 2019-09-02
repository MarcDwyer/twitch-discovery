
import { Server } from 'socket.io'
import * as twitch from './twitch_methods'
import { RandomStreamers, Channel, SubStream } from './data_types/data_types'

type Payload = {
    nextRefresh: number;
    streams: IStreamers[];
}
export interface IStreamers {
    stream: SubStream;
    streamName: string;
    channelData: Channel;
}

export interface TwitchDisc {
    data: Payload | null;
    intervalPopulate: number;
    intervalRefresh: number;
    io: Server;
    populateRandom(): void;
    intervalCopy(func: Function, dur: number): number;
    refreshRandom(): void;
}
const structureData = (data: RandomStreamers): IStreamers[] => {
    return data.streams.map(streamData => {
        return {
            stream: streamData,
            streamName: streamData.channel.name,
            channelData: streamData.channel
        }
    })
}
// const devTest = 60000
const popRandom = 60000 * 60 * 2,
    refresh = 60000 * 6,
    nextRefresh = () => new Date().getTime() + popRandom

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.data = null
    this.io = io
    this.intervalCopy = (func, dur) => setInterval(func, dur)
    // this.payload = () => ({ streams: this.randomResults, nextRefresh: this.nextRefresh })

    this.intervalPopulate = this.intervalCopy(async () => await this.populateRandom(), popRandom)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refresh)

    this.refreshRandom = async () => {
        console.log('ref ran')
        const getData = await Promise.all(this.data.streams.map(async (stream) => await twitch.fetchStreamData(stream)))
        this.data.streams = getData
        this.io.sockets.emit('updated-data', this.data.streams)
    }

    this.populateRandom = async () => {
        if (this.data) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refresh)
        }
        const checkData = await twitch.fetchRandomStreams()
        this.data = { streams: structureData(checkData), nextRefresh: nextRefresh() }
        this.io.sockets.emit('random-data', this.data)
    }
}

export default TwitchDiscovery