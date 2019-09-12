
import { Server } from 'socket.io'
import twitch from './twitch_methods'
import { Channel, SubStream } from './data_types/data_types'
import Timer, { ITimer } from './timers'

export type Payload = {
    nextRefresh?: number;
    streams: IStreamers[];
    diagnostic: Diag;
    online: SubStream[];
}
type Diag = {
    skippedOver: number;
    offset: number;
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
type Settings = {
    offset: number;
    popTime: number;
    refreshTime: number;
}
export interface TwitchDisc {
    data: Payload | null;
    intervalPopulate: ITimer;
    intervalRefresh: ITimer;
    io: Server;
    settings: Settings;
    nextRefresh(): number;
    populateRandom(param?: boolean): void;
    refreshRandom(): void;
    setNewStreams(data: SubStream[]): void;
    getOffset(total: number): number[];

}
const minutes = 60000

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.data = null
    this.io = io
    this.settings = {
        offset: 0,
        popTime: minutes * 38,
        refreshTime: minutes * 6
    }

    this.nextRefresh = () => new Date().getTime() + this.settings.popTime

    this.intervalPopulate = new Timer(async () => await this.populateRandom(), this.settings.popTime)
    this.intervalRefresh = new Timer(async () => await this.refreshRandom(), this.settings.refreshTime)

    this.refreshRandom = async () => {
        console.log(`Refresh ran on ${new Date()}`)
        const streams = await Promise.all(this.data.streams.map(async (stream) => await twitch.fetchStreamData(stream)))
        const online = streams.filter(stream => stream.streamData).map(stream => stream.streamData)
        this.data = { ...this.data, streams, online }
        this.io.sockets.emit('updated-data', { streams, online })
    }

    this.populateRandom = async (update) => {
        console.log(`Populate random has run on: ${new Date()}`)
        if (this.data) {
            this.intervalRefresh.reset(this.settings.refreshTime)
            if (update) {
                this.intervalPopulate.reset(this.settings.popTime)
            }
        }
        const total = await twitch.fetchTotal()
        const streamData = await twitch.fetchRandomStreams(this.getOffset(total))
        this.data = { ...streamData, nextRefresh: this.nextRefresh() }
        this.io.sockets.emit('random-data', this.data)
    }

    this.getOffset = (total: number) => {
        let offset = this.settings.offset
        if (offset >= .85) offset = 0
        const skippedOver = Math.floor(total * offset)
        this.settings.offset = offset + .0025
        return [skippedOver, total, offset]
    }
}

export default TwitchDiscovery