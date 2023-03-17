import React, { useState, useEffect, useRef } from 'react';
import { MidiSettingsProps } from '../../Tools/Interfaces';
import DragLabel from '../../Tools/DragLabel/DragLabel'
import '../Settings.css';
import { FaArrowsAltV } from 'react-icons/fa';

interface BpmInputProps {
  bpm: number;
  midiDispatch: Function;
}

function BpmInput(props: BpmInputProps) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if(props.bpm > 160) {
      alert('BPM cannot exceed 160.')
      props.midiDispatch({type: 'bpm', bpm: 120})
    }
  }, [props.bpm]);

  return <>
    <DragLabel plane='y' range={[0, 161]} style={{cursor: 'ns-resize', userSelect: 'none'}} text={<><FaArrowsAltV style={{verticalAlign: 'middle'}} />BPM</>} value={props.bpm} setValue={(bpm: number) => { props.midiDispatch({type: 'bpm', bpm: bpm})}} />
    <input ref={ref} className='bpm-input settings input' value={props.bpm.toString()} onChange={(e) => (e.target.value === '') ? props.midiDispatch({type: 'bpm', bpm: 0}) : props.midiDispatch({type: 'bpm', bpm: parseInt(e.target.value)})} />
  </>
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
      <BpmInput bpm={props.bpm} midiDispatch={props.midiDispatch} />
      <select name='num-measures' id='measure-amt-selector' className='settings' value={props.numMeasures} onChange={(e) => {props.midiDispatch({type: 'numMeasures', numMeasures: e.target.value})}}>
        {renderNumMeasures()}
      </select>
      <select name='subdiv' id='subdiv-selector' className='settings' value={props.subdiv} onChange={(e) => {props.midiDispatch({type: 'subdiv', subdiv: parseInt(e.target.value)})}}>
        <option value='1'>1</option>
        <option value='2'>1/2</option>
        <option value='4'>1/4</option>
        <option value='8'>1/8</option>
        <option value='16'>1/16</option>
        <option value='32'>1/32</option>
      </select>
      <button id='undo-button' className='settings button' onClick={() => props.controlsDispatch({type: 'undo', undo: true})}>Undo</button>
      {/* <form>
        <input type='trackName' name='trackName' onChange={(e) => props.setTrackName(e.target.value)}></input>
        <input type='submit' value='Save'></input>
        <button onClick={() => props.controlsDispatch({type: 'export', export: true})}>Export</button>
      </form> */}
    </>
    )
}

export default MidiSettings;