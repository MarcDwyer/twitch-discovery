import { SubStream } from '../data_types/data_types'
import { Payload } from '../components/Main/main';


export const INC_KEY = 'inc_key',
    RESET_FEATURED = 'resetplas',
    SET_FEATURED = 'set_featured'


export const APP_INIT = 'appinitbro',
    APP_UPDATE = 'holdmybeer'

export function appReducer(state: Payload | null, { type, payload }: { type: string, payload: any }): Payload | null {
    switch (type) {
        case APP_INIT:
            return { ...payload, featured: { stream: payload.streams[0], index: 0 } }
        case APP_UPDATE:
            let index = payload.findIndex((stream: SubStream) => stream._id === state.featured.stream._id)
            if (index === -1) {
                index = 0
            }
            return { ...state, streams: payload, featured: { stream: payload[index], index } }
        case SET_FEATURED:
            if (!state) return null
            return { ...state, featured: payload }
        case INC_KEY:
            if (!state) return state
            let value = state.featured.index + 1
            if (!state.streams[value]) value = 0
            return { ...state, featured: { stream: state.streams[value], index: value } }
        default:
            return state
    }
}