import React, { useLayoutEffect } from 'react';
const kbControls = require('./keyboard-controls');

interface KbFunctionsProps {
  controlsPressed: (string | boolean)[]; 
  metronome: string;
  mode: string;
  octave: number;
  octaveMinMax: number[];
  selectorsRef: React.RefObject<HTMLDivElement>;
  clearControls: Function
  controlsDispatch:Function;
  midiDispatch:Function;
  soundDispatch:Function;
}

function KbFunctions(props: KbFunctionsProps) {

  useLayoutEffect(() => {
    if(!props.controlsPressed[1]) {
      if(props.controlsPressed[0] === ' ') play();
      if(props.controlsPressed[0] === 'b') stop();
      if(props.controlsPressed[0] === 'n') record();
      if(props.controlsPressed[0] === 'm') metronome();
      if(props.controlsPressed[0] === 'x') octaveUp();
      if(props.controlsPressed[0] === 'z') octaveDown();
    } else {
      if(props.controlsPressed[0] === 'z') undo();
    }
  }, [props.controlsPressed])

  function play() {
    if(props.selectorsRef.current) {
      for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
        if(props.selectorsRef.current.children[i].className === 'playing-button') {
          props.selectorsRef.current.children[i].className = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
        }
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode !== 'keyboard') ? 'keyboard' : 'playing'});
    props.clearControls();
  }

  function stop() {
    if(props.selectorsRef.current) {
      for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
        if(props.selectorsRef.current.children[i].className === 'stop-button') {
          props.selectorsRef.current.children[i].className = `stop-button${(props.mode === 'stop') ? ' active' : ''}`;
        }
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard'})
    setTimeout(() => props.midiDispatch({type: 'mode', mode: 'keyboard'}));
    props.clearControls();
  }

  function record() {
    if(props.selectorsRef.current) {
      for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
        if(props.selectorsRef.current.children[i].className === 'recording-button') {
          props.selectorsRef.current.children[i].className = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
        }
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'});
    props.clearControls();
  }

  function metronome() {
    if(props.selectorsRef.current) {
      for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
        if(props.selectorsRef.current.children[i].className === 'metronome-button') {
          props.selectorsRef.current.children[i].className = `metronome-button${(props.metronome === 'on') ? ' active' : ''}`;
        }
      }
    }
    props.midiDispatch({type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on'});
    props.clearControls();
  }

  function octaveUp() {
    // if(props.selectorsRef.current) {
    //   for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
    //     if(props.selectorsRef.current.children[i].id === 'octave-selector') {
    //       let newOctave = parseInt(props.selectorsRef.current.children[i].value) + 1;
    //       if(newOctave < props.octaveMinMax[1]) props.soundDispatch({type: 'octave', octave: newOctave})
    //     }
    //   }
    // }
    let newOctave = props.octave + 1;
    console.log(newOctave , props.octaveMinMax[1] - 1, newOctave);
    if(newOctave <= props.octaveMinMax[1] - 1) props.soundDispatch({type: 'octave', octave: newOctave})
    props.clearControls();
  }

  function octaveDown() {
    // if(props.selectorsRef.current) {
    //   for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
    //     if(props.selectorsRef.current.children[i].id === 'octave-selector') {
    //       let newOctave = parseInt(props.selectorsRef.current.children[i].value) - 1;
    //       if(newOctave >= props.octaveMinMax[0] - 1) props.soundDispatch({type: 'octave', octave: newOctave})
    //     }
    //   }
    // }
    let newOctave = props.octave - 1;
    console.log(props.octaveMinMax);
    console.log(newOctave >= props.octaveMinMax[0], newOctave);
    if(newOctave >= props.octaveMinMax[0] - 1) props.soundDispatch({type: 'octave', octave: newOctave})
    props.clearControls();
  }

  function undo() {
    console.log('UNDO')
    props.controlsDispatch({type: 'undo', undo :true});
  }

  return null;
}

export default KbFunctions;