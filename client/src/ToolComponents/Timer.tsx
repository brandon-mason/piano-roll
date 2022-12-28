import React, {useState, useLayoutEffect} from 'react';
import { TimerProps } from '../Interfaces';

// interface TimerProps {
//   mode: string;
//   bpm: number;
//   midiLength: number;
//   time: number;
//   pulseNum: number;
//   handleSetTime: Function;
//   handleSetPulseNum: Function;
//   midiDispatch: React.Dispatch<any>
// }

function Timer(props: TimerProps) {
  const [date, setDate] = useState<ReturnType<typeof setInterval>>();
  const [time, setTime] = useState(0);

  useLayoutEffect(() => {
    let ppq = 24;
    let pulseRate = 60 / props.bpm / ppq * 1000; //interval

    if(props.mode === 'recording' || props.mode === 'playing') {
      let start = performance.now();
      let tempTime = props.time;
      let pulseNum = props.pulseNum;
      setDate(setInterval(() => {
        let expected = tempTime + pulseRate;
        tempTime += performance.now() - start;
        tempTime += tempTime - expected;
        tempTime = Math.round(tempTime)
        pulseNum++;
        start = performance.now();
        // setTime(tempTime);
        props.handleSetTime(tempTime);
        props.handleSetPulseNum(pulseNum);
      }, pulseRate));
    // } else if(time > props.midiLength) {
    //   props.midiDispatch({type: 'mode', mode: 'keyboard'});
    //   clearInterval(date)
    //   console.error('pee')
    //   setTime(0);
    } else if (props.mode === 'keyboard' || props.mode === 'stop')  {
      clearInterval(date);
      if(time > props.midiLength || props.mode === 'stop') {
        console.log('reset timer')
        // setTime(0);
        props.handleSetPulseNum(0);
        props.handleSetTime(0);
        return;
      }
    }
    // if(time >= props.midiLength) {
    //   console.error()
    //   clearInterval(date)
    //   let timeTemp = 0;
    //   setTime(timeTemp);
    //   props.handleSetTime(timeTemp)
    // }
  }, [props.mode])
  return null;
}

export default Timer;