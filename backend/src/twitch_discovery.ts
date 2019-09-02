
import { Server } from 'socket.io'
import TwitchMethods, { ITwitchMethods } from './twitch_methods'
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
    randomResults: IStreamers[] | null;
    intervalPopulate: number;
    intervalRefresh: number;
    io: Server;
    methods: ITwitchMethods;
    nextRefresh: number | null;
    populateRandom(): void;
    intervalCopy(func: Function, dur: number): number;
    refreshRandom(): void;
    results(): void;
    broadcastTime(): void;
    payload(): Payload;
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
const popRandom = 60000 * 60 * 4,
    refresh = 60000 * 5,
    nextRefresh = () => new Date().getTime() + popRandom

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.randomResults = null
    this.nextRefresh = null
    this.io = io
    this.methods = new TwitchMethods()
    this.intervalCopy = (func, dur) => setInterval(func, dur)
    this.payload = () => ({ streams: this.randomResults, nextRefresh: this.nextRefresh })

    this.intervalPopulate = this.intervalCopy(async () => await this.populateRandom(), popRandom)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refresh)

    this.refreshRandom = async () => {
        console.log('ref ran')
        const getData = await Promise.all(this.randomResults.map(async (stream) => await this.methods.fetchStreamData(stream)))
        this.randomResults = getData
        this.io.sockets.emit('updated-data', this.randomResults)
    }

    this.populateRandom = async () => {
        if (this.randomResults) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refresh)
        }
        const checkData = await this.methods.fetchRandomStreams()
        this.randomResults = structureData(checkData)
        this.nextRefresh = nextRefresh()
        this.io.sockets.emit('random-data', this.payload())
    }
}

export default TwitchDiscovery