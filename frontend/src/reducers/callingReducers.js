import { CALL_CONNECTED, CALL_DISCONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_REQUEST } from "../consts.js/CallConsts";


export const makingACallReducer = (state = {loading: false}, action) =>{
    switch(action.type){
        case CALL_REQUEST: 
            return {loading: true, phoneNum: action.payload};
        case CALL_IN_PROGRESS:
            return {loading: true, connected: false};
        case CALL_CONNECTED:
            return {loading: false, connected: true};
        case CALL_DISCONNECTED:
            return {loading: false, connected: false};
        // case CALL_HUNG_UP_BY_RECEIVER:
        //     return {loading: false, connected: false};
        case CALL_FAILED:
            return {loading: false, error: action.payload};
        default:
            return state;
    }
}
