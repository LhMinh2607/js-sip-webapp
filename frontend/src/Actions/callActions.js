import axios from 'axios';
import { CALL_CONNECTED, CALL_DISCONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_REQUEST, CALL_RESET } from '../consts.js/CallConsts';
import JsSIP from "jssip";

export const makeACall = (phoneNumber, name) => async (dispatch) =>{
    dispatch({
        type: CALL_REQUEST, payload: {phoneNumber, name}
    });
    try { 
        var socket = new JsSIP.WebSocketInterface('wss://sbc03.tel4vn.com:7444');

        var configuration = {
            sockets  : [ socket ],
            uri      : '105@2-test1.gcalls.vn:50061',
            password : 'test1105',
            session_timers: false,
        };

        var target = '105@2-test1.gcalls.vn:50061';

        var ua = new JsSIP.UA(configuration);


        ua.start();

        var eventHandlers = {
            progress: function(e) {
                console.log('call is in progress');
                dispatch({type: CALL_IN_PROGRESS});
            },
            failed: function(e) {
                if (e.cause === JsSIP.C.causes.BUSY) {
                //ua.sendMessage(target, 'Please, call me later!');
                console.log(1);
                console.log('Please, call me later! Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.REJECTED) {
                //ua.sendMessage(target, 'I dont want to hear from you!');
                console.log('I dont want to hear from you!. Call failed with cause: '+ e.cause);
                console.log(2);
            }
            if (e.cause === JsSIP.C.causes.UNAVAILABLE) {
                //ua.sendMessage(target, 'This phone number is unvailable!');
                console.log('This phone number is unvailable!. Call failed with cause: '+ e.cause);
                console.log(3);
            }
            if (e.cause === JsSIP.C.causes.REDIRECTED) {
                //ua.sendMessage(target, 'REDIRECTED!');
                console.log('REDIRECTED. Call failed with cause: '+ e.cause);
                console.log(4);
            }
            if (e.cause === JsSIP.C.causes.NOT_FOUND) {
                //ua.sendMessage(target, 'NOT_FOUND!');
                console.log('NOT_FOUND. Call failed with cause: '+ e.cause);
                console.log(5);
            }
            if (e.cause === JsSIP.C.causes.ADDRESS_INCOMPLETE) {
                //ua.sendMessage(target, 'ADDRESS_INCOMPLETE!');
                console.log('ADDRESS_INCOMPLETE. Call failed with cause: '+ e.cause);
                console.log(6);
            }
            if (e.cause === JsSIP.C.causes.INCOMPATIBLE_SDP) {
                //ua.sendMessage(target, 'INCOMPATIBLE_SDP!');
                console.log('INCOMPATIBLE_SDP. Call failed with cause: '+ e.cause);
                console.log(7);
            }
            if (e.cause === JsSIP.C.causes.AUTHENTICATION_ERROR) {
                //ua.sendMessage(target, 'AUTHENTICATION_ERROR!');
                console.log('AUTHENTICATION_ERROR. Call failed with cause: '+ e.cause);
                console.log(8);
            }
                console.log('call failed with cause: '+ e.cause);
            },
            ended: function(e) {
                    if (e.cause === JsSIP.C.causes.CANCELED) {
                    //ua.sendMessage(target, 'You or the receiver cancelled the phone call!');
                }
                console.log('call ended with cause: '+ e.cause);
                dispatch({type: CALL_DISCONNECTED});
                dispatch({type: CALL_RESET});
            },
            confirmed: function(e) {
                console.log('call confirmed');
                dispatch({type: CALL_CONNECTED});
            }
        };
        var options = {
            'eventHandlers': eventHandlers,
            'mediaConstraints' : { 'audio': true, 'video': false }
        };
        ua.call(phoneNumber, options);

        const {data} = await axios.post(`/api/call/log`, {phoneNumber, name});
        dispatch({type: CALL_CONNECTED, payload: data});
    } catch (error) {
        dispatch({type: CALL_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,});
    }
};