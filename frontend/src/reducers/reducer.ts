import { Payload } from '../components/Main/main';


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
            return { ...payload, view: state && state.view ? state.view : null }
        case APP_UPDATE:
            const { streams } = payload
            return { ...state, streams }
        case SET_VIEW:
            return { ...state, view: payload }
        case REMOVE_VIEW:
            return { ...state, view: null }
        default:
            return state
    }
}