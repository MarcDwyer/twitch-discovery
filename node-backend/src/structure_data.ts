import { SubStream } from './data_types/data_types'
import { StructureStreams, IStreamers } from './twitch_discovery'

export const structureData = (data: SubStream[]): IStreamers[] => {
    return data.map(stream  => {
        return {
            streamName: stream.channel.name,
            channelData: stream.channel,
            id: stream.channel._id,
            streamData: stream
        }
    })
}
export const structureLiveData = (data: IStreamers[]): StructureStreams => {
    return data.reduce((obj, stream) => {
        obj[stream.streamName] = stream
        return obj
    }, {})
}
