import { useState, useReducer, useEffect, useRef, useMemo } from 'react'
import axios from 'axios';
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, KeysPressed, ControlsState, ControlsAction } from './Tools/Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings'
import TimerButtons from './SettingsComponents/TimerButtons'
import KbFunctions from './Tools/KbFunctions'
import KeyNoteInput from './Tools/KeyNoteInput';
import Timer from './Tools/Timer';
import MidiRecorder from './MidiComponents/MidiRecorder';
import Piano from './PianoComponents/Piano';
import PianoRoll from './PianoComponents/PianoRoll';
import Grid from './MidiComponents/Grid';
import { ErrorBoundary } from './Tools/ErrorBoundary';

import './App.css';

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

function midiReducer(state: MidiState, action: any) {
  switch(action.type) {
    case 'numMeasures':
      return {...state, numMeasures: action.numMeasures};
    case 'subdiv':
      return {...state, subdiv: action.subdiv};
    case 'bpm':
      return {...state, bpm: action.bpm};
    case 'metronome':
      return {...state, metronome: action.metronome};
    case 'mode':
      return {...state, mode: action.mode};
    default:
      return state;
  }
}

function controlsReducer(state: ControlsState, action: any) {
  switch(action.type) {
    case 'undo':
      return {...state, undo: action.undo};
    default:
      return state;
  }
}

function App() {
  const [soundDetails, setSoundDetails] = useState({});
  const [soundState, soundDispatch] = useReducer<Reducer<SoundState, SoundAction>>(soundReducer, {octave: 3, sound: 'GrandPiano', volume: '2mf'});
  const [midiState, midiDispatch] = useReducer<Reducer<MidiState, MidiAction>>(midiReducer, {bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 32,  subdiv: 4});
  const [controlsState, controlsDispatch] = useReducer<Reducer<ControlsState, ControlsAction>>(controlsReducer, {undo: false});
  const [octaveMinMax, setOctaveMinMax] = useState([0, 0]);
  const [controlsPressed, setControlsPressed] = useState(['', false])
  const selectorsRef = useRef(null);

  const midiLength = useMemo<number>(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
  const pulseRate = useMemo<number>(() => midiState.ppq * midiState.bpm / 60 / 1000, [midiState.bpm, midiState.ppq]); // ppq / bpm in ms
  const timerRef = useRef(null);
  const noteUnpressedRef = useRef<string[]>([]);
  const [time, setTime] = useState(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
  const [pulseNum, setPulseNum] = useState(0);
  const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  const [playback, setPlayback] = useState<KeysPressed>({});
  const [metPlay, setMetPlay] = useState(false);

  const [pianoRollKey, setPianoRollKey] = useState<any[]>([]);
  const pianoRollKeyRef = useRef<any[] | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null);
  const [noteTracks, setNoteTracks] = useState<HTMLCollection | null>(null)
  const noteTracksRef = useRef(null);

  // const [soundDetails, setSoundDetails] = useState({});
  useEffect(() => {
    console.log(keysPressed)
  }, [keysPressed])

  useEffect(() => {
    async function getSoundDetails() {
      const url = 'http://localhost:3001/api/sounds/Instruments';
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
    if(Object.keys(soundDetails).length > 0) {
      let octavesArray = Object.keys(soundDetails[soundState.sound as keyof typeof soundDetails]);
      let octaveNums: number[] = [];
      octavesArray.forEach((octave) => {
        octaveNums.push(parseInt(octave));
      });
      let result: number[] = [Math.min(...octaveNums) + 1, Math.max(...octaveNums) + 1]; 
      setOctaveMinMax(result);
    }
  }, [soundDetails]);

  useEffect(() => {
    // console.log(pulseNum , 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
    if(time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4) midiDispatch({type: 'mode', mode: 'keyboard'})
  }, [time])

  useEffect(() => {
    if(midiState.mode === 'stop' || midiState.mode === 'keyboard') {
      let tempPlayback = JSON.stringify(playback).replaceAll('true', 'false');
      // console.log(tempPlayback)
      // setPlayback(JSON.parse(tempPlayback))
      setPlayback({});
      setKeysPressed({});
    }
  }, [midiState.mode])

  // useEffect(() => {
  //   if(Object.keys(keysPressed).length > 0) {
  //     setKeysPressed((keysPressed) => {
  //       let state = {...keysPressed};
  //       // let unpressed = ;
  //       getUnpressed().forEach((noteOct) => setTimeout(() => delete state[noteOct], 100));
  //       console.log(state)
  //       return state;
  //     })
  //   }
  // }, [keysPressed])

  function getUnpressed(): string[] {
    let pressed: string[] = []
    Object.keys(keysPressed).forEach((noteOct) => {
      if(Object.values(keysPressed[noteOct]).includes(false)) {
        pressed.push(noteOct);
      }
    })
    console.log(pressed)
    return pressed;
  }

  function getOctaveArray() {
    let octaveArray: number[] = []
    Object.keys(soundDetails).some((key) => {
      if(key === soundState.sound) {
        Object.keys(soundDetails[key as keyof typeof soundDetails]).forEach((octave) => {
          octaveArray.push(parseInt(octave))
        })
      }
    })
    return octaveArray;
  }

  function pianoRollKeysPressed(keyPressed: any[]) {
    pianoRollKeyRef.current = keyPressed;
  }

  function metPlayed(dut: boolean) {
    setMetPlay(dut);
  }

  function clearControls() {
    setControlsPressed(['', false]);
  }

  const bgSizeTrack = 100 / midiState.numMeasures;

  return (
    <div className="App">
      <div ref={selectorsRef} id='selectors'>
        <SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} />
        <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} />
        <div ref={timerRef} id='timer-buttons'>
          <TimerButtons metPlay={metPlay} metronome={midiState.metronome} mode={midiState.mode} pulseNum={pulseNum} midiDispatch={midiDispatch} />
          <KbFunctions controlsPressed={controlsPressed} metronome={midiState.metronome} mode={midiState.mode} octaveMinMax={octaveMinMax} selectorsRef={selectorsRef} clearControls={clearControls} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} soundDispatch={soundDispatch} />
        </div>
      </div>
      <div id='midi' >
        <PianoRoll labelsRef={labelsRef} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} octave={soundState.octave} pulseNum={pulseNum} pulseRate={pulseRate} sound={soundState.sound} soundDetails={soundDetails} subdiv={midiState.subdiv} time={pulseNum} handleNotePlayed={pianoRollKeysPressed} />
        <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>
          <Grid octaveArray={getOctaveArray()} noteTracksRef={noteTracksRef} midiLength={midiLength} numMeasures={midiState.numMeasures} pulseNum={pulseNum} pulseRate={pulseRate}  subdiv={midiState.subdiv} setNoteTracks={setNoteTracks} />
        </div>
      </div>
      <KeyNoteInput octave={soundState.octave} pianoRollKey={pianoRollKeyRef.current} pulseNum={pulseNum} onControlsPressed={setControlsPressed} onNotePlayed={setKeysPressed} />
      <Timer bpm={midiState.bpm} metronome={midiState.metronome} midiLength={midiLength} time={time} timerRef={timerRef} mode={midiState.mode} ppq={midiState.ppq} pulseNum={pulseNum} pulseRate={pulseRate} handleMetPlay={metPlayed} handleSetTime={setTime} handleSetPulseNum={setPulseNum} />
      <ErrorBoundary>
        <MidiRecorder soundDetails={soundDetails} controlsState={controlsState} keysPressed={keysPressed} midiLength={midiLength} midiState={midiState} pulseNum={pulseNum} noteTracks={noteTracks} noteTracksRef={noteTracksRef} pulseRate={pulseRate} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} setPlayback={setPlayback} soundDispatch={soundDispatch} />
      </ErrorBoundary>
      <Piano pulseNum={pulseNum} soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} octaveMinMax={octaveMinMax} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} playback={playback} labelsRef={labelsRef} />
    </div>
  );
}

export default App;
