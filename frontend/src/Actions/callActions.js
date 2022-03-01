import axios from 'axios';
import { CALL_CONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_REQUEST } from '../consts.js/CallConsts';


export const makeACall = (phoneNumber, name) => async (dispatch) =>{
    dispatch({
        type: CALL_REQUEST, payload: {phoneNumber, name}
    });
    try {
        const {data} = await axios.post(`/api/call/number`, {phoneNumber, name});
        dispatch({type: CALL_IN_PROGRESS});
        // dispatch({type: CALL_CONNECTED, payload: data});
    } catch (error) {
        dispatch({type: CALL_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,});
    }
};