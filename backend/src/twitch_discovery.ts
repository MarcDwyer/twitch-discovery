
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
    intervalRandom: number;
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
const devTest = 60000
const fourHours = 60000 * 60 * 4,
    nextRefresh = () => new Date().getTime() + devTest,
    refreshTime = 30000

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.randomResults = null
    this.io = io
    this.methods = new TwitchMethods()
    this.nextRefresh = null
    this.intervalCopy = (func, dur) => setInterval(func, dur)
    this.payload = () => ({ streams: this.randomResults, nextRefresh: this.nextRefresh })

    this.intervalRandom = this.intervalCopy(async () => await this.populateRandom(), devTest)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
    
    this.refreshRandom = async () => {
        console.log('ref ran')
        const getData = await Promise.all(this.randomResults.map(async (stream) => await this.methods.fetchStreamData(stream)))
        this.randomResults = getData
        this.io.sockets.emit('updated-data', this.randomResults)
    }

    this.populateRandom = async () => {
        if(this.randomResults) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
        }
        const checkData = await this.methods.fetchRandomStreams()
        this.randomResults = structureData(checkData)
        this.nextRefresh = nextRefresh()
        this.io.sockets.emit('random-data', this.payload())
    }
}

export default TwitchDiscovery