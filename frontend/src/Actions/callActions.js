import axios from 'axios';
import { CALL_CONNECTED, CALL_DISCONNECTED, CALL_FAILED, CALL_IN_PROGRESS, CALL_LOG_FAILED, CALL_LOG_REQUEST, CALL_LOG_SUCCESSFUL, CALL_REQUEST, CALL_RESET } from '../consts.js/CallConsts';
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

export const makeACall = (phoneNumber, name) => async (dispatch) =>{
    dispatch({
        type: CALL_REQUEST, payload: {phoneNumber, name}
    });
    JsSIP.debug.enable('JsSIP:*');
    var remoteAudio =  window.document.createElement('audio');
    window.document.body.appendChild(remoteAudio);


    var socket = new JsSIP.WebSocketInterface('wss://sbc03.tel4vn.com:7444');

    var configuration = {
        sockets  : [ socket ],
        uri      : '105@2-test1.gcalls.vn:50061',
        password : 'test1105',
        session_timers: false,
    };

    // var target = '105@2-test1.gcalls.vn:50061';

    var ua = new JsSIP.UA(configuration);

    ua.on('newRTCSession', function(e){ 
        //alert('tes');
        var rtcSession = e.session;

        rtcSession.connection.addEventListener('addstream',function(e) {  // Or addtrack
            remoteAudio.srcObject = e.stream;
            remoteAudio.play();
        });
        // rtcSession.on('connection', function(e2) {
        //     alert(' *** connection', e.originator, e2, e.connection);
    
        //     // onaddstream
        //     e2.connection.onaddstream = function(e3) {
        //         alert(' *** onaddstream', e.originator, e3);
        //         remoteAudio.srcObject = e3.stream;
        //         remoteAudio.play();
        //     }
        //     onremovestream
        //     e2.connection.onremovestream = function(e3) {
        //         alert(' *** onremovestream', e.originator, e3);
        //         remoteAudio.srcObject = null;
        //         remoteAudio.stop();
        //     }
        // });
        // alert(JSON.stringify(rtcSession));
        // if(rtcSession.getReceivers().length > 0) {
        //     remoteAudio.src = window.URL.createObjectURL(rtcSession.getReceivers()[0]);
        //     remoteAudio.play();
        // }
    });

    ua.start();

    var eventHandlers = {
        progress: function(e) {
            console.log('call is in progress');
            dispatch({type: CALL_IN_PROGRESS});
        },
        failed: function(e) {
            if (e.cause === JsSIP.C.causes.BUSY) {
            //ua.sendMessage(target, 'Please, call me later!');
            console.log('Please, call me later! Call failed with cause: '+ e.cause);
        }
        if (e.cause === JsSIP.C.causes.REJECTED) {
            //ua.sendMessage(target, 'I dont want to hear from you!');
            console.log('I dont want to hear from you!. Call failed with cause: '+ e.cause);
        }
        if (e.cause === JsSIP.C.causes.UNAVAILABLE) {
            //ua.sendMessage(target, 'This phone number is unvailable!');
            console.log('This phone number is unvailable!. Call failed with cause: '+ e.cause);
        }
        if (e.cause === JsSIP.C.causes.REDIRECTED) {
            //ua.sendMessage(target, 'REDIRECTED!');
            console.log('REDIRECTED. Call failed with cause: '+ e.cause);
        }
        if (e.cause === JsSIP.C.causes.NOT_FOUND) {
            //ua.sendMessage(target, 'NOT_FOUND!');
            console.log('NOT_FOUND. Call failed with cause: '+ e.cause);
        }
        if (e.cause === JsSIP.C.causes.ADDRESS_INCOMPLETE) {
            //ua.sendMessage(target, 'ADDRESS_INCOMPLETE!');
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
            dispatch({type: CALL_FAILED});
        },
        ended: function(e) {
            if (e.cause === JsSIP.C.causes.CANCELED) {
                //ua.sendMessage(target, 'You or the receiver cancelled the phone call!');
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

