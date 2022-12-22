import {React, useState, useEffect, useRef} from 'react';
// import  {DraggableNumber} from './libs/draggable-number'
import './Settings.css';
import transparent from './tranparency.png';

function BpmSlider(props) {
  const [rendered, setRendered] = useState(0);
  const ref = useRef(null);

  // useEffect(() => { 
  //   const el = ref.current;
  //   if(el && rendered === 0) {
  //     console.log('h', rendered, el)
  //     new DraggableNumber(el, {
  //         min: 1,
  //         max: 999,
  //         changeCallback: function(val) {console.log("on change: " + val);},
  //         endCallback: function(val) {console.log("on end: " + val);}
  //     });
  //     setRendered(1);
  //   }
  // }, [ref.current]);

  return <input ref={ref} className="bpm-input" defaultValue={props.bpm} onChange={(e) => props.midiDispatch({type: 'bpm', bpm: parseInt(e.target.value)})} />;
}

function Settings(props) {
  useEffect(() => {
    if(document.getElementById('key-note-input')) {
      document.getElementById('selectors').appendChild(document.getElementById('key-note-input'));
    }
  }, [])

  function renderSounds() {
    var sounds = [];
    Object.keys(props.soundDetails).forEach((sound) => {
      sounds.push(<option key={sound} value={sound}>{sound}</option>);
    });
    return sounds;
  }
  
  function renderOctaves() {
    if(Object.keys(props.soundDetails).length > 0) {
      var octaves = [];
      var soundObj = props.soundDetails[props.sound];
      Object.keys(soundObj).forEach((octave) => {
        octaves.push(<option key={octave} value={octave}>{octave}</option>);
      });
    }
    return octaves;
  }
  
  function renderVolumes() {
    if(Object.keys(props.soundDetails).length > 0) {
      var volumes = [];
      var octavesObj = props.soundDetails[props.sound][props.octave];
      octavesObj.forEach((volume) => {
        volumes.push(<option key={volume} value={volume}>{volume.replace(/[0-9]/g, '')}</option>);
      });
    }
    return volumes;
  }

  function renderNumMeasures() {
    var measureOpts = [];
    for(var i = 1; i < 9; i++) {
      measureOpts.push(<option key={i} value={i}>{i}</option>);
    }
    return measureOpts;
  }

  const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;

  return (
    <div id='selectors'>
      <BpmSlider bpm={props.bpm} midiDispatch={props.midiDispatch} />
      <select name='sound' id='sound-selector' value={props.sound} onChange={(e) => {props.pianoDispatch({type: 'sound', sound: e.target.value})}}>
        {renderSounds()}
      </select>
      <select name='octave' id='octave-selector' value={props.octave} onChange={(e) => {props.pianoDispatch({type: 'octave', octave: parseInt(e.target.value)})}}>
        {renderOctaves()}
      </select>
      <select name='volume' id='volume-selector' value={props.volume} onChange={(e) => {props.pianoDispatch({type: 'volume', volume: e.target.value})}}>
        {renderVolumes()}
      </select>
      <select name='measure-amount' id='measure-amt-selector' value={props.numMeasures} onChange={(e) => {props.midiDispatch({type: 'numMeasures', numMeasures: e.target.value})}}>
        {renderNumMeasures()}
      </select>
      <select name='subdiv' id='subdiv-selector' value={props.subdiv} onChange={(e) => {props.midiDispatch({type: 'subdiv', subdiv: parseInt(e.target.value)})}}>
        <option value='1'>1</option>
        <option value='2'>1/2</option>
        <option value='4'>1/4</option>
        <option value='8'>1/8</option>
        <option value='16'>1/16</option>
        <option value='32'>1/32</option>
      </select>
      <button type='button' className={recordingClassName} onClick={() => {props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'})}}>O</button>
    </div>
    )
}

export default Settings;