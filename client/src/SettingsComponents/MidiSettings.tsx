import React, { useState, useEffect, useRef } from 'react';
import { MidiSettingsProps } from '../Tools/Interfaces';
// import  {DraggableNumber} from './libs/draggable-number'
import './Settings.css';

interface BpmSliderProps {
  bpm: number;
  midiDispatch: Function;
}

function BpmSlider(props: BpmSliderProps) {
  const [rendered, setRendered] = useState(0);
  const ref = useRef(null);

  return <input ref={ref} className="bpm-input" defaultValue={props.bpm} onChange={(e) => props.midiDispatch({type: 'bpm', bpm: parseInt(e.target.value)})} />;
}

// interface MidiSettingsProps {
//   soundDetails: Object;
//   numMeasures: number;
//   subdiv: number;
//   bpm: number;
//   mode: string;
//   midiDispatch: Function;
// }

function MidiSettings(props: MidiSettingsProps) {

  function renderNumMeasures() {
    var measureOpts = [];
    for(var i = 1; i < 9; i++) {
      measureOpts.push(<option key={i} value={i}>{i}</option>);
    }
    return measureOpts;
  }

  return (
    <>
      <BpmSlider bpm={props.bpm} midiDispatch={props.midiDispatch} />
      <select name='num-measures' id='measure-amt-selector' value={props.numMeasures} onChange={(e) => {props.midiDispatch({type: 'numMeasures', numMeasures: e.target.value})}}>
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
      <button onClick={() => props.controlsDispatch({type: 'undo', undo: true})}>Undo</button>
<<<<<<< HEAD
      <button onClick={() => props.controlsDispatch({type: 'export', export: true})}>Export</button>
=======
>>>>>>> 71ede2b (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
    </>
    )
}

export default MidiSettings;