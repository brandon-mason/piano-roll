import React, { useState, useReducer, useEffect, useRef, useMemo, useCallback } from 'react';
// import { useState, useReducer, useEffect, useRef, useMemo, useCallback } from 'react'
import axios from 'axios';
import { Reducer, SoundState, SoundAction, MidiState, MidiAction, KeysPressed, ControlsState, ControlsAction, MidiRecorded, KeyPressed, MidiNoteInfo } from './Tools/Interfaces';
import SoundSettings from './SettingsComponents/SoundSettings/SoundSettings'
import MidiSettings from './SettingsComponents/MidiSettings/MidiSettings'
import TimerButtons from './SettingsComponents/TimerButtons/TimerButtons'
import KbFunctions from './Tools/KbFunctions/KbFunctions'
import KeyNoteInput from './Tools/KeyNoteInput/KeyNoteInput';
import Timer from './Tools/Timer/Timer';
import MidiRecorder from './MidiComponents/MidiRecorder/MidiRecorder';
import Piano from './PianoComponents/Piano/Piano';
import PianoRoll from './PianoComponents/PianoRoll/PianoRoll';
import Grid from './MidiComponents/Grid/Grid';
import { ErrorBoundary } from './Tools/ErrorBoundary/ErrorBoundary';
import UISettings from './SettingsComponents/UISettings/UISettings';
import ShowLoginModal from './SettingsComponents/LoginModal/LoginModal';
import SaveExport from './SettingsComponents/SaveExport/SaveExport';
import { FaCircle, FaInfoCircle, FaPlay, FaRegCircle, FaStop, FaTimesCircle } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import './App.css';
var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);

/*
  Modifies the attributes of the sound output.
*/
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

/*
  Modifies the attributes of the grid.
*/
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

/*
  Modifies the attributes of the input and output.
*/
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
  const midiLength = useMemo<number>(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
  const pulseRate = useMemo<number>(() => midiState.ppq * (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.ppq]); // ppq * bpm in ms

  const [midiNoteInfo, setMidiNoteInfo] = useState<MidiNoteInfo[]>([]);
  const [username, setUsername] = useState('');
  const [octaveMinMax, setOctaveMinMax] = useState([0, 0]);
  const [time, setTime] = useState(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
  const [pulseNum, setPulseNum] = useState(0);
  const [keysPressed, setKeysPressed] = useState<Map<string, KeyPressed>>(new Map());
  const [keysUnpressed, setKeysUnpressed] = useState<Map<string, KeyPressed>>(new Map());
  const [gridSize, setGridSize] = useState<number[]>([]);
  
  const [dbLoaded, setDbLoaded] = useState<boolean>(true);
  const [playback, setPlayback] = useState<Map<string, KeyPressed>[]>([]);
  const [metPlay, setMetPlay] = useState(false);
  const [controlsPressed, setControlsPressed] = useState<(string | boolean)[]>(['', false]);
  const [focus, setFocus] = useState(false);
  const [selectorsHeight, setSelectorsHeight] = useState<number>();
  const [trackName, setTrackName] = useState('');
  const [menuShown, setMenuShown] = useState('');
  const [infoModal, setInfoModal] = useState<React.ReactPortal | null>();
  const selectorsRef = useRef<HTMLDivElement>(null);
  const noteTracksRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const timeSliderRef = useRef<HTMLInputElement>(null);
  const pianoRollKeyRef = useRef<any[] | null>(null)
  const labelsRef = useRef<HTMLDivElement>(null);

  /*
    Checks if the database is available and loaded.
    This lets the app know whether or not to allow logins.
  */
  useEffect(() => {
    (async () => {
      const url = `${process.env.REACT_APP_API}/db-loaded`;
      const options = {
        method: 'GET',
        // headers: {
        //   'Content-Type': 'application/json',
        // }
      }

      await axios.get(url, options)
      .then(res => {
        setDbLoaded(res.data.dbLoaded);
      })
    })();

    const isLoggedIn = async () => {
      const url = `${process.env.REACT_APP_API}/logged-in`;
      const options = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': true,
        },
        token: window.localStorage.getItem('token'),
      }
      await axios.post(url, options)
      .then(res => {
        setUsername(res.data.username)
      }).catch((err) => console.error(err))
    };

    if(window.localStorage.getItem('loggedIn') === 'true') {
      isLoggedIn();
    } else if(window.innerWidth > 500){
      info();
    }

    setXGridSize(0);
    setYGridSize(0);

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

  /*
    Updates the number of octaves available when the selected instrument changes.
  */
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

  /*
    Runs everytime the grid time changes.
    Checks if playback has reached the end of the track.
    Controls what keys are detected as pressed during playback.
  */
  useEffect(() => {
    if(pulseNum === midiLength * pulseRate) {
      midiDispatch({type: 'mode', mode: 'keyboard'});
    }
    if(playback[pulseNum]) {
      let entries = Object.fromEntries(playback[pulseNum])

      Object.keys(entries).forEach((key) => {
        if(entries[key].end !== -1) {
          setKeysUnpressed((keysUnpressed: Map<string, KeyPressed>) => {
            let state = new Map(keysUnpressed);

            state.set(key, entries[key])
            return state;
          });
        }
        if(pulseNum - entries[key].end > 1) {
          setKeysUnpressed((keysUnpressed: Map<string, KeyPressed>) => {
            let state = new Map(keysUnpressed);

            state.delete(key);
            return state;
          });
        } 
      });
    }
  }, [pulseNum])

  /*
    Controls what happens when the playing state changes..
  */
  useEffect(() => {
    if(pulseNum === midiLength * pulseRate && (midiState.mode === 'playing' || midiState.mode === 'recording')) {
      let mode = midiState.mode;

      midiDispatch({type: 'mode', mode: 'stop'}); 
      setTimeout(() => midiDispatch({type: 'mode', mode: mode}), 2);
    }
    if(midiState.mode === 'stop') {
      setPulseNum(0);
      setTime(0);
      

      // setPlayback(tempPlayback)
      // setPlayback({})
    }
    if(midiState.mode === 'keyboard') {
      setKeysUnpressed(new Map());
    }
  }, [midiState.mode]);

  useEffect(() => {
    if(selectorsRef.current) {
      const selResizeObserver = new ResizeObserver((entries) => {
        setSelectorsHeight(entries[0].contentRect.height)
      });
      selResizeObserver.observe(selectorsRef.current)
      return () => selResizeObserver.disconnect();
    }
  }, []);

  /*
    Runs when the user chooses to export a track.
  */
  useEffect(() => {
    if(controlsState.export) {
      if(!/[a-zA-Z]/g.test(trackName)) {
        alert('Please name your track.')
      } else {
        let pulses = Object.keys(playback)
        var smf = new JZZ.MIDI.SMF(0, midiState.ppq);
        var trk = new JZZ.MIDI.SMF.MTrk();
        smf.push(trk);
        trk.add(0, JZZ.MIDI.smfSeqName('Midi from *Working Site Name*.com'));
        trk.add(0, JZZ.MIDI.smfBPM(midiState.bpm));
        for(var i = 0; i < pulses.length; i++) {
          Array.from(playback[parseInt(pulses[i])].keys()).forEach((note) => {
            if(playback[parseInt(pulses[i])].get(note)!.end === -1) {
              return;
            } else {
              trk.add(playback[parseInt(pulses[i])].get(note)!.start, JZZ.MIDI.noteOn(0, note, 70));
              trk.add(playback[parseInt(pulses[i])].get(note)!.end, JZZ.MIDI.noteOff(0, note, 70));
            }
          })
        }
        smf.dump();
        let element = document.createElement("a");
        let midiUrl = "data:audio/midi;base64," + window.btoa(smf.dump());
        element.setAttribute("href", midiUrl);
        element.setAttribute("download", `${trackName}.mid`);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
      controlsDispatch({type: 'export', export: false});
    }
  }, [controlsState.export]);

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

  /*
    Sets the state of the metronome.
  */
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
  function setYGridSize(size: number) {
    setGridSize((gridSize) => {
      let state = [...gridSize]
      state[1] = size;
      return state;
    })
  }

  /*
    Renders information modal.
  */
  function info() {
    var picked = 'none';

    closeInfo()
    function closeInfo() {
      if(picked === 'none') {
        setInfoModal(createPortal(
          <>
          <div id='popup-bg'>
          <div id='popup-info' className='info'>
            {/* <div id='popup-info' className='' style={{zIndex: 11}}> */}
              <button type='button' className='popup-button info close'
                onClick={() => {
                  picked = 'new';
                  document.getElementById('popup-bg')!.classList.toggle('lift-out');
                  document.getElementById('popup-info')!.classList.toggle('lift-out');
                  setTimeout(() => setInfoModal(null), 500);
                }}
              >X</button>

              <div className='keyboard'>
                <div className='top-row'>
                  <span className='key'>Key:w<br></br>Note:C#</span>
                  <span className='key'>Key:e<br></br>Note:Eb</span>
                  <span className='key hidden'></span>
                  <span className='key'>Key:t<br></br>Note:F#</span>
                  <span className='key'>Key:y<br></br>Note:G#</span>
                  <span className='key'>Key:u<br></br>Note:Bb</span>
                  <span className='key hidden'></span>
                  <span className='key'>Key:o<br></br>Note:C#</span>
                </div>
                <div className='bottom-row'>
                  <span className='key'>Key:a<br></br>Note:C</span>
                  <span className='key'>Key:s<br></br>Note:D</span>
                  <span className='key'>Key:d<br></br>Note:E</span>
                  <span className='key'>Key:f<br></br>Note:F</span>
                  <span className='key'>Key:g<br></br>Note:G</span>
                  <span className='key'>Key:h<br></br>Note:A</span>
                  <span className='key'>Key:j<br></br>Note:B</span>
                  <span className='key'>Key:k<br></br>Note:C</span>
                  <span className='key'>Key:l<br></br>Note:D</span>
                </div>
              </div>
              <br />
              <br />
              <div className='info-text-container'>
                <span className='info-text'>Double click <FaCircle style={{verticalAlign: 'middle'}} />(or press 'n') to record what you play using the keys below.</span>
                <br />
                <span className='info-text'>Click <FaPlay style={{verticalAlign: 'middle'}} />(or press 'spacebar') to play what you've recorded.</span>
                <br />
                <span className='info-text'>Click <FaStop style={{verticalAlign: 'middle'}} />(or press 'b') to return the timer to 0.00s and to save your track to localStorage.</span>
                <br />
                <span className='info-text'>Click <FaRegCircle style={{verticalAlign: 'middle'}} /><FaCircle style={{verticalAlign: 'middle'}} />(or press 'm') to turn on the metronome.</span>
                <br />
                <span className='info-text'>Click any box in the grid to add a note.</span>
                <br />
                <span className='info-text'>Click the horizontal black line at the top of the grid to scrub through the time.</span>
                <br />
                <span className='info-text'>Hold ctrl/cmd and click and drag on a note to move its ending.</span>
                <br />
                <span className='info-text'>Hold shift and click and drag on a note to move its start.</span>
                <br />
                <span className='info-text'>Hold both ctrl/cmd + shift and click and drag on a note to move the note.</span>
                <br />
              </div>
            </div>
          </div></>, document.body))
      }
    }
  }
  
  const bgSizeTrack = 100 / midiState.numMeasures;

  return (
      <div className="App" id='App'>
        <style>
          {`
            .App {
              width: ${100 + gridSize[0]}%;
            }

            #midi {
              width: calc(${100}% + ${gridSize[0]}%);
              padding-top: ${selectorsRef.current?.offsetHeight}px;
            }

            #midi-note-labels {
              grid-template-rows: repeat(${getOctaveArray().length}, ${(100 + gridSize[1]) / getOctaveArray().length}%);
              max-width: ${(document.body.offsetWidth <= noteTracksRef.current?.offsetWidth! + labelsRef.current?.offsetWidth!) ? '8vmax' : '8%'};
              min-width: min-content;
             
            }
            #midi-track {  
              width: ${100 + gridSize[0]}%;
              height: ${100 + gridSize[1]}%;
            }
          `}
        </style>
        {infoModal}
        <div ref={selectorsRef} id='selectors'>
          <button id='info-button' className='info' onClick={() => info()}><FaInfoCircle style={{color: 'white', margin: '2px 2px'}} /></button>
          <div className='login-elems'>
            {(username.length > 0) ? <span id='welcome-user'> welcome {username} </span>: <></>}
            <ShowLoginModal username={username} dbLoaded={dbLoaded} setFocus={setFocus} setUsername={setUsername} />
          </div>
          <br></br>
          <br></br>
          <div className='settings-buttons'>
            {(menuShown === 'PianoSettings') ? <><button className='settings-button left-settings-button' onClick={() => setMenuShown('')}>X</button><SoundSettings soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} volume={soundState.volume} pianoDispatch={soundDispatch} /></> : <button className='settings-button left-settings-button' onClick={() => setMenuShown('PianoSettings')}>Piano Settings</button>}
            {(menuShown === 'MidiSettings') ? <><button className='settings-button' onClick={() => setMenuShown('')}>X</button><MidiSettings soundDetails={soundDetails} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch}/></> : <button className='settings-button' onClick={() => setMenuShown('MidiSettings')}>Midi Settings</button>}
            {(menuShown === 'UISettings') ? <><UISettings gridSize={gridSize} setXGridSize={setXGridSize} setYGridSize={setYGridSize} /><button className='settings-button' onClick={() => setMenuShown('')}>X</button></> : <button className='settings-button' onClick={() => setMenuShown('UISettings')}>UI Settings</button>}
            {(menuShown === 'SaveExportSettings') ? <><SaveExport controlsDispatch={controlsDispatch} midiNoteInfo={midiNoteInfo} midiNoteInfoLength={midiNoteInfo.length} mode={midiState.mode} selectorsRef={selectorsRef} trackName={trackName} username={username} setFocus={setFocus} setTrackName={setTrackName} setMidiNoteInfo={setMidiNoteInfo} /><button className='settings-button right-settings-button' onClick={() => setMenuShown('')}>X</button></> : <button className='settings-button right-settings-button' onClick={() => setMenuShown('SaveExportSettings')}>Save, Export, Load</button>}
          </div>
            <div ref={timerRef} id='timer-buttons'>
              <TimerButtons metPlay={metPlay} metronome={midiState.metronome} mode={midiState.mode} pulseNum={pulseNum} midiDispatch={midiDispatch} />
              <input readOnly={true} id='time' className='settings input' value={(pulseNum / pulseRate/1000).toFixed(2)}></input>
              <KbFunctions controlsPressed={controlsPressed} metronome={midiState.metronome} mode={midiState.mode} octave={soundState.octave} octaveMinMax={octaveMinMax} selectorsRef={selectorsRef} clearControls={clearControls} controlsDispatch={controlsDispatch} midiDispatch={midiDispatch} soundDispatch={soundDispatch} />
            </div>
        </div>
        <div id='midi'>
          <PianoRoll labelsRef={labelsRef} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} octave={soundState.octave} pulseNum={pulseNum} pulseRate={pulseRate} sound={soundState.sound} soundDetails={soundDetails} subdiv={midiState.subdiv} time={pulseNum} handleNotePlayed={pianoRollKeysPressed} />
          <div id='midi-track' style={{backgroundSize: `${bgSizeTrack}%`}}>
            {(noteTracksRef.current && selectorsRef.current) ? <input ref={timeSliderRef} type='range' id='time-slider' min='0' max={`${midiLength * pulseRate}`} value={pulseNum} style={{position: 'sticky', height: 'max-content', top: `${selectorsHeight}px`}} onChange={(e) => {setTime(parseInt(e.target.value) / pulseRate); setPulseNum(parseInt(e.target.value))}}></input> : null}
            <Grid gridSize={gridSize} midiLength={midiLength} noteTracksRef={noteTracksRef} numMeasures={midiState.numMeasures} pulseNum={pulseNum} pulseRate={pulseRate} selectorsRef={selectorsRef} subdiv={midiState.subdiv} time={time} octaveArray={getOctaveArray()} setPulseNum={setPulseNum} setTime={setTime} />
          </div>
        </div>
        <KeyNoteInput focus={focus} octave={soundState.octave} pianoRollKey={pianoRollKeyRef.current} pulseNum={pulseNum} keysPressed={keysPressed} keysUnpressed={keysUnpressed} onControlsPressed={setControlsPressed} onNotePlayed={setKeysPressed} setKeysPressed={setKeysPressed} setKeysUnpressed={setKeysUnpressed} />
        <MidiRecorder controlsState={controlsState} gridSize={gridSize} keysPressed={keysPressed} keysUnpressed={keysUnpressed} midiLength={midiLength} midiNoteInfo={midiNoteInfo} midiState={midiState} noteTracksRef={noteTracksRef} pulseNum={pulseNum} pulseRate={pulseRate} controlsDispatch={controlsDispatch} setKeysUnpressed={setKeysUnpressed} setMidiNoteInfo={setMidiNoteInfo} setPlayback={setPlayback} />
        <Timer bpm={midiState.bpm} metronome={midiState.metronome} midiLength={midiLength} time={time} timerRef={timerRef} mode={midiState.mode} ppq={midiState.ppq} pulseNum={pulseNum} pulseRate={pulseRate} handleMetPlay={metPlayed} handleSetTime={setTime} handleSetPulseNum={setPulseNum} />
        <Piano pulseNum={pulseNum} soundDetails={soundDetails} sound={soundState.sound} octave={soundState.octave} octaveMinMax={octaveMinMax} volume={soundState.volume} mode={midiState.mode} keysPressed={keysPressed} keysUnpressed={keysUnpressed} playback={playback} labelsRef={labelsRef} />
        <div id="small-screen-msg"> 
          <h3>Please visit on a bigger screen to use this app.</h3>
        </div>
      </div>
    // </div>
  );
}

export default App;
