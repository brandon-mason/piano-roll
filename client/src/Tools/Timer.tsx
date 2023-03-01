import React, {useState, useEffect} from 'react';
import { TimerProps, MetronomeProps } from './Interfaces';
import {Howl, Howler} from 'howler';
// import { createPortal } from 'react-dom';

function Metronome(props: MetronomeProps) {
  const [metronome, setMetronome] = useState<Howl>()

  useEffect(() => {
    const met = new Howl({
      src: [`${process.env.REACT_APP_SERVER}/sounds/Metronome/metronome.webm`, `${process.env.REACT_APP_SERVER}/sounds/Metronome/metronome.mp3`],
        sprite: {
          firstBeat: [0, 10],
          beat: [10,10]
        }
      })
      setMetronome(met)
  }, [])
    
  useEffect(() => {
    if(props.pulseNum >= props.midiLength * props.pulseRate) {
      return;
    }
    if(metronome && props.mode != 'keyboard' && props.mode != 'stop' && props.metronome === 'on' ) {
      if(props.pulseNum % (props.ppq * 2) === 0) { 
        props.handleMetPlay(true)
      } else if(props.pulseNum % props.ppq === 0) {
        props.handleMetPlay(false)
      }
      if(props.pulseNum % (props.ppq * 4) === 0) {
        metronome.play('firstBeat');
      } else if(props.pulseNum % props.ppq === 0) {
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
    if(props.mode === 'recording' || props.mode === 'playing') {
      let start = performance.now();
      let tempTime = props.time;
      let pulseNum = props.pulseNum; 
      setDate(setInterval(() => {
        let expected = tempTime + 1 / props.pulseRate;
        tempTime += performance.now() - start;
        tempTime += tempTime - expected;
        tempTime = Math.round(tempTime);
        if(tempTime % props.pulseRate < 5) pulseNum++;
        start = performance.now();
        props.handleSetTime(tempTime);
        props.handleSetPulseNum(pulseNum);
      }, 1 / props.pulseRate));
    } else if (props.mode === 'keyboard' || props.mode === 'stop')  {
      clearInterval(date);
      if(props.pulseNum >= props.midiLength * props.pulseRate || props.mode === 'stop') {
        return;
      }
    }
  }, [props.mode])

  function metPlay(dut: boolean) {
    props.handleMetPlay(dut);
  }

  return <Metronome metronome={props.metronome} midiLength={props.midiLength} mode={props.mode} ppq={props.ppq} pulseNum={props.pulseNum} pulseRate={props.pulseRate} handleMetPlay={metPlay} />
}

export default Timer;