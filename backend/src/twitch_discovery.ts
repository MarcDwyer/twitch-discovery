
import { Server } from 'socket.io'
import twitch from './twitch_methods'
import { Channel, SubStream } from './data_types/data_types'
import { structureLiveData } from './structure_data'

export type Payload = {
    nextRefresh?: number;
    streams: StructureStreams;
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
    id?: number;
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
// const devTest = 60000
const minutes = 60000,
    popTime = minutes * 33, // 44,
    refreshTime = minutes * 5,
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
        const streams = Object.values(this.data.streams)
        const newStreams = await Promise.all(streams.map(async (stream) => await twitch.fetchStreamData(stream)))
        const online = newStreams.filter(stream => stream.streamData).map(stream => stream.streamData)
        this.data = {...this.data, streams: structureLiveData(newStreams), online}
        this.io.sockets.emit('random-data', this.data)
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