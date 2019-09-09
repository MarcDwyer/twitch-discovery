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
            console.log(action)
            return action.payload
        default:
            return state
    }
}

export function appReducer(state: Payload | null, action: { type: string, payload: any }): Payload | null {
    switch (action.type) {
        case APP_INIT:
            //@ts-ignore
            return action.payload
        case APP_UPDATE:
            //@ts-ignore
            return { ...state, streams: action.payload }
        default:
            return state
    }
}