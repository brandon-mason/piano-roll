import { useState, useReducer, useEffect, useRef, useMemo } from 'react'
import axios from 'axios';
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, KeysPressed } from './Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings'
import TimerButtons from './SettingsComponents/TimerButtons'
import KbFunctions from './ToolComponents/KbFunctions'
import KeyNoteInput from './ToolComponents/KeyNoteInput';
import Timer from './ToolComponents/Timer';
import MidiRecorder from './MidiRecorder';
import Piano from './Piano';
import PianoRoll from './PianoRoll';
import Grid from './Grid';
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

function App() {
  const [soundDetails, setSoundDetails] = useState({});
  const [soundState, soundDispatch] = useReducer<Reducer<SoundState, SoundAction>>(soundReducer, {octave: 3, sound: 'GrandPiano', volume: '2mf'});
  const [midiState, midiDispatch] = useReducer<Reducer<MidiState, MidiAction>>(midiReducer, {bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 32,  subdiv: 4});
  const [octaveMinMax, setOctaveMinMax] = useState([0, 0]);
  const [controlsPressed, setControlsPressed] = useState('')
  const selectorsRef = useRef(null);;
  const ppq = 24;

  const midiLength = useMemo<number>(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
  const pulseRate = useMemo<number>(() => midiState.ppq * midiState.bpm / 60 / 1000, [midiState.bpm, midiState.ppq]); // ppq / bpm in ms
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
    // console.error(midiState)
  }, [midiState])

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
      setPlayback(JSON.parse(tempPlayback))
    }
  }, [midiState.mode])

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
    setControlsPressed('');
  }

  const bgSizeTrack = 100 / midiState.numMeasures;

  return (
    <div className="App">
      <div ref={selectorsRef} id='selectors'>
        <SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} />
        <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} midiDispatch={midiDispatch} />
        <TimerButtons metPlay={metPlay} metronome={midiState.metronome} mode={midiState.mode} pulseNum={pulseNum} midiDispatch={midiDispatch} />
        <KbFunctions controlsPressed={controlsPressed} metronome={midiState.metronome} mode={midiState.mode} octaveMinMax={octaveMinMax} selectorsRef={selectorsRef} clearControls={clearControls}midiDispatch={midiDispatch} soundDispatch={soundDispatch} />
      </div>
      <div id='midi' >
        <PianoRoll labelsRef={labelsRef} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} octave={soundState.octave} playback={playback} pulseNum={pulseNum} pulseRate={pulseRate} sound={soundState.sound} soundDetails={soundDetails} subdiv={midiState.subdiv} time={pulseNum} handleNotePlayed={pianoRollKeysPressed} />
        <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>
          <Grid octaveArray={getOctaveArray()} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} setNoteTracks={setNoteTracks} />
        </div>
      </div>
      <KeyNoteInput octave={soundState.octave} pianoRollKey={pianoRollKeyRef.current} pulseNum={pulseNum} onControlsPressed={setControlsPressed} onNotePlayed={setKeysPressed} />
      <Timer bpm={midiState.bpm} metronome={midiState.metronome} midiLength={midiLength} time={time} mode={midiState.mode} ppq={ppq} pulseNum={pulseNum} pulseRate={pulseRate} handleMetPlay={metPlayed} handleSetTime={setTime} handleSetPulseNum={setPulseNum} midiDispatch={midiDispatch} />
      <MidiRecorder soundDetails={soundDetails} midiState={midiState} keysPressed={keysPressed} midiLength={midiLength} pulseNum={pulseNum} pulseRate={pulseRate} noteTracks={noteTracks} noteTracksRef={noteTracksRef} setPlayback={setPlayback} soundDispatch={soundDispatch} midiDispatch={midiDispatch}/>
      <Piano soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} octaveMinMax={octaveMinMax} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} pianoRollKey={pianoRollKey} playback={playback} labelsRef={labelsRef} />
    </div>
  );
}

export default App;
