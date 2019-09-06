import { SubStream } from './data_types/data_types'
import { StructureStreams, IStreamers } from './twitch_discovery'

export const structureData = (data: SubStream[]): StructureStreams => {
    //@ts-ignore
    return data.reduce((obj, streamer) => {
        const item = {
            streamData: streamer,
            streamName: streamer.channel.name,
            channelData: streamer.channel,
            id: streamer._id
        }
        obj[item.streamName] = item
        return obj
    }, {})
}
export const structureLiveData = (data: IStreamers[]): StructureStreams => {
    return data.reduce((obj, stream) => {
        obj[stream.streamName] = stream
        return obj
    }, {})
}
