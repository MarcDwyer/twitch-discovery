
import { Server } from 'socket.io'
import TwitchMethods, { ITwitchMethods } from './twitch_methods'
import { RandomStreamers, Stream, Channel } from './data_types/data_types'

type Payload = {
    nextRefresh: number;
    streams: IStreamers;
}
type IStreamers = {
    [key: string]: {
        stream: Stream;
        streamName: string;
        channelData: Channel;
    };
}
export interface TwitchDisc {
    randomResults: IStreamers | null;
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

const structureData = (data: RandomStreamers): IStreamers => {
    return data.streams.reduce((obj, item) => {
        const newItem = { stream: item, channelData: item.channel, streamName: item.channel.display_name.toLowerCase() }
        obj[item.channel.display_name] = newItem
        return obj
    }, {})

}
const diff = (newData: Stream[], oldData: IStreamers): IStreamers => {
    for (let x = 0; x < newData.length; x++) {
        const sItem = newData[x],
            key = sItem.streamName
        if (oldData[key].stream && !sItem.stream) {
            oldData[key].stream = null
        }
    }
    return oldData
}
const fourHours = 60 * 60 * 60 * 4,
    nextRefresh = () => new Date().getTime() + fourHours,
    refreshTime = 60000

function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.randomResults = null
    this.io = io
    this.methods = new TwitchMethods()
    this.nextRefresh = null
    this.intervalCopy = (func, dur) => setInterval(func, dur)
    this.payload = () => ({ streams: this.randomResults, nextRefresh: this.nextRefresh })

    this.intervalRandom = this.intervalCopy(async () => await this.populateRandom(), fourHours)
    this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
    
    this.refreshRandom = async () => {
        console.log('ref ran')
        const names = Object.keys(this.randomResults)

        const getData = await Promise.all(names.map(async (name) => await this.methods.getStreamData(name)))
        const result = diff(getData, this.randomResults)
        this.randomResults = result
        this.io.sockets.emit('updated-data', this.randomResults)
    }

    this.populateRandom = async () => {
        if(this.randomResults) {
            clearInterval(this.intervalRefresh)
            this.intervalRefresh = this.intervalCopy(async () => await this.refreshRandom(), refreshTime)
        }
        const checkData = await this.methods.fetchRandomStreams()
        if (checkData['error']) {
            console.log(checkData)
            return
        }
        this.randomResults = structureData(checkData)
        this.nextRefresh = nextRefresh()
        this.io.sockets.emit('random-data', this.payload())
    }
}

export default TwitchDiscovery