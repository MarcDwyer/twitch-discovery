
import { Server } from 'socket.io'
import * as twitch from './twitch_methods'
import { Channel, SubStream } from './data_types/data_types'
import { structureLiveData } from './structure_data'

export type Payload = {
    nextRefresh?: number;
    streams: StructureStreams;
    diagnostic: Diag;
}
type Diag = {
    offset: number;
    total: number;
}
export interface IStreamers {
    streamData: SubStream;
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
    populateRandom(): void;
    intervalCopy(func: Function, dur: number): number;
    refreshRandom(): void;
}
// const devTest = 60000
const minutes = 60000,
    popTime = 45000,
    refreshTime = 15000,
    nextRefresh = () => new Date().getTime() + popTime

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.data = null
    this.io = io
    this.intervalCopy = (func, dur) => setInterval(func, dur)

    this.intervalPopulate = this.intervalCopy(async () => await this.populateRandom(), popTime)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)

    this.refreshRandom = async () => {
        console.log('ref ran')
        const getData = await Promise.all(Object.values(this.data.streams).map(async (stream) => await twitch.fetchStreamData(stream)))
        this.data.streams = structureLiveData(getData)
        this.io.sockets.emit('updated-data', this.data.streams)
    }

    this.populateRandom = async () => {
        if (this.data) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
        }
        const checkData = await twitch.fetchRandomStreams()
        this.data = { ...checkData, nextRefresh: nextRefresh() }
        this.io.sockets.emit('random-data', this.data)
    }
}

export default TwitchDiscovery