import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { makeACall } from '../Actions/callActions';
import JsSIP from "jssip";
import { CALL_CONNECTED, CALL_DISCONNECTED } from '../consts.js/CallConsts';

export default function Keypad() {

  const [num, setNum] = useState('');
  const [name, setName] = useState('Lê Huỳnh Minh');


  const input = (value) => {
      setNum(num+value);
    
    // alert(num+value);
  }

  const backspace = () => {
    setNum("");
  }


  const dispatch = useDispatch();

  const makeCall = () => {
    // alert(num);
    dispatch(makeACall(num, name));
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

    // JsSIP.debug.enable('JsSIP:*');
    //JsSIP.debug.enable('JsSIP:Transport JsSIP:RTCSession*');

    // let pc = new RTCPeerConnection();

    // Register callbacks to desired call events
    var eventHandlers = {
      progress: function(e) {
        console.log('call is in progress');
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

    ua.call(num, options);

    // ua.call('sip:106@2-test1.gcalls.vn:50061', options);
    //coolPhone.call('sip:'+extension+'@'+server, options);
    // dispatch(makeACall("0981232607"));

    alert('call in progress');
  }

  const callingStatus = useSelector(state=>state.callingStatus);
  const {loading: loadingCall, error: errorCall, connected} = callingStatus;

  useEffect(()=>{
    window.scrollTo({
      top: 0, 
    });
    
  }, [loadingCall, connected]);

  return (
    <div>
      {!loadingCall && !connected && <div className='keyPad'>
        <div className='keyRow'>
          <input onChange={e => setNum(e.target.value)} value={num}></input>
          <button type="submit" value="" onClick={backspace} className='keyNum keyBackspace'><div className='keyContent'><i className='fa fa-arrow-left'></i></div></button>
          <button type="submit" value="" className='optionBtn'><div className='keyContent'><i className='fas fa-ellipsis-v'></i></div></button>
        </div>
        <div className='keyRow'>
          <button type="submit" value="1" onClick={() => input("1")} className='keyNum'><div className='keyContent'>1</div></button>
          <button type="submit" value="2" onClick={() => input("2")} className='keyNum'><div className='keyContent'>2</div><div>ABC</div></button>
          <button type="submit" value="3" onClick={() => input("3")} className='keyNum'><div className='keyContent'>3</div><div>DEF</div></button>
        </div>
        <div className='keyRow'>
          <button type="submit" value="4" onClick={() => input("4")} className='keyNum'><div className='keyContent'>4</div><div>GHI</div></button>
          <button type="submit" value="5" onClick={() => input("5")} className='keyNum'><div className='keyContent'>5</div><div>JKL</div></button>
          <button type="submit" value="6" onClick={() => input("6")} className='keyNum'><div className='keyContent'>6</div><div>MNO</div></button>
        </div>
        <div className='keyRow'>
          <button type="submit" value="7" onClick={() => input("7")} className='keyNum'><div className='keyContent'>7</div><div>PQRS</div></button>
          <button type="submit" value="8" onClick={() => input("8")} className='keyNum'><div className='keyContent'>8</div><div>TUV</div></button>
          <button type="submit" value="9" onClick={() => input("9")} className='keyNum'><div className='keyContent'>9</div><div>WXYZ</div></button>
        </div>
        <div className='keyRow'>
          <button className='keyNum'><div className='keyContent'>*</div></button>
          <button type="submit" value="0" onClick={() => input("0")} className='keyNum'><div className='keyContent'>0</div><div>+</div></button>
          <button className='keyNum'><div className='keyContent'>#</div></button>
        </div>
        <div className='keyRow padding'>
          <button type="submit" onClick={makeCall} className='callButton'><i className='fa fa-phone'></i></button>
        </div>
      </div>}
      {loadingCall && !connected ?
      <div className='keyPad calling'>
        <div className='keyRow'>
          <div className='contentRow'>Calling {num}</div>
        </div>
        <div className='keyRow'>
          <div className='contentRow'>{name}</div>
        </div>
        <div className='keyRow'>
          <div className='keyRow'>
            <button type="submit" value="Mute" className='keyNum round'>Mute</button>
            <button type="submit" value="Keypad" className='keyNum round'>Keypad</button>
            <button type="submit" value="Pause" className='keyNum round'>Pause</button>
            <button type="submit" value="Forward" className='keyNum round'>Forward</button>
          </div>
        </div>
      </div>: connected && 
        <div className='keyPad'>
          <div className='keyRow'>
            <div className='contentRow'>{num}</div>
          </div>
          <div className='keyRow'>
          <div className='contentRow'>CONNECTED</div>
          </div>
        </div>
      }
      {/* {connected && <div>CONNECTED</div>} */}
      
    </div>
  )
}
