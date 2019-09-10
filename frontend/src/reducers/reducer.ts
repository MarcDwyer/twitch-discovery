import { SubStream } from '../data_types/data_types'
import { Payload } from '../components/Main/main';

type IFeatured = {
    stream: SubStream | null;
    index: number;
}
export const INC_KEY = 'inc_key',
    RESET_FEATURED = 'resetplas',
    SET_FEATURED = 'set_featured'


export const APP_INIT = 'appinitbro',
    APP_UPDATE = 'holdmybeer'

export function featReducer(state: IFeatured, action: { type: string, payload?: any }): IFeatured {
    switch (action.type) {
        case RESET_FEATURED:
            return { ...action.payload, key: 0 }
        case SET_FEATURED:
            return action.payload
        default:
            return state
    }
}

export function appReducer(state: Payload | null, action: { type: string, payload: any }): Payload | null {
    switch (action.type) {
        case APP_INIT:
            //@ts-ignore
            const changeStructure = action.payload.streams.filter((stream: any) => stream.streamData).map((stream: any) => stream.streamData)
            return {...action.payload, online: changeStructure}
        case APP_UPDATE:
             const online = action.payload.filter((stream: any) => stream.streamData).map((stream: any) => stream.streamData)
            //@ts-ignore
            return { ...state, streams: action.payload, online }
        default:
            return state
    }
}