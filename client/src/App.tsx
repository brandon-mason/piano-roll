import { useState, useReducer, useEffect, useRef } from 'react'
import axios from 'axios';
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, KeysPressed, Midi } from './Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings'
import KeyNoteInput from './ToolComponents/KeyNoteInput';
import Timer from './ToolComponents/Timer';
import MidiRecorder from './MidiRecorder';
import Piano from './Piano';
import PianoRoll from './Piano-roll';
import './App.css';

// interface Reducer<State, Action> {
//   (state: State, action: Action): State;
// }

// interface SoundState {
//   sound: string;
//   octave: number;
//   volume: string;
// };

// interface SoundAction {
//   type: string;
//   sound?: string;
//   octave?: number;
//   volume?: string;
// }

function soundReducer(state: SoundState, action: any) {
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

// interface MidiState {
//   numMeasures: number;
//   subdiv: number;
//   bpm: number;
//   mode: string;
// }

// interface MidiAction {
//   type: string;
//   numMeasures?: number;
//   subdiv?: number;
//   bpm?: number;
//   mode?: string;
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

// interface KeysPressed {
//   [key: string]: {
//     octave: number;
//     pressed: boolean;
//     time: number;
//   };
// }

// interface Midi {
//   [time: number]: KeysPressed;
// }

function App() {
  const [soundDetails, setSoundDetails] = useState({});
  const [soundState, soundDispatch] = useReducer<Reducer<SoundState, SoundAction>>(soundReducer, {sound: 'GrandPiano', octave: 3, volume: '2mf'});
  const [midiState, midiDispatch] = useReducer<Reducer<MidiState, MidiAction>>(midiReducer, {numMeasures: 4, subdiv: 4, bpm: 120, mode: 'keyboard'});

  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});

  const [time, setTime] = useState(0);
  const [pulseNum, setPulseNum] = useState(0);
  const [playback, setPlayback] = useState<KeysPressed>({});

  const [pianoRollKey, setPianoRollKey] = useState<any[]>([]);
  const pianoRollKeyRef = useRef<any[] | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null);

  // const [soundDetails, setSoundDetails] = useState({});
  useEffect(() => {
    console.log(soundState)
  }, [soundState])

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

  useEffect(() => {
    console.log(pulseNum , 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
    if(time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4) midiDispatch({type: 'mode', mode: 'keyboard'})
  }, [time])

  useEffect(() => {
    if(midiState.mode === 'stop' || midiState.mode === 'keyboard') {
      let tempOutput = JSON.stringify(playback).replaceAll('true', 'false');
      setPlayback(JSON.parse(tempOutput))
    }
  }, [midiState.mode])

  function setNoteProps(controller: KeysPressed) {
    setKeysPressed(controller);
  }

  function pianoRollKeysPressed(keyPressed: any[]) {
    pianoRollKeyRef.current = keyPressed;
  }
  function handlePlayback(midi: KeysPressed) {
    setPlayback(midi);
  }

  return (
    <div className="App">
      <div id='selectors'>
        <SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} />
        <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} midiDispatch={midiDispatch} />
      </div>
      <KeyNoteInput octave={soundState.octave} onNotePlayed={setNoteProps} pianoRollKey={pianoRollKeyRef.current}/>
      <Timer mode={midiState.mode} bpm={midiState.bpm} midiLength={1000 / (midiState.bpm / 60) * midiState.numMeasures * 4} time={time} pulseNum={pulseNum} handleSetTime={setTime} handleSetPulseNum={setPulseNum} midiDispatch={midiDispatch} />
      <MidiRecorder soundDetails={soundDetails} soundState={soundState} midiState={midiState} keysPressed={keysPressed} time={pulseNum} handlePlayback={handlePlayback} soundDispatch={soundDispatch} midiDispatch={midiDispatch}/>
      <Piano soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} pianoRollKey={pianoRollKey} playback={playback} labelsRef={labelsRef} />
      <PianoRoll soundDetails={soundDetails} time={time} midiLength={1000 / (midiState.bpm / 60) * midiState.numMeasures * 4} playback={playback} sound={soundState.sound} octave={soundState.octave} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} labelsRef={labelsRef} handleNotePlayed={pianoRollKeysPressed} />
    </div>
  );
}

export default App;
