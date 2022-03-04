import axios from 'axios';
import { CALL_CANCELED_FAILED, CALL_CANCELED_REQUEST, CALL_CANCELED_SUCCESSFUL, CALL_CONNECTED, CALL_DISCONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_LOG_FAILED, CALL_LOG_REQUEST, CALL_LOG_SUCCESSFUL, CALL_REQUEST, CALL_RESET } from '../consts.js/CallConsts';
import JsSIP from "jssip";


export const logACall = (phoneNumber, name) => async (dispatch) =>{
    dispatch({type: CALL_LOG_REQUEST, payload: {phoneNumber, name}});
    try{
        const {data} = await axios.post(`/api/call/log`, {phoneNumber, name});
        dispatch({type: CALL_LOG_SUCCESSFUL, payload: data});
    }catch(error){
        dispatch({type: CALL_LOG_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,});
    }
};

export const cancelCall = (phoneNumber, name, rtcSession) => async (dispatch) =>{
    dispatch({type: CALL_CANCELED_REQUEST, payload: {phoneNumber, name}});
    // console.log("CALL_CANCELED_REQUEST");
    try{
        const {data} = await axios.post(`/api/call/log`, {phoneNumber, name});
        dispatch({type: CALL_CANCELED_SUCCESSFUL, payload: data});
        // console.log("CALL_CANCELED_SUCCESSFUL");
        rtcSession.terminate();
    }catch(error){
        dispatch({type: CALL_CANCELED_FAILED, 
            payload: error.response 
            && error.response.data.message 
            ? error.response.data.message
            : error.message,});
    }
}

export const makeACall = (phoneNumber, name, ua) => async (dispatch) =>{
    dispatch({
        type: CALL_REQUEST, payload: {phoneNumber, name}
    });
    
    const target = phoneNumber;


    

    

    ua.start();
    

    var eventHandlers = {
        progress: function(e) {
            console.log('call is in progress');
            dispatch({type: CALL_IN_PROGRESS});
        },
        failed: function(e) {
            if (e.cause === JsSIP.C.causes.BUSY) {
            ua.sendMessage(target, 'Please, call me later!');
            console.log('Please, call me later! Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.REJECTED) {
                ua.sendMessage(target, 'I dont want to hear from you!');
                console.log('I dont want to hear from you!. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.UNAVAILABLE) {
                ua.sendMessage(target, 'This phone number is unvailable!');
                console.log('This phone number is unvailable!. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.REDIRECTED) {
                ua.sendMessage(target, 'REDIRECTED!');
                console.log('REDIRECTED. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.NOT_FOUND) {
                ua.sendMessage(target, 'NOT_FOUND!');
                console.log('NOT_FOUND. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.ADDRESS_INCOMPLETE) {
                ua.sendMessage(target, 'ADDRESS_INCOMPLETE!');
                console.log('ADDRESS_INCOMPLETE. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.INCOMPATIBLE_SDP) {
                //ua.sendMessage(target, 'INCOMPATIBLE_SDP!');
                console.log('INCOMPATIBLE_SDP. Call failed with cause: '+ e.cause);
            }
            if (e.cause === JsSIP.C.causes.AUTHENTICATION_ERROR) {
                //ua.sendMessage(target, 'AUTHENTICATION_ERROR!');
                console.log('AUTHENTICATION_ERROR. Call failed with cause: '+ e.cause);
            }
                console.log('call failed with cause: '+ e.cause);
                dispatch({type: CALL_FAILED, payload: 'call failed with cause: '+ e.cause});
            },
        ended: function(e) {
            if (e.cause === JsSIP.C.causes.CANCELED) {
                //ua.sendMessage(target, 'The receiver cancelled the phone call!');
            }
            console.log('call ended with cause: '+ e.cause);
            dispatch(logACall(phoneNumber, name));
            dispatch({type: CALL_DISCONNECTED});
            dispatch({type: CALL_RESET});
        },
        confirmed: function(e) {
            console.log('call confirmed');
            dispatch({type: CALL_CONNECTED});
            // var audio = new Audio();
            // audio.volume = 1;
            // audio.autoplay = true;
            // audio.loop = true;
            // var rtcSession = e.sender;
            // // alert(JSON.stringify(rtcSession));
            // if(rtcSession.getReceivers().length > 0) {
            //     audio.src = window.URL.createObjectURL(rtcSession.getReceivers()[0]);
            //     audio.play();
            // }
        },
        // peerconnection: function(e){
        //     e.peerconnection.ontrack=function(ev){
        //         ev.track.onunmute = function(ev1)
        //         {
        //             if(ev.track.kind=='audio')
        //                 document.getElementById('audio-element').srcObject= ev.streams[0];
        //         }
        //    }
        // }
    };
    var options = {
        'eventHandlers': eventHandlers,
        'mediaConstraints' : { 'audio': true, 'video': true }
    };

    // ua.on('newRTCSession', function(data){
    //     //alert('yes');
    //     var session = data.session;
    //     session.connection.addEventListener('addTrack', (e) => {
    //         // set remote audio stream
    //         const remoteAudio = document.createElement('audio');
    //         remoteAudio.src = window.URL.createObjectURL(e.stream);
    //         remoteAudio.play();
    //     });
    // });
    

    ua.call(phoneNumber, options);

};

