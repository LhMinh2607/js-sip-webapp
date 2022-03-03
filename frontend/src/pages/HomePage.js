import React from 'react'
import Keypad from '../components/Keypad'
import {useSelector} from 'react-redux';

export default function HomePage() {

    const callingStatus = useSelector(state=>state.callingStatus);
    const {loading: loadingCall, error: errorCall, connected} = callingStatus;


  return (
    <div>
      <div className='homeBackground'>
          <Keypad></Keypad>
      </div>



    </div>
  )
}
