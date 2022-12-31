import React, { useLayoutEffect } from 'react';
const kbControls = require('../keyboard-controls');

function KbFunctions(props) {

  useLayoutEffect(() => {
    if(props.controlsPressed === ' ') play();
    if(props.controlsPressed === 'b') stop();
    if(props.controlsPressed === 'n') record();
    if(props.controlsPressed === 'm') metronome();
    if(props.controlsPressed === 'x') octaveUp();
    if(props.controlsPressed === 'z') octaveDown();
  }, [props.controlsPressed])

  function play() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'playing-button') {
        props.selectorsRef.current.children[i].className = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard'});
    props.clearControls();
  }

  function stop() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'stop-button') {
        props.selectorsRef.current.children[i].className = `stop-button${(props.mode === 'stop') ? ' active' : ''}`;
      }
    }
    props.midiDispatch({type: 'mode', mode: 'stop'})
    props.clearControls();
  }

  function record() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'recording-button') {
        props.selectorsRef.current.children[i].className = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'});
    props.clearControls();
  }

  function metronome() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'metronome-button') {
        props.selectorsRef.current.children[i].className = `metronome-button${(props.metronome === 'on') ? ' active' : ''}`;
      }
    }
    props.midiDispatch({type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on'});
    props.clearControls();
  }

  function octaveUp() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].id === 'octave-selector') {
        let newOctave = (parseInt(props.selectorsRef.current.children[i].value) + 1).toString();
        if(newOctave < props.octaveMinMax[1]) props.soundDispatch({type: 'octave', octave: newOctave})
      }
    }
    props.clearControls();
  }

  function octaveDown() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].id === 'octave-selector') {
        let newOctave = (parseInt(props.selectorsRef.current.children[i].value) - 1).toString();
        if(newOctave >= props.octaveMinMax[0] - 1) props.soundDispatch({type: 'octave', octave: newOctave})
      }
    }
    props.clearControls();
  }

  return null;
}

export default KbFunctions;