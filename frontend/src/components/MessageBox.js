import React, { useState } from 'react'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function MessageBox(props) {

  const {message, open, handleClick} = props;

  const closePopup = () =>{
    handleClick();
    // alert(open);
  }

  return (
    <Popup open={open} position="center">
      <div className='popup info'>
        <div className='row center'><i className='fa fa-phone'></i>{message}</div>
        <div className='row center'><button className='confirmBtn' onClick={closePopup}>Ok</button></div>
      </div>
    </Popup>
  )
}
