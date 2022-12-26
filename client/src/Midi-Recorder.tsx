import React, {useState, useEffect, useLayoutEffect, useReducer, useMemo} from 'react';
import axios from 'axios';
import MidiWriter from 'midi-writer-js';
import './Midi-Recorder.css';
import Settings from './settings-components/settings'
import SoundSettings from './settings-components/sound-settings'
import MidiSettings from './settings-components/midi-settings'
import Piano from './Piano';
import PianoRoll from './Piano-roll';

interface TimerProps {
  mode: string;
  bpm: number;
  midiLength: number;
  handleSetTime: Function;
  handleSetPulseNum: Function;
}

function Timer(props: TimerProps) {
  const [date, setDate] = useState<ReturnType<typeof setInterval>>();
  const [time, setTime] = useState(0);

  useLayoutEffect(() => {
    let ppq = 24;
    let pulseRate = 60 / props.bpm / ppq * 1000; //interval
    // 60 / 120 / 24 * 1000
    if(props.mode === 'recording') {
      let start = performance.now();
      let timeTemp = time;
      let pulseNum = 0;
      setDate(setInterval(() => {
        let expected = timeTemp + pulseRate;
        timeTemp += performance.now() - start;
        timeTemp += timeTemp - expected;
        // timeTemp -= delta;
        // console.log(timeTemp, expected)
        pulseNum++;
        // console.log(countTemp);
        start = performance.now();
        setTime(timeTemp);
        props.handleSetTime(timeTemp);
        props.handleSetPulseNum(pulseNum);
      }, pulseRate));
      // setDate(date);
    } else if (props.mode === 'keyboard')  {
      // console.error(date)
      clearInterval(date);
      if(time >= props.midiLength) setTime(0);
    }
  }, [props.mode])

  function updateTime() {
    props.handleSetTime(time);
  }

  return null;
}

// interface IPiano {
//   type: string;
//   sound: string;
//   octave: number;
//   volume: string;
// }

const useEffectOnlyOnce = (callback: Function, dependencies: any[], condition: Function) => {
  const calledOnce = React.useRef(false);

  React.useEffect(() => {
    if (calledOnce.current) {
      return;
    }

    if (condition(dependencies)) {
      callback(dependencies);

      calledOnce.current = true;
    }
  }, [callback, condition, dependencies]);
};

function pianoReducer(state: PianoState, action: any) {
  switch(action.type) {
    case 'sound':
      return {...state, sound: action.sound};
    case 'octave':
      return {...state, octave: action.octave};
    case 'volume':
      return {...state, volume: action.volume};
    default:
      return state;
  }
}

// interface IMidi {
//   type: string;
//   numMeasures: number
//   subdiv: number;
//   bpm: number;
//   mode: string;
// }

function midiReducer(state: MidiState, action: any) {
  switch(action.type) {
    case 'numMeasures':
      return {...state, numMeasures: action.numMeasures};
    case 'subdiv':
      return {...state, subdiv: action.subdiv};
    case 'bpm':
      return {...state, bpm: action.bpm};
    case 'mode':
      return {...state, mode: action.mode};
    default:
      return state;
  }
}

interface TimeAction {
  type: string;
  pulseNum: number;
}

function timeReducer(state: Object, action: TimeAction) {
  switch(action.type) {
    case 'pulseNum':
      return {...state, pulseNum: action.pulseNum};

    default:
      return state;
  }
}

type PianoState = {
  sound: string;
  octave: number;
  volume: string;
};

type MidiState = {
  numMeasures: number;
  subdiv: string;
  bpm: number;
  mode: 'recording' | 'playing' | 'keyboard';
};

type TimeState = {
  pulseNum: number;
};

type SoundDetails = {
  [key: string]: {
    fileName: string;
    displayName: string;
  };
};

function MidiRecorder() {
  const [toggle, setToggle] = useState(true);
  const [pianoState, pianoDispatch] = useReducer(pianoReducer, {sound: 'GrandPiano', octave: 3, volume: '2mf'});
  const [midiState, midiDispatch] = useReducer(midiReducer, {numMeasures: 4, subdiv: '4', bpm: 120, mode: 'keyboard'});
  const [timeState, timeStateDispatch] = useReducer(timeReducer, {pulseNum: 0})
  const [time, setTime] = useState(0);
  const [pulseNum, setPulseNum] = useState(0);
  const [midi, setMidi] = useState({});
  const [notesPlayed, setNotesPlayed] = useState({});
  const [pianoRollKey, setPianoRollKey] = useState<any[]>([]);
  const [soundDetails, setSoundDetails] = useState({});

  useEffect(() => {
    async function getSoundDetails() {
      const url = 'http://localhost:3001/api/sounds/';
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': true,
        },
      }
      var soundDetails: Object = {};
      const soundDeets = await axios.get(url, options)
        .then(res => {
          soundDetails = res.data;
          return res.data;
        }).catch(err => console.error(err));
      setSoundDetails(soundDetails);
      return soundDeets;
    }
    getSoundDetails();
  }, []);

  const calledOnce = React.useRef(false);

  useEffect(() => {
    if(calledOnce.current) return;

    if(!toggle) {
      let input = document.getElementById('key-note-input');
      let keydownE = new KeyboardEvent('keydown', {
        key: pianoRollKey[0],
        code: pianoRollKey[1]
      });
      if(input) input.dispatchEvent(keydownE);
      console.log('input', keydownE)
      calledOnce.current = true;
    }
    

    // console.error(pianoRollKey.length, pianoRollKey)
    // // if(pianoRollKey.length === 0){
    //   let input = document.getElementById('key-note-input');
    //   let keydownE = new KeyboardEvent('keydown', {
    //     key: pianoRollKey[0],
    //   });
    //   if(input) input.dispatchEvent(keydownE);
    //   console.log('input', keydownE)
    // }
  }, [toggle])

  useEffect(() => {
    if(time >= 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4) midiDispatch({type: 'mode', mode: 'keyboard'})
    // while(midiState.mode === 'recording') {
    //   setLastPulse(performance.now());
    // }
    // console.log(pianoState)
    // console.log(midiState)
  }, [time]);

  function timeKeeper() {
    let ppq = 24;
    let pulseRate = 60000 / midiState.bpm / ppq;

    if(midiState.mode === 'recording') {
      // recording(pulseRate);
    } else if (midiState.mode === 'playing')  {
      
    }
  }

  function pianoRollKeysPressed(keyPressed: any[]) {
    // console.warn('keyPressed', keyPressed)
    setToggle(false);
    setPianoRollKey(keyPressed);
    
    // setNotesPlayed((notesPlayed) => ({...notesPlayed, [keyPressed[0]]: keyPressed[1]}))
  }

  function recording() {
  }

  // function setTimer(time) {
  //   setTime(time);
  // }
  
  return (
    <>
      <div id='selectors'>
        {/* <Settings soundDetails={soundDetails} sound={pianoState.sound} octave={pianoState.octave} volume={pianoState.volume} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} pianoDispatch={pianoDispatch} midiDispatch={midiDispatch} /> */}
        <SoundSettings soundDetails={soundDetails} sound={pianoState.sound} octave={pianoState.octave} volume={pianoState.volume} pianoDispatch={pianoDispatch} />
        <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} midiDispatch={midiDispatch} />
      </div>
      <Timer mode={midiState.mode} bpm={midiState.bpm} midiLength={1000 / (midiState.bpm / 60) * midiState.numMeasures * 4} handleSetTime={setTime} handleSetPulseNum={setPulseNum} />
      <Piano soundDetails={soundDetails} sound={pianoState.sound} octave={parseInt(pianoState.octave)} volume={pianoState.volume} pianoRollKey={pianoRollKey} pianoRollNotes={notesPlayed} onNotePlayed={setNotesPlayed} />
      <PianoRoll soundDetails={soundDetails} time={time} midiLength={1000 / (midiState.bpm / 60) * midiState.numMeasures * 4} sound={pianoState.sound} octave={pianoState.octave} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} onNotePlayed={pianoRollKeysPressed} />
    </>
  )
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;