import React, { useEffect } from 'react';
import { useStopwatch  } from 'react-timer-hook';

export default function Timer(props) {
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: true });

    const {connectivity} = props;
    
    const stop = () =>{
        console.log(hours+":"+minutes+":"+seconds)
        pause();
    }

    useEffect(()=>{
        if(connectivity===false){
            stop();
        }
    }, [connectivity]);
    return (
    <div style={{textAlign: 'center'}}>
        <div className='timer'>
            <span>{hours}</span><span>:</span><span>{minutes}</span><span>:</span><span>{seconds}</span>
        </div>
        {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
        {/* <button onClick={start}>Start</button> */}
        {/* <button onClick={pause}>Pause</button> */}
        {/* {connectivity} */}
        {/* <button onClick={reset}>Reset</button> */}
    </div>
  );
}