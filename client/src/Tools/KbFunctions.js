import React, { useLayoutEffect } from 'react';
const kbControls = require('./keyboard-controls');

function KbFunctions(props) {

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
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'playing-button') {
        props.selectorsRef.current.children[i].className = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
      }
    }
    props.midiDispatch({type: 'mode', mode: (props.mode !== 'keyboard') ? 'keyboard' : 'playing'});
    props.clearControls();
  }

  function stop() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].className === 'stop-button') {
        props.selectorsRef.current.children[i].className = `stop-button${(props.mode === 'stop') ? ' active' : ''}`;
      }
    }
<<<<<<< HEAD
    props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard'})
=======
    props.midiDispatch({type: 'mode', mode: 'stop'})
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
    setTimeout(() => props.midiDispatch({type: 'mode', mode: 'keyboard'}));
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
<<<<<<< HEAD
        let newOctave = parseInt(props.selectorsRef.current.children[i].value) + 1;
=======
        let newOctave = (parseInt(props.selectorsRef.current.children[i].value) + 1).toString();
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
        if(newOctave < props.octaveMinMax[1]) props.soundDispatch({type: 'octave', octave: newOctave})
      }
    }
    props.clearControls();
  }

  function octaveDown() {
    for(let i = 0; i < props.selectorsRef.current.children.length; i++) {
      if(props.selectorsRef.current.children[i].id === 'octave-selector') {
<<<<<<< HEAD
        let newOctave = parseInt(props.selectorsRef.current.children[i].value) - 1;
=======
        let newOctave = (parseInt(props.selectorsRef.current.children[i].value) - 1).toString();
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
        if(newOctave >= props.octaveMinMax[0] - 1) props.soundDispatch({type: 'octave', octave: newOctave})
      }
    }
    props.clearControls();
  }

  function undo() {
    props.controlsDispatch({type: 'undo', undo :true});
  }

  return null;
}

export default KbFunctions;