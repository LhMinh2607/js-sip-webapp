import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { cancelCall, getAllHistory, makeACall } from '../Actions/callActions';
import JsSIP from "jssip";
// import { CALL_CONNECTED, CALL_DISCONNECTED } from '../consts.js/CallConsts';
import MessageBox from './MessageBox';
import Timer from './Timer';
import OptionDialogBox from './OptionDialogBox';
import { getAContact, getAllContact, saveAContact } from '../Actions/contactActions';
import { CONTACT_SAVE_RESET } from '../consts.js/CallConsts';
import DateComponent from '../components/DateComponent';


export default function Keypad() {

  const [num, setNum] = useState('');
  const [name, setName] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState('info');
  const [endCallSession, setEndCallSession] = useState(false);
  const [keypadMode, setKeypadMode] = useState('keypad');
  const [openDialogBox, setOpenDialogBox] = useState(false);
  const [messageBoxContent, setMessageBoxContent] = useState('');
  const [contactNum, setContactNum] = useState('');
  const [contactName, setContactName] = useState('');
  const [addContact, setAddContact] = useState(false);
  

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

  JsSIP.debug.disable('JsSIP:*');

  ua.on('newRTCSession', function(e){ 
    var rtcSession = e.session;
		

    rtcSession.connection.addEventListener('addstream',function(e) {  // Or addtrack
      remoteAudio.srcObject = e.stream;
      remoteAudio.play();
    });

    rtcSession.connection.addEventListener('removestream',function(e) { 
      alert('yes');
      remoteAudio.srcObject = null;
      remoteAudio.stop();
      document.getElementById("invisi").style.visibility = "hidden";
    });

    rtcSession.connection.addEventListener('ended', function(e){
      alert('end');
      document.getElementById("invisi").style.visibility = "hidden";
    })

    document.getElementById("endButton").addEventListener('click',function(e) { 
      cancel(rtcSession);
      document.getElementById("invisi").style.visibility = "hidden";
    })
    
    rtcSession.on('ended', (e) => {
      document.getElementById("invisi").style.visibility = "hidden";
    })
    
    
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

  const input = (value) => { //Keypad
    let audio = new Audio("/beep.mp3");
    audio.play();
    var re = new RegExp("[0-9]");
    console.log(num.length);
    setNum(num+value);
    
    if(num.length+1>10){
      setMessageBoxContent("10 Digit-number only");
      setPopupType('error');
      setOpenPopup(true);
      setNum(num);
    }else if(num.length+1===10 && re.test(num+value)){
      dispatch(getAContact(num+value));
    }
    // alert(num+value);
  }

  const backspace = () => { //Keypad
    let audio = new Audio("/beep.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    setNum("");
  }

  const closePopup = () =>{
    setOpenPopup(false);
    //alert(openPopup);
    let audio = new Audio("/MenuSelectionClick.mp3");
    audio.play();
    dispatch({type: CONTACT_SAVE_RESET});
  }


  const cancel = (rtcSession) =>{
    let audio = new Audio("/AmbientClick.mp3");
    audio.play();
    dispatch(cancelCall(num, name, rtcSession));
  }

  const dispatch = useDispatch();

  const makeCall = () => {
    let audio = new Audio("/AmbientClick.mp3");
    audio.play();
    if(num.length>10){
      setMessageBoxContent('10 digit-number only');
      setOpenPopup(true);
      setNum("");
    }else{
    document.getElementById("invisi").style.visibility = "visible";
    dispatch(makeACall(num, name, ua));}
    // JsSIP.debug.enable('JsSIP:*');
    
    //JsSIP.debug.enable('JsSIP:Transport JsSIP:RTCSession*');

    // let pc = new RTCPeerConnection();

    // Register callbacks to desired call events
    

    

    // ua.call('sip:106@2-test1.gcalls.vn:50061', options);
    //coolPhone.call('sip:'+extension+'@'+server, options);
    // dispatch(makeACall("0981232607"));

    // alert('call in progress');
  }

  const openOptionDialogBox = () => {
    let audio = new Audio("/MenuSelectionClick.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    
    setOpenDialogBox(true);
  }

  const closeDialogBox = () =>{ 
    let audio = new Audio("/MenuSelectionClick.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    setOpenDialogBox(false);
  }

  const openContact = () => { //Contact
    let audio = new Audio("/MenuSelectionClick.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    if(keypadMode==='keypad'){
      setKeypadMode('contact');
    }else if(keypadMode==='contact'){
      setKeypadMode('keypad');
    }
    setOpenDialogBox(false);
  }

  const openHistory = () =>{
    let audio = new Audio("/MenuSelectionClick.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    if(keypadMode==='keypad'){
      setKeypadMode('history');
    }else if(keypadMode==='history'){
      setKeypadMode('keypad');
    }
    setOpenDialogBox(false);
  }

  const submitNewContact = (e) =>{ //Contact
    e.preventDefault();
    var re = new RegExp("[0-9]{10}");
    setPopupType('error');
    if(contactNum.length<10 || contactNum.length>10 || !re.test(contactNum)){
      setOpenPopup(true);
      setMessageBoxContent("10 Digit-number only");
    }else if(contactName===""){
      setOpenPopup(true);
      setMessageBoxContent("Name is required");
      
    }else if(contactNum.length===10){
      setPopupType('info');
      dispatch(saveAContact(contactNum, contactName));
      dispatch(getAllContact());
    }
    setAddContact(false);
  }

  const dialNum = (e) =>{ //Contact
    // alert(e.currentTarget.value.split("|")[0]);
    setNum(e.currentTarget.value.split("|")[0]);
    setName(e.currentTarget.value.split("|")[1]);
    dispatch(getAContact(e.currentTarget.value.split("|")[0]));
    setKeypadMode('keypad');
    let audio = new Audio("/beep.mp3");
    audio.play();
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
  }

  const setNumFromKeyboard = (e) =>{ //Keypad
    var re = new RegExp("[0-9]");
    console.log(e.target.value.length);
    setNum(e.target.value);
    
    if(e.target.value.length>10){
      setPopupType('error');
      setMessageBoxContent("10 Digit-number only");
      setOpenPopup(true);
      setNum(e.target.value.slice(0, -1));
    }else if(e.target.value.length===10 && re.test(e.target.value)){
      dispatch(getAContact(e.target.value));
    }
  }

  const openAddContact = () =>{
    let audio2 = new Audio("/AmbientClick.mp3");
    audio2.play();
    setAddContact(!addContact);
  }

  const callingStatus = useSelector(state=>state.callingStatus);
  const {loading: loadingCall, error: errorCall, connected} = callingStatus;

  const contactSaving = useSelector(state=>state.contactSaving);
  const {loading: loadingSaving, error: errorSaving, contact} = contactSaving;
  
  const contactList = useSelector(state=>state.contactList);
  const {loading: loadingList, error: errorList, contacts} = contactList;

  const contactDetail = useSelector(state=>state.contactDetail);
  const {loading: loadingDetail, error: errorDetail, contactInfo} = contactDetail;

  const historyList = useSelector(state=>state.historyList);
  const {loading: loadingHistory, error: errorHistory, history} = historyList;

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
    
    
    setPopupType('info');
    // handleWindowResize();
    if(keypadMode==='keypad' && loadingCall===false && connected===false){
      setMessageBoxContent('Call Ended');
      setOpenPopup(true);
    }
    dispatch(getAllContact());
    dispatch(getAllHistory());
    
    // if(connected===true){
    // alert(endCallSession);
    // }
  }, [loadingCall, connected, openPopup, endCallSession]);

  return (
    <div>
      <div className='keyPad'>
        {keypadMode==='keypad' && !loadingCall && !connected && <div>
          <div className='keyRow'>
            <input className='phoneNum' type="number" onChange={setNumFromKeyboard} value={num} pattern="[0-9]{10}"></input>
          </div>
          <div className='keyRow'>
            {/* <div className='contentRow'>{name}</div> */}
            <div className='contentRow'>{contactInfo && contactInfo.name}</div>
          </div>
          <div className='keyRow'>
            <button type="submit" value="1" onClick={() => input("1")} className='keyNum'><div className='keyContent'>1</div></button>
            <button type="submit" value="2" onClick={() => input("2")} className='keyNum'><div className='keyContent'>2</div><div className='keyContent sub'>ABC</div></button>
            <button type="submit" value="3" onClick={() => input("3")} className='keyNum'><div className='keyContent'>3</div><div className='keyContent sub'>DEF</div></button>
          </div>
          <div className='keyRow'>
            <button type="submit" value="4" onClick={() => input("4")} className='keyNum'><div className='keyContent'>4</div><div className='keyContent sub'>GHI</div></button>
            <button type="submit" value="5" onClick={() => input("5")} className='keyNum'><div className='keyContent'>5</div><div className='keyContent sub'>JKL</div></button>
            <button type="submit" value="6" onClick={() => input("6")} className='keyNum'><div className='keyContent'>6</div><div className='keyContent sub'>MNO</div></button>
          </div>
          <div className='keyRow'>
            <button type="submit" value="7" onClick={() => input("7")} className='keyNum'><div className='keyContent'>7</div><div className='keyContent sub'>PQRS</div></button>
            <button type="submit" value="8" onClick={() => input("8")} className='keyNum'><div className='keyContent'>8</div><div className='keyContent sub'>TUV</div></button>
            <button type="submit" value="9" onClick={() => input("9")} className='keyNum'><div className='keyContent'>9</div><div className='keyContent sub'>WXYZ</div></button>
          </div>
          <div className='keyRow'>
            {/* <button className='keyNum'><div className='keyContent'>*</div></button> */}
            <button type="submit" value="" className='keyNum' onClick={openOptionDialogBox}><i className='fas fa-ellipsis-v'></i></button>

            <button type="submit" value="0" onClick={() => input("0")} className='keyNum'><div className='keyContent'>0</div><div>+</div></button>
            {/* <button className='keyNum'><div className='keyContent'>#</div></button> */}
            <button type="submit" value="" onClick={backspace} className='keyNum keyBackspace'><div className='keyContent'><i className='fa fa-arrow-left'></i></div></button>

          </div>
          <div className='keyRow'>
            <button type="submit" onClick={makeCall} className='callButton'><i className='fa fa-phone'></i></button>
          </div>
          <div>
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
              <div className='contentRow displayNumber'>{num}</div>
            </div>
            <div className='keyRow'>
              <div className='contentRow'>CONNECTED</div>
            </div>
            <div className='keyRow'>
              <Timer connectivity={connected}></Timer>
            </div>
          </div>
        }
        {openPopup && <MessageBox type={popupType} message={messageBoxContent} open={openPopup} handleClosePopup={closePopup}></MessageBox>}
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
          <div className='row center'><button className='callButton red' id="endButton"><i className='fa fa-phone red hangupIcon'></i></button></div>
        </div></div>
        {/* <div className='coverTheCancelButton'>

        </div> */}
        {keypadMode==='contact' && 
          <>
            <div className='row right'><button onClick={openContact} className='confirmBtn back'><i className='fa fa-mail-reply'></i></button></div>
            <div className='row right'><button onClick={openAddContact} className='confirmBtn info'><i className='fa fa-plus'></i></button></div>
              <div className='row inline scrollableDiv'>
                {/* <table>
                  <thead>
                    <tr>
                      <th>
                        Name
                      </th>
                      <th>
                        Phone number
                      </th>
                      <th>
                        Dial
                      </th>
                    </tr>
                  </thead>
                  <tbody>{contacts && contacts.length>0 && contacts.map(contact=>(
                    <tr key={contact._id}>
                      <td>
                        {contact.name}
                      </td>
                      <td>
                        {contact.phoneNum}
                      </td>
                      <td>
                        <button className='callButton' value={contact.phoneNum+"|"+contact.name} onClick={dialNum}><i className='fa fa-mobile'></i></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table> */}
                <div className='col-2'>
                  {contacts && contacts.length>0 && contacts.map(contact=>(
                    <div className='row left inline' key={contact._id}>
                      <div className='col-1 inline'>
                        <div className='displayNameContact row left'>{contact.name}</div><div className='displayNumberContact row left'>{contact.phoneNum}</div>
                      </div>
                      <div className='col-1 inline'>
                        <div className='row right'><button className='callButton dial' value={contact.phoneNum+"|"+contact.name} onClick={dialNum}><i className='fa fa-mobile'></i></button></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </>
        }
        {keypadMode==='history' &&
          <div><div className='row right'><button onClick={openHistory} className='confirmBtn back'><i className='fa fa-mail-reply'></i></button></div>
            <div className='row right'><button onClick={openAddContact} className='confirmBtn info'><i className='fa fa-plus'></i></button></div>
              {/* <div className='row scrolltable'>
                <table>
                  <thead>
                    <tr>
                      <th>
                        Name
                      </th>
                      <th>
                        Phone number
                      </th>
                      <th>
                        Started by
                      </th>
                      <th>
                        Ended by
                      </th>
                      <th>
                        Date
                      </th>
                      <th>
                        Dial
                      </th>
                    </tr>
                  </thead>
                  <tbody>{history && history.length>0 && history.map(hist=>(
                    <tr key={hist._id}>
                      <td>
                        {hist.name}
                      </td>
                      <td>
                        {hist.phoneNum}
                      </td>
                      <td>
                        {<DateComponent onlyTime={true} passedDate={hist.createdAt}></DateComponent>}
                      </td>
                      <td>
                        <button className='callButton' value={hist.phoneNum+"|"+hist.name} onClick={dialNum}><i className='fa fa-mobile'></i></button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>  */}
              <div className='scrollableDiv'>
                <div className='col-2'>
                  {history && history.length>0 && history.map(hist=>(
                    <div key={hist._id}>
                      <div className='row center displayNumberContact'>{hist._id}</div>
                      {hist.list.map(l=>(
                        <div className='row left inline' key={l._id}>
                          <div className='col-1 inline'>
                            <div className='displayNameContact row left'>{l.name}</div><div className='displayNumberContact row left'>{l.phoneNum}</div>
                          </div>
                          <div className='col-1 inline'>
                            <div className='row'>
                              <div className='col-1 right displayNumberContact'><DateComponent passedDate={l.createdAt} onlyTime={true}></DateComponent></div>
                              <div className='col-1 right'><button className='callButton dial' value={l.phoneNum+"|"+l.name} onClick={dialNum}><i className='fa fa-mobile'></i></button></div>
                            </div>
                            
                          </div>
                        </div>
                      ))
                      }
                    </div>
                  ))}
                </div>
              </div>
            </div>
        }
        {openDialogBox && 
          <OptionDialogBox open={openDialogBox} handleClosePopup={closeDialogBox} handleOpenContact={openContact} handleOpenHistory={openHistory}></OptionDialogBox>
        }
        {loadingSaving ? <></> : errorSaving ? (errorSaving.includes("E11000") ?
          <MessageBox type="error" message="Duplicate phone number detected. Please check the number again." open={true} handleClosePopup={closePopup}></MessageBox> : <MessageBox type="error" message={errorSaving} open={true} handleClosePopup={closePopup}></MessageBox>) :
        contact && contact.success && 
          <MessageBox message={contact.message} open={true} handleClosePopup={closePopup}></MessageBox>
        }
      </div>
      {addContact && 
      <div>
        <div className='popup info'>
          <div className='row top right'>
            <button type="submit" value="" className='confirmBtn xClose' onClick={openAddContact}><i className='fas fa-close'></i></button>
          </div>
          <form onSubmit={submitNewContact}>
            
            <div className='row center'>
              <input type="text" className='inputBox' placeholder='Name' id="name" autocomplete="off" onChange={e=>setContactName(e.target.value)}/>
            </div>
            <div className='row center'>
              <input type="number" className='inputBox' placeholder='Phone number' id="phoneNum" autocomplete="off" onChange={e=>setContactNum(e.target.value)}/>
            </div>
            <div className='row center'>
              <button type="submit" className='submitBtn'>ENTER</button>
            </div>
          </form>
        </div>
        <div className='popupCoverup'></div>
      </div>}
      
    </div>
  )
}
