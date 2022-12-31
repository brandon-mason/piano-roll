import React, {useState, useEffect, useLayoutEffect, useRef, useReducer, useMemo, RefObject} from 'react';
import { MidiRecord, KeysPressed, MidiRecorderProps } from './Interfaces';
import axios from 'axios';
import MidiWriter from 'midi-writer-js';
// import MidiNotes from './MidiNotes';
import MidiNotes from './MidiNotes';
import './MidiRecorder.css';
const qwertyNote = require('./note-to-qwerty-key-obj');
// replace midistate prop with mode prop

function MidiRecorder(props: MidiRecorderProps) {
  const [pianoRollKey, setPianoRollKey] = useState<any[]>([]);
  const [midiRecord, setMidiRecord] = useState<MidiRecord>([]);
  const calledOnce = React.useRef(false);
  const labelsRef = React.useRef<HTMLDivElement>(null);
  const pianoRollKeyRef = React.useRef<any[] | null>(null)

  useEffect(() => {
    // console.log(midiRecord)
  }, [midiRecord])

  useLayoutEffect(() => {

  }, [props.midiState.mode])

  // Send first keyboard event to Piano component
  // useEffect(() => {
  //   if(calledOnce.current) return;

  //   if(!toggle) {
  //     let input = document.getElementById('key-note-input');
  //     let keydownE = new KeyboardEvent('keydown', {
  //       key: pianoRollKey[0],
  //       code: pianoRollKey[1]
  //     });
  //     if(input) input.dispatchEvent(keydownE);
  //     calledOnce.current = true;
  //   }
  // }, [toggle])

  

  useLayoutEffect(() => {
    const recording = () => {
      setMidiRecord((midiRecord) => ({...midiRecord, [props.pulseNum]: props.keysPressed}));
    }

    const playing = () => {
      // console.log('midiRecord', midiRecord)
      Object.keys(midiRecord).forEach((timeKey) => {
        // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
        if(props.pulseNum === parseInt(timeKey)) {
          props.setPlayback(midiRecord[parseInt(timeKey)])
        }
      })
    }

    if(props.pulseNum >= props.midiLength * props.pulseRate) props.midiDispatch({type: 'mode', mode: 'keyboard'})

    if(props.midiState.mode === 'stop') {
      props.midiDispatch({type: 'mode', mode: 'keyboard'});
    } else if(props.midiState.mode === 'recording' && props.keysPressed) {
      recording();
    } else if(props.midiState.mode === 'playing' && props.keysPressed) {
      playing();
    }
  }, [props.keysPressed, props.midiState.mode]);

  useLayoutEffect(() => {
    const playing = () => {
      // console.log('midiRecord', midiRecord)
      Object.keys(midiRecord).forEach((timeKey) => {
        // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
        if(props.pulseNum === parseInt(timeKey)) {
          props.setPlayback(midiRecord[parseInt(timeKey)])
        }
      })
    }
    if(props.midiState.mode === 'playing' && props.keysPressed) {
      playing();
    }
  }, [props.pulseNum, props.midiState.mode]);
  
  return <MidiNotes keysPressed={props.keysPressed} midiLength={props.midiLength} midiRecord={midiRecord} midiState={props.midiState} pulseNum={props.pulseNum} pulseRate={props.pulseRate} noteTracksRef={props.noteTracksRef} />
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;