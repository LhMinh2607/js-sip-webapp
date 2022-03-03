import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cancelCall, makeACall } from '../Actions/callActions';
import JsSIP from "jssip";
// import { CALL_CONNECTED, CALL_DISCONNECTED } from '../consts.js/CallConsts';
import MessageBox from './MessageBox';
import Timer from './Timer';


export default function Keypad() {

  const [num, setNum] = useState('');
  const [name, setName] = useState('Lê Huỳnh Minh');
  const [openPopup, setOpenPopup] = useState(false);
  const [endCallSession, setEndCallSession] = useState(false);

  var socket = new JsSIP.WebSocketInterface('wss://sbc03.tel4vn.com:7444');

  var configuration = {
      sockets  : [ socket ],
      uri      : '105@2-test1.gcalls.vn:50061',
      password : 'test1105',
      session_timers: false,
      display_name: name,
  };

  var ua = new JsSIP.UA(configuration);

  var remoteAudio =  window.document.createElement('audio');
  window.document.body.appendChild(remoteAudio);

  ua.on('newRTCSession', function(e){ 
    var rtcSession = e.session;
		

    rtcSession.connection.addEventListener('addstream',function(e) {  // Or addtrack
        remoteAudio.srcObject = e.stream;
        remoteAudio.play();
    });

    rtcSession.connection.addEventListener('removestream',function(e) { 
        remoteAudio.srcObject = null;
        remoteAudio.stop();
    });

    document.getElementById("endButton").addEventListener('click',function(e) { 
      cancel(rtcSession);
      document.getElementById("invisi").style.visibility = "hidden";

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

  const input = (value) => {
      setNum(num+value);
    
    // alert(num+value);
  }

  const backspace = () => {
    setNum("");
  }

  const closePopup = () =>{
    setOpenPopup(false);
  }


  const cancel = (rtcSession) =>{
    dispatch(cancelCall(num, name, rtcSession));
  }

  const dispatch = useDispatch();

  const makeCall = () => {
    document.getElementById("invisi").style.visibility = "visible";
    // alert(num);
    dispatch(makeACall(num, name, ua));
    // JsSIP.debug.enable('JsSIP:*');
    
    //JsSIP.debug.enable('JsSIP:Transport JsSIP:RTCSession*');

    // let pc = new RTCPeerConnection();

    // Register callbacks to desired call events
    

    

    // ua.call('sip:106@2-test1.gcalls.vn:50061', options);
    //coolPhone.call('sip:'+extension+'@'+server, options);
    // dispatch(makeACall("0981232607"));

    // alert('call in progress');
  }

  const callingStatus = useSelector(state=>state.callingStatus);
  const {loading: loadingCall, error: errorCall, connected} = callingStatus;

  // const [width, setWidth] = useState(window.innerWidth);

  // const isMobile = width <= 1024;

  // const handleWindowResize = () => {
  //   setWidth(window.innerWidth);
  //   window.addEventListener("resize", handleWindowResize);
  //   return () => window.removeEventListener("resize", handleWindowResize);
  // }

  useEffect(()=>{
    // window.scrollTo({
    //   top: 0, 
    // });
    
    // handleWindowResize();
    if(loadingCall===false && connected===false){
      setOpenPopup(true);
    }
    // if(connected===true){
    // alert(endCallSession);
    // }
  }, [loadingCall, connected, openPopup, endCallSession]);

  return (
    <div>
      <div className='keyPad'>
        {!loadingCall && !connected && <div>
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
          <div className='keyRow'>
            <button type="submit" onClick={makeCall} className='callButton'><i className='fa fa-phone'></i></button>
          </div>
        </div>}
        {loadingCall && !connected ?
        <div>
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
          <div className='keyRow'>
            
          </div>
        </div>: connected && 
          <div>
            <div className='keyRow'>
              <div className='contentRow'>{num}</div>
            </div>
            <div className='keyRow'>
              <div className='contentRow'>CONNECTED</div>
            </div>
            <div className='keyRow'>
              <Timer connectivity={connected}></Timer>
            </div>
          </div>
        }
        {openPopup && <MessageBox message="Call Ended" open={openPopup} handleClick={closePopup}></MessageBox>}
        {/* {connected && <div>CONNECTED</div>} */}
        
        {/* <div className='popup cancel'>
          <div className='row center'><i className='fa fa-phone'></i>User Hang up</div>
          <div className='row center'><button className='confirmBtn'>Ok</button></div>
        </div> */}
        {/* <div className='popup info'>
          <div className='row center'></div>
          <div className='row center'><button className='confirmBtn cancel' onClick={cancel}><i className='fa fa-phone red'></i></button></div>
        </div> */}
        <div><div id="invisi" className='keyRow invisi'>
          <div className='row center'><button className='callButton red' id="endButton"><i className='fa fa-phone red'></i></button></div>
        </div></div>
        {/* <div className='coverTheCancelButton'>

        </div> */}
        
      </div>
    </div>
  )
}
