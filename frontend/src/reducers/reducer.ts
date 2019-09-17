import { Payload } from '../components/Main/main';
import { SubStream } from '../data_types/data_types';


export const INC_KEY = 'inc_key',
    RESET_FEATURED = 'resetplas',
    SET_FEATURED = 'set_featured'


export const APP_INIT = 'appinitbro',
    APP_UPDATE = 'holdmybeer'
// TODO
// Fix shuffle to end bug
export function appReducer(state: Payload | null, { type, payload }: { type: string, payload: any }): Payload | null {
    switch (type) {
        case APP_INIT:
            return { ...payload, featured: { stream: payload.online[0], index: 0 } }
        case APP_UPDATE:
            if (!payload || payload.online.length < 1 || payload.streams.length < 1) return state
            const { online, streams } = payload
            let index = online.findIndex((stream: SubStream) => stream._id === state.featured.stream._id)
            if (index === -1) {
                index = 0
            }
            return { ...state, streams, online, featured: { stream: payload.online[index], index } }
        case SET_FEATURED:
            if (!state) return null
            let i = state.online.findIndex(stream => stream._id === payload._id)
            if (i === -1) {
                i = 0
            }
            return { ...state, featured: { stream: state.online[i], index: i } }
        case INC_KEY:
            if (!state) return state
            let value = state.featured.index + 1
            if (!state.online[value]) value = 0
            return { ...state, featured: { stream: state.online[value], index: value } }
        default:
            return state
    }
}