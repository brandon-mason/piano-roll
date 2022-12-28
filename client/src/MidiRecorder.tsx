import React, {useState, useEffect, useLayoutEffect, useRef, useReducer, useMemo, RefObject} from 'react';
import { MidiRecord, KeysPressed, MidiRecorderProps, obj } from './Interfaces';
import axios from 'axios';
import MidiWriter from 'midi-writer-js';
import './MidiRecorder.css';
import Settings from './SettingsComponents/Settings'
import KeyNoteInput from './ToolComponents/KeyNoteInput';
import Piano from './Piano';
import PianoRoll from './Piano-roll';
const qwertyNote = require('./note-to-qwerty-key-obj');

// interface MidiRecord {
//   [time: number]: KeysPressed;
// }

// interface KeysPressed {
//   [key: string]: {
//     octave: number;
//     pressed: boolean;
//     time: number;
//   };
// };

// interface MidiRecorderProps {
//   soundDetails: {
//     [key: string]: {
//       fileName: string;
//       displayName: string;
//     }
//   }
//   soundState: {
//     sound: any;
//     octave: number;
//     volume: string;
//   };
//   midiState: {
//     numMeasures: any;
//     subdiv: number;
//     bpm: number;
//     mode: string;
//   }
//   keysPressed: KeysPressed;
//   time: number;
//   handlePlayback: Function;
//   soundDispatch: React.Dispatch<any>;
//   midiDispatch: React.Dispatch<any>;
// }

// interface obj {
//   [time: number]: KeysPressed;
// }

function MidiRecorder(props: MidiRecorderProps) {
  const [pianoRollKey, setPianoRollKey] = useState<any[]>([]);
  const [midiRecord, setMidiRecord] = useState<MidiRecord>([]);
  const calledOnce = React.useRef(false);
  const labelsRef = React.useRef<HTMLDivElement>(null);
  const pianoRollKeyRef = React.useRef<any[] | null>(null)

  useEffect(() => {
    console.log(midiRecord)
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
      let obj: obj = [];
      let kpKeys = Object.keys(props.keysPressed);

      setMidiRecord((midiRecord) => ({...midiRecord, [props.time]: props.keysPressed}));
    }

    const playing = () => {
      console.log('midiRecord', midiRecord)
      Object.keys(midiRecord).forEach((timeKey) => {
        console.log(props.time === parseInt(timeKey), props.midiState.mode)
        if(props.time === parseInt(timeKey)) {
          
          props.handlePlayback(midiRecord[parseInt(timeKey)])
        }
      })
      
    }

    let pulseRate = 60 / props.midiState.bpm / 24 * 1000;
    let midiLength = 1000 / (props.midiState.bpm / 60) * props.midiState.numMeasures * 4;
    if(props.time >= midiLength / pulseRate) props.midiDispatch({type: 'mode', mode: 'keyboard'})

    if(props.midiState.mode === 'stop') {
      props.midiDispatch({type: 'mode', mode: 'keyboard'});
    } else if(props.midiState.mode === 'recording' && props.keysPressed) {
      recording();
    } else if(props.midiState.mode === 'playing' && props.keysPressed) {
      playing();
    }

    // while(midiState.mode === 'recording') {
    //   setLastPulse(performance.now());
    // }
    // console.log(pianoState)
    // console.log(midiState)
  }, [props.keysPressed, props.midiState.mode]);

  useLayoutEffect(() => {
    const playing = () => {
      console.log('midiRecord', midiRecord)
      Object.keys(midiRecord).forEach((timeKey) => {
        console.log(props.time === parseInt(timeKey), props.midiState.mode)
        if(props.time === parseInt(timeKey)) {
          
          props.handlePlayback(midiRecord[parseInt(timeKey)])
        }
      })
      
    }

    if(props.midiState.mode === 'playing' && props.keysPressed) {
      playing();
    }
  }, [props.time, props.midiState.mode]);


  function initMidiRecord(keysPressed1: MidiRecord) {
    // console.log(keysPressed1)
    // keysPressed.current = keysPressed1
  }

  function pianoRollKeysPressed(keyPressed: any[]) {
    console.log()
    // setToggle(false);
    pianoRollKeyRef.current = keyPressed;
  }

  function recordNote() {

  }

  // function setTimer(time) {
  //   setTime(time);
  // }
  
  
  return (
    <>
      {/* <div id='selectors'> */}
        {/* <SoundSettings soundDetails={soundDetails} sound={pianoState.sound} octave={pianoState.octave} volume={pianoState.volume} pianoDispatch={pianoDispatch} /> */}
        {/* <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} midiDispatch={midiDispatch} /> */}
      {/* </div> */}
      {/* <Timer mode={midiState.mode} bpm={midiState.bpm} midiLength={1000 / (midiState.bpm / 60) * midiState.numMeasures * 4} handleSetTime={setTime} handleSetPulseNum={setPulseNum} /> */}
    </>
  )
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;