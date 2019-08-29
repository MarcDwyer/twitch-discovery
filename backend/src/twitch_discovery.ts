
import { Server } from 'socket.io'
import TwitchMethods, { ITwitchMethods } from './twitch_methods'
import { RandomStreamers, Stream, Channel } from './data_types/data_types'

type IStreamers = {
    [key: string]: {
        stream: Stream;
        channelData: Channel;
    };
}
export interface TwitchDisc {
    randomResults: IStreamers | null;
    intervalRandom: NodeJS.Timeout;
    intervalRefresh: NodeJS.Timeout;
    io: Server;
    methods: ITwitchMethods;
    populateRandom(): void;
    intervalCopy(func: Function, dur: number): NodeJS.Timeout;
    refreshRandom(): void;
}
const structureData = (data: RandomStreamers): IStreamers => {
    return data.streams.reduce((obj, item) => {
        const newItem = {stream: item, channelData: item.channel}
        obj[item.channel.display_name] = newItem
        return obj
    }, {})
}
const diff = (newData: Stream[], oldData: IStreamers): IStreamers => {
    for (let x = 0; x < newData.length; x++) {
        const sItem = newData[x],
            key = sItem.stream.channel.display_name
            console.log({sItem, key})
        if (oldData[key].stream && !sItem.stream) {
            oldData[key].stream = null
        }
    }
    return oldData
}
function TwitchDiscovery(this: TwitchDisc, io: Server) {
    this.randomResults = null
    this.io = io
    this.methods = new TwitchMethods()
    this.intervalCopy = (func, dur) => setInterval(async () => await func(), dur)

    this.populateRandom = async () => {
        console.log('populate random is running....')
        const checkData = await this.methods.fetchRandomStreams()
        if (checkData['error']) {
            console.log(checkData)
            return
        }
        this.randomResults = structureData(checkData)
        console.log(this.randomResults)
        this.io.sockets.emit('random-data', this.randomResults)
    }
    this.refreshRandom = async () => {
        const names = Object.keys(this.randomResults)

        const getData = await Promise.all(names.map(async (name) => await this.methods.getStreamData(name)))
        const result = diff(getData, this.randomResults)
        this.randomResults = result
        this.io.sockets.emit('updated-data', this.randomResults)
    }
    this.intervalRandom = this.intervalCopy(this.populateRandom, 60 * 60 * 60 * 4)
    this.intervalRefresh = this.intervalCopy(this.refreshRandom, 15000)
}

export default TwitchDiscovery