import React, { useState } from 'react'

export default function OptionDialogBox(props) {

  const {message, open, handleClosePopup, handleOpenContact, handleOpenHistory} = props;

  const closePopup = () =>{
    handleClosePopup();
    // alert(open);
  }

  const openContact = () =>{
    handleOpenContact();
  }

  const openHistory = () => {
    handleOpenHistory();
  }

  return (
    <div>
      {open && 
      <div>
        <div className='popup option'>
          <div className='row top right'><button className='confirmBtn xClose' onClick={closePopup}><i className='fa fa-close'></i></button></div>
          <div className='row center'><button className='confirmBtn' onClick={openContact}><i className='fa fa-address-book-o'>Contact</i></button></div>
          <div className='row center'><button className='confirmBtn' onClick={openHistory}><i className='fa fa-history'>History</i></button></div>

        </div>
        <div className='popupCoverup'></div>
      </div>}
    </div>
  )
}
