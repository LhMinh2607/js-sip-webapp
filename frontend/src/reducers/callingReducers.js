import { CALL_CONNECTED, CALL_DISCONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_LOG_FAILED, CALL_LOG_REQUEST, CALL_LOG_SUCCESSFUL, CALL_REQUEST, CALL_RESET } from "../consts.js/CallConsts";


export const makingACallReducer = (state = {loading: false, connected: null}, action) =>{
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
        case CALL_RESET:
            return {loading: false, connected: null};
        default:
            return state;
    }
}

export const loggingACallReducer = (state = {loading: false, log: null}, action) =>{
    switch(action.type){
        case CALL_LOG_REQUEST:
            return {loadingLog: true, log: null};
        case CALL_LOG_SUCCESSFUL:
            return {loadingLog: false, log: action.payload};
        case CALL_LOG_FAILED:
            return {loadingLog: false, errorLog: action.payload};
        default:
            return state;
    }
}
