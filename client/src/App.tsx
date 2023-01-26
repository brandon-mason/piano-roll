import * as React from 'react';
import { useState, useReducer, useEffect, useRef, useMemo } from 'react'
import axios from 'axios';
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, KeysPressed, ControlsState, ControlsAction, MidiRecorded, KeyPressed } from './Tools/Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings'
import TimerButtons from './SettingsComponents/TimerButtons'
import KbFunctions from './Tools/KbFunctions'
import KeyNoteInput from './Tools/KeyNoteInputCp';
import Timer from './Tools/Timer';
import MidiRecorder from './MidiComponents/MidiRecorder';
import Piano from './PianoComponents/Piano';
import PianoRoll from './PianoComponents/PianoRoll';
import Grid from './MidiComponents/Grid';
import { ErrorBoundary } from './Tools/ErrorBoundary';
import './App.css';
import UISettings from './SettingsComponents/UISettings';
import ShowLoginModal from './LoginModal';
import SaveExport from './SettingsComponents/SaveExport';
var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

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
    case 'export':
      return {...state, export: action.export};
    case 'undo':
      return {...state, undo: action.undo};
    default:
      return state;
  }
}

function App() {
  const [soundDetails, setSoundDetails] = useState({});
  const [soundState, soundDispatch] = useReducer<Reducer<SoundState, SoundAction>>(soundReducer, {octave: 3, sound: 'GrandPiano', volume: '2mf'});
  const [midiState, midiDispatch] = useReducer<Reducer<MidiState, MidiAction>>(midiReducer, {bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 96,  subdiv: 4});
  const [controlsState, controlsDispatch] = useReducer<Reducer<ControlsState, ControlsAction>>(controlsReducer, {export: false, undo: false});
  const [octaveMinMax, setOctaveMinMax] = useState([0, 0]);
  const [controlsPressed, setControlsPressed] = useState(['', false])
  const selectorsRef = useRef(null);

  const midiLength = useMemo<number>(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
  const pulseRate = useMemo<number>(() => midiState.ppq * midiState.bpm / 60 / 1000, [midiState.bpm, midiState.ppq]); // ppq / bpm in ms
  const timerRef = useRef(null);
  const [time, setTime] = useState(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
  const [pulseNum, setPulseNum] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Map<string, KeyPressed>>(new Map());
  const [keysUnpressed, setKeysUnpressed] = useState<Map<string, KeyPressed>>(new Map());
  const [playback, setPlayback] = useState<Map<string, KeyPressed>[]>([]);
  const [metPlay, setMetPlay] = useState(false);

  const pianoRollKeyRef = useRef<any[] | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null);
  const [noteTracks, setNoteTracks] = useState<HTMLCollection | null>(null)
  const noteTracksRef = useRef(null);
  const [gridSize, setGridSize] = useState<number[]>([]);
  const [focus, setFocus] = useState(false);
  const [user, setUser] = useState('');
  const [trackName, setTrackName] = useState('');

  // const [soundDetails, setSoundDetails] = useState({});
  useEffect(() => {
    console.log(soundState.volume)
  }, [soundState.octave])

  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER)
    async function getSoundDetails() {
      const url = `${process.env.REACT_APP_API}/sounds/Instruments`;
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
    if(time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4) {
      midiDispatch({type: 'mode', mode: 'stop'});
      setTimeout(() => midiDispatch({type: 'mode', mode: 'keyboard'}));
      
    }
  }, [time])

  useEffect(() => {
    if(midiState.mode === 'stop') {
      setPulseNum(0);
      setTime(0);
      

      // setPlayback(tempPlayback)
      // setPlayback({})
    }
  }, [midiState.mode])

  useEffect(() => {
    if(midiState.mode === 'keyboard') {
      // let tempKeysPressed = {...keysPressed};
      // let tempPlayback = {...playback};

      // Object.entries(keysPressed).forEach((keyPressed) => {
      //   tempKeysPressed[keyPressed[0]] = {...keyPressed[1], end: -1}
      // })
      setKeysUnpressed(new Map);
    }
  }, [midiState.mode])

  // useEffect(() => {
  //   console.log(controlsState.export);
  //   if(controlsState.export) {
  //     if(/[a-zA-Z]/g.test(trackName)) {
  //       alert('Please name your track.')
  //     } else {
  //       console.log(midiState.mode)
  //       let pulses = Object.keys(playback)
  //       var smf = new JZZ.MIDI.SMF(0, midiState.ppq);
  //       var trk = new JZZ.MIDI.SMF.MTrk();
  //       smf.push(trk);

  //       trk.add(0, JZZ.MIDI.smfSeqName('Midi from *Working Site Name*.com'));
  //       trk.add(0, JZZ.MIDI.smfBPM(midiState.bpm));
  //       for(var i = 0; i < pulses.length; i++) {
  //         let note = Object.keys(playback[pulses[i]])[0]
  //         if(playback[pulses[i]][note].end === -1) {
  //           continue;
  //         } else {
  //           trk.add(playback[pulses[i]][note].start, JZZ.MIDI.noteOn(0, note, 70));
  //           trk.add(playback[pulses[i]][note].end, JZZ.MIDI.noteOff(0, note, 70));
  //         }
  //       }
  //       smf.dump();
  //       let element = document.createElement("a");
  //       let midiUrl = "data:audio/midi;base64," + window.btoa(smf.dump());
  //       element.setAttribute("href", midiUrl);
  //       element.setAttribute("download", `${trackName}.mid`);
  //       element.style.display = "none";
  //       document.body.appendChild(element);
  //       element.click();
  //       document.body.removeChild(element);
  //     }
  //     controlsDispatch({type: 'export', export: false});
  //   }
  // }, [controlsState.export]);

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

  function setResetPlayback(recording: KeysPressed, playbackOff: KeysPressed) {
    console.log(recording, playbackOff, midiState.mode)
    if(midiState.mode === 'playing' || midiState.mode === 'recording') {
      // setPlayback(recording)
    } else if(midiState.mode === 'stop') {
      // setPlayback(recording)
    }
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

  function setXGridSize(size: number) {
    setGridSize((gridSize) => {
      let state = [...gridSize]
      state[0] = size;
      return state;
    })
  }

  function setFocusLogin(focus: boolean) {
    setFocus(focus);
  }

  const bgSizeTrack = 100 / midiState.numMeasures;

  return (
    <div className="App" id='App'>
      <style>
        {`
        @media only screen and (min-width: 768px) {
          #midi {
            grid-template:
            'labels' 'midi' / 100px ${window.innerWidth - 100}px;
          }

            #midi-note-labels {
              max-width: 100px;
              width: 100%;
            }
            #midi-track {  
              width: calc(100% + ${gridSize[0]});
            }
        }
        `}
      </style>
      
      <div ref={selectorsRef} id='selectors'>
        {(user.length > 0) ? <span>welcome {user}</span>: <></>}
        <ShowLoginModal setFocus={setFocus} setUser={setUser} />
        <SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} />
        <MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch}/>
        <UISettings setXGridSize={setXGridSize} />
        <div ref={timerRef} id='timer-buttons'>
          <TimerButtons metPlay={metPlay} metronome={midiState.metronome} mode={midiState.mode} pulseNum={pulseNum} midiDispatch={midiDispatch} />
          <KbFunctions controlsPressed={controlsPressed} metronome={midiState.metronome} mode={midiState.mode} octaveMinMax={octaveMinMax} selectorsRef={selectorsRef} clearControls={clearControls} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} soundDispatch={soundDispatch} />
        </div>
      </div>
      <div id='midi'>
        <PianoRoll labelsRef={labelsRef} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} octave={soundState.octave} pulseNum={pulseNum} pulseRate={pulseRate} sound={soundState.sound} soundDetails={soundDetails} subdiv={midiState.subdiv} time={pulseNum} handleNotePlayed={pianoRollKeysPressed} />
        <div id='midi-track' style={{backgroundSize: `${bgSizeTrack}%`, width: `calc(100% - ${gridSize[0]})`}}>
          <Grid gridSize={gridSize} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} pulseNum={pulseNum} pulseRate={pulseRate} subdiv={midiState.subdiv} time={time} octaveArray={getOctaveArray()} setNoteTracks={setNoteTracks} />
        </div>
      </div>
      <KeyNoteInput focus={focus} octave={soundState.octave} pianoRollKey={pianoRollKeyRef.current} pulseNum={pulseNum} onControlsPressed={setControlsPressed} onNotePlayed={setKeysPressed} setKeysPressed={setKeysPressed} setKeysUnpressed={setKeysUnpressed} />
      <Timer bpm={midiState.bpm} metronome={midiState.metronome} midiLength={midiLength} time={time} timerRef={timerRef} mode={midiState.mode} ppq={midiState.ppq} pulseNum={pulseNum} pulseRate={pulseRate} handleMetPlay={metPlayed} handleSetTime={setTime} handleSetPulseNum={setPulseNum} />
      <ErrorBoundary>
        <MidiRecorder controlsState={controlsState} gridSize={gridSize} keysPressed={keysPressed} keysUnpressed={keysUnpressed} midiLength={midiLength} midiState={midiState} noteTracks={noteTracks} noteTracksRef={noteTracksRef} pulseNum={pulseNum} pulseRate={pulseRate} selectorsRef={selectorsRef} username={user} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} setFocus={setFocus} setKeysUnpressed={setKeysUnpressed} setPlayback={setPlayback} setTrackName={setTrackName} />
      </ErrorBoundary>
      <Piano pulseNum={pulseNum} soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} octaveMinMax={octaveMinMax} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} keysUnpressed={keysUnpressed} playback={playback} labelsRef={labelsRef} />
    </div>
  );
}

export default App;
