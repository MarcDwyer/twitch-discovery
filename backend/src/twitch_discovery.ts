
import { Server } from 'socket.io'
import twitch from './twitch_methods'
import { Channel, SubStream } from './data_types/data_types'

export type Payload = {
    nextRefresh?: number;
    streams: SubStream[];
    diagnostic: Diag;
    online?: SubStream[];
}
type Diag = {
    offset: number;
    pullPercent: number;
    total: number;
}
export interface IStreamers {
    streamData: SubStream | null;
    streamName: string;
    channelData: Channel;
    id: number;
}

export type StructureStreams = {
    [key: string]: IStreamers;
}

export interface TwitchDisc {
    data: Payload | null;
    intervalPopulate: number;
    intervalRefresh: number;
    io: Server;
    pullPercentage: number;
    populateRandom(): void;
    intervalCopy(func: Function, dur: number): number;
    refreshRandom(): void;
    setNewStreams(data: SubStream[]): void;
    getOffset(total: number): number[];
}
const minutes = 60000,
    popTime = minutes * 47,
    refreshTime = minutes * 4,
    nextRefresh = () => new Date().getTime() + popTime

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.data = null
    this.io = io
    this.pullPercentage = 0
    this.intervalCopy = (func, dur) => setInterval(func, dur)

    this.intervalPopulate = this.intervalCopy(async () => await this.populateRandom(), popTime)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)

    this.refreshRandom = async () => {
        console.log('ref ran')
        const ids = this.data.streams.map(stream => stream.channel._id)
        const streams = await twitch.fetchStreamData(ids)
        this.data = { ...this.data, streams }
        this.io.sockets.emit('updated-data', this.data.streams)
    }

    this.populateRandom = async () => {
        if (this.data) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
        }
        const total = await twitch.fetchTotal()
        const checkData = await twitch.fetchRandomStreams(this.getOffset(total))
        this.data = { ...checkData, nextRefresh: nextRefresh() }
        this.io.sockets.emit('random-data', this.data)
    }

    this.getOffset = (total: number) => {
        if (this.pullPercentage >= .75) this.pullPercentage = 0
        const value = this.pullPercentage,
            offset = Math.floor(total * value)
        // best value to use - .00025
        this.pullPercentage = value + .0025
        return [offset, total, value]
    }
}

export default TwitchDiscovery