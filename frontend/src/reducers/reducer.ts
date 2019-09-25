import { Payload, StructureStreams } from '../components/Main/main';
import { SubStream } from '../data_types/data_types';


export const INC_KEY = 'inc_key',
    RESET_FEATURED = 'resetplas',
    SET_VIEW = 'set_view',
    REMOVE_VIEW = 'qwedqwdqwed'


export const APP_INIT = 'appinitbro',
    APP_UPDATE = 'holdmybeer'
// TODO
// Fix shuffle to end bug
export function appReducer(state: Payload | null, { type, payload }: { type: string, payload: any }): Payload | null {
    switch (type) {
        case APP_INIT:
            const online = getOnline(payload.streams);
            return { ...payload, online, view: state && state.view ? state.view : null }
        case APP_UPDATE:
            const { streams } = payload
            const newOnline = getOnline(streams)
            let view = state.view
            if (view && !payload.streams[view.channel.name].streamData) {
                view = newOnline[0]
            }
            return { ...state, streams, online: newOnline, view }
        case SET_VIEW:
            return { ...state, view: payload }
        case REMOVE_VIEW:
            return { ...state, view: null }
        default:
            return state
    }
}

function getOnline(streams: StructureStreams): SubStream[] {
    return Object.values(streams).filter(stream => stream.streamData).map(stream => stream.streamData)
}