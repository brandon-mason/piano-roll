import React, {useState, useEffect, useRef} from 'react';
import {SoundSettingsProps, IOctavesObj} from '../../Tools/Interfaces';
// import  {DraggableNumber} from './libs/draggable-number'

// interface BpmSliderProps {
//   bpm: number;
//   midiDispatch: Function;
// }

// interface SoundSettingsProps {
//   soundDetails: {
//     [sound: string]: {
//       [octave: string]: string[]
//     }
//   };
//   sound: string;
//   octave: number;
//   volume: string;
//   pianoDispatch: Function;
// }

function Settings(props: SoundSettingsProps) {

  useEffect(() => {
    const selectors: HTMLElement = document.getElementById('selectors')!;
    const keyNoteInput: HTMLElement = document.getElementById('key-note-input')!;

    if(selectors && keyNoteInput) {
      selectors.appendChild(keyNoteInput);
    }
  }, [])

  function renderSounds() {
    let sounds: Array<JSX.Element> = [];
    Object.keys(props.soundDetails).forEach((sound: string) => {
      sounds.push(<option key={sound} value={sound}>{sound}</option>);
    });
    return sounds;
  }
  
  // no clue why this doesnt work
  // function renderOctavesFor() {
  //   let octaves: JSX.Element[] = [];
  //   let soundObj = props.soundDetails[props.sound as keyof typeof props.soundDetails];
  //   console.log(soundObj)
  //   let octaveKeys = Object.keys(props.soundDetails[props.sound as keyof typeof props.soundDetails]);
  //   if(octaveKeys.length > 0) {
  //     for(let i = octaveKeys.length; i > 0; i--) {
  //       octaves.push(<option key={octaveKeys[i]} value={octaveKeys[i]}>{octaveKeys[i]}</option>);
  //     };
  //   }
  //   console.log(Object.keys(props.soundDetails))
  //   return octaves;
  // }

  function renderOctaves() {
    let octaves: JSX.Element[] = [];
    if(Object.keys(props.soundDetails).length > 0) {
      let soundObj = props.soundDetails[props.sound as keyof typeof props.soundDetails];
      Object.keys(soundObj).slice().reverse().forEach((octave) => {
        octaves.push(<option key={octave} value={octave}>{octave}</option>);
      });
    }
    return octaves;
  }

  // interface IOctavesObj {
  //   [octave: number]: string[];
  // }
  
  function renderVolumes(): JSX.Element[] {
    let volumes: JSX.Element[] = [];
    let octavesObj: IOctavesObj;
    let volumesArr: string[] = []
    if(Object.keys(props.soundDetails).length > 0) {
      octavesObj = props.soundDetails[props.sound];
      volumesArr = octavesObj[props.octave as keyof typeof octavesObj];
      octavesObj[props.octave as keyof typeof octavesObj].forEach((volume: string) => {
        volumes.push(<option key={volume} value={volume}>{volume.replace(/[0-9]/g, '')}</option>);
      });
    }
    return volumes;
  }

  return (
    <>
      <select name='sound' id='sound-selector' className='settings' value={props.sound} onChange={(e) => {props.pianoDispatch({type: 'sound', sound: e.target.value})}}>
        {renderSounds()}
      </select>
      <select name='octave' id='octave-selector' className='settings' value={props.octave} onChange={(e) => {props.pianoDispatch({type: 'octave', octave: parseInt(e.target.value)})}}>
        {renderOctaves()}
      </select>
      <select name='volume' id='volume-selector' className='settings' value={props.volume} onChange={(e) => {props.pianoDispatch({type: 'volume', volume: e.target.value})}}>
        {renderVolumes()}
      </select>
    </>
    )
}

export default Settings;