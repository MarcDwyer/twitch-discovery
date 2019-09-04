import { RandomStreamers } from './data_types/data_types'
import { StructureStreams, IStreamers } from './twitch_discovery'

const structureData = (data: RandomStreamers): StructureStreams => {
    return data.streams.reduce((obj, streamer) => {
        const item = {
            streamData: streamer,
            streamName: streamer.channel.name,
            channelData: streamer.channel
        }
        obj[item.streamName] = item
        return obj
    }, {})
}
const structureLiveData = (data: IStreamers[]): StructureStreams => {
    return data.reduce((obj, stream) => {
        obj[stream.streamName] = stream
        return obj
    }, {})
}

export default { structureData, structureLiveData }