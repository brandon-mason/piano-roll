import React, {useState, useEffect, useLayoutEffect, useReducer, useMemo} from 'react';
import axios from 'axios';
import './Midi-Recorder.css';
import Settings from './Settings'
import Piano from './Piano';
import PianoRoll from './Piano-roll';

function Timer(props) {
  const [date, setDate] = useState(0);
  const [count, setCount] = useState(0);
  useLayoutEffect(() => {
    let ppq = 24;
    let pulseRate = 60000 / props.bpm / ppq;
    
    if(props.mode === 'recording') {
      let start = performance.now();
      let compare;
      let countTemp = count;
      let date;
      date = setInterval(() => {
        compare = performance.now();
        countTemp += compare - start;
        // console.log(countTemp);
        start = compare;
        setCount(countTemp);
        props.handleSetTime(countTemp);
      }, pulseRate);
      setDate(date);
    } else if (props.mode === 'keyboard')  {
      console.error(date)
      clearInterval(date);
    }
  }, [props.mode])

  function updateTime() {
    props.handleSetTime(count);
  }
}

function pianoReducer(state, action) {
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

function midiReducer(state, action) {
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

function timeReducer(state, action) {
  switch(action.type) {
    case 'pulseNum':
      return {...state, pulseNum: action.pulseNum};

    default:
      return state;
  }
}

function MidiRecorder() {
  const [pianoState, pianoDispatch] = useReducer(pianoReducer, {sound: 'GrandPiano', octave: 3, volume: '2mf'});
  const [midiState, midiDispatch] = useReducer(midiReducer, {numMeasures: 4, subdiv: '4', bpm: 120, mode: 'keyboard'});
  const [timeState, timeStateDispatch] = useReducer(timeReducer, {pulseNum: 0})
  // const [commonState, commonDispatch] = useReducer(commonReducer, {sound: 'GrandPiano', octave: 3})
  // const [sound, setSound] = useState('GrandPiano');
  // const [octave, setOctave] = useState(3);
  // const [volume, setVolume] = useState('2mf');
  // const [subdiv, setSubdiv] = useState('4');
  // const [numMeasures, setNumMeasures] = useState(4);
  // const [bpm, setBpm] = useState(120);
  const [time, setTime] = useState(0);
  const [midi, setMidi] = useState({});
  const [notesPlayed, setNotesPlayed] = useState({});
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
      var soundDetails;
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
    console.log(notesPlayed)
  }, [notesPlayed])

  useEffect(() => {
    console.log(time);
    // while(midiState.mode === 'recording') {
    //   setLastPulse(performance.now());
    // }
    // console.log(pianoState)
    // console.log(midiState)
  }, [time]);

  // useLayoutEffect(() => {
  //   let ppq = 24;
  //   let pulseRate = 60000 / midiState.bpm / ppq;
    
  //   if(midiState.mode === 'recording') {
  //     let start = performance.now();
  //     let compare;
  //     let count = 0;
  //     let date;
  //     date = setInterval(() => {
  //       compare = performance.now();
  //       count += compare - start;
  //       console.log(count);
  //       start = compare;
  //     }, pulseRate);
  //     setDate(date);
  //   } else if (midiState.mode === 'keyboard')  {
  //     console.error(date)
  //     clearInterval(date);
  //   }
  // }, [midiState.mode])

  function timeKeeper() {
    let ppq = 24;
    let pulseRate = 60000 / midiState.bpm / ppq;

    if(midiState.mode === 'recording') {
      // recording(pulseRate);
    } else if (midiState.mode === 'playing')  {
      
    }
  }

  function recording(pulseRate, expectedTime) {
    let now = performance.now();
    // let lastPulse = 0
    while(midiState.mode ) {
      console.log()
      // if(now - lastPulse === pulseRate) {

      // }
    }
  }

  function setTimer(time) {
    setTime(time);
  }
  
  return (
    <>
      <Timer mode={midiState.mode} bpm={midiState.bpm} handleSetTime={setTime} />
      <Settings soundDetails={soundDetails} sound={pianoState.sound} octave={pianoState.octave} volume={pianoState.volume} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} bpm={midiState.bpm} mode={midiState.mode} pianoDispatch={pianoDispatch} midiDispatch={midiDispatch} />
      <Piano soundDetails={soundDetails} sound={pianoState.sound} octave={pianoState.octave} volume={pianoState.volume} pianoRollNotes={notesPlayed} />
      <PianoRoll soundDetails={soundDetails} time={time} midiLength={1 / midiState.bpm / 4 * midiState.numMeasures} sound={pianoState.sound} octave={pianoState.octave} numMeasures={midiState.numMeasures} subdiv={midiState.subdiv} onNotePlayed={setNotesPlayed} />
    </>
  )
}

export default MidiRecorder;