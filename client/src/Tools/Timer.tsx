import React, {useState, useEffect} from 'react';
import { TimerProps, MetronomeProps } from './Interfaces';
import {Howl, Howler} from 'howler';
import { createPortal } from 'react-dom';

function Metronome(props: MetronomeProps) {
  const [metronome, setMetronome] = useState<Howl>()
  const [metPlayed, setMetPlayed] = useState(false);

  useEffect(() => {
    // if(props.pulseNum % 48 === 0) {
    //   setMetPlayed(metPlayed);
    // } else if(props.pulseNum % 24 === 0) {
    //   setMetPlayed(!metPlayed);
    // }
  }, [props.pulseNum, props.mode, props.metronome])

  useEffect(() => {
    const met = new Howl({
      src: ['http://localhost:3001/sounds/Metronome/metronome.webm', 'https://localhost:3001/sounds/Metronome/metronome.mp3'],
        sprite: {
          firstBeat: [0, 10],
          beat: [10,10]
        },
        // onplay: () => setMetPlayed(!metPlayed)
      })
      setMetronome(met)
  }, [])
    
  useEffect(() => {
    if(props.pulseNum >= props.midiLength * props.pulseRate) {
      return;
    }
    if(metronome && props.mode != 'keyboard' && props.metronome === 'on' ) {
      if(props.pulseNum % (props.ppq * 2) === 0) { 
        // setMetPlayed(metPlayed);
        props.handleMetPlay(true)
      } else if(props.pulseNum % props.ppq === 0) {
        // setMetPlayed(!metPlayed);
        props.handleMetPlay(false)
      }
      if(props.pulseNum % (props.ppq * 4) === 0) {
        console.error('met');
        metronome.play('firstBeat');
      } else if(props.pulseNum % props.ppq === 0) {
        console.error('met');
        metronome.play('beat');
      }
    }
  }, [props.pulseNum, props.mode, props.metronome])

  return null;
}

function Timer(props: TimerProps) {
  const [date, setDate] = useState<ReturnType<typeof setInterval>>();

  useEffect(() => {
  }, [props.pulseNum])

  useEffect(() => {
    // let pulseRate = 60 / props.bpm / props.ppq * 1000; //interval
    if(props.mode === 'recording' || props.mode === 'playing') {
      let start = performance.now();
      let tempTime = props.time;
      let pulseNum = props.pulseNum; 
      setDate(setInterval(() => {
        let expected = tempTime + 1 / props.pulseRate;
        tempTime += performance.now() - start;
        tempTime += tempTime - expected;
        tempTime = Math.round(tempTime)
        pulseNum = Math.round(tempTime * props.pulseRate);
        start = performance.now();
        props.handleSetTime(tempTime);
        props.handleSetPulseNum(pulseNum);
      }, 1 / props.pulseRate));
    } else if (props.mode === 'keyboard' || props.mode === 'stop')  {
      clearInterval(date);
      if(props.pulseNum >= props.midiLength * props.pulseRate || props.mode === 'stop') {
        console.log('reset timer')
        props.handleSetPulseNum(0);
        props.handleSetTime(0);
        return;
      }
    }
  }, [props.mode])

  function metPlay(dut: boolean) {
    props.handleMetPlay(dut);
  }

  return (
    <>
      {(props.timerRef.current) ? createPortal(<input readOnly={true} value={props.time/1000}></input>, props.timerRef.current) : null}
      <Metronome metronome={props.metronome} midiLength={props.midiLength} mode={props.mode} ppq={props.ppq} pulseNum={props.pulseNum} pulseRate={props.pulseRate} handleMetPlay={metPlay} />
    </>
  )
}

export default Timer;