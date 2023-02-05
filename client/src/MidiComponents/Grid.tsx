import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import {NoteTrackProps, GridProps} from '../Tools/Interfaces';
import './Grid.css';
const qwertyNote = require('../Tools/note-to-qwerty-key');

function Grid(props: GridProps) {
  const [grid, setGrid] = useState<JSX.Element[]>();
  const [trackPosition, setTrackPosition] = useState<any>();
  const [position, setPosition] = useState<any>();
  const gridMeasure = useMemo(() => {
    let gridMeasure = []
    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
        gridMeasure.push(<div key={qwertyNote[y].note + props.octaveArray[x]} id={`${qwertyNote[y].note + props.octaveArray[x]}-track`} className='note-track'></div>);
      }
    }
    return gridMeasure;
  }, [props.subdiv, props.octaveArray]);

  const gridSubdivisions = useMemo(() => {
    let gridSubdivisions = []
    for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
      if(i % props.subdiv === 0) {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px rgb(114, 114, 114)'}}></span>)
      } else {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
      }
    }
    return gridSubdivisions;
  }, [props.subdiv, props.octaveArray, props.numMeasures])

  useLayoutEffect(() => {
    let gridMidi = [];
    // let gridSubdivisions = [];
    // let gridMeasure = [];

    // for(var x = props.octaveArray.length - 1; x >= 0; x--) {
    //   for(var y = 11; y >= 0; y--) {
    //     // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
    //     gridMeasure.push(<div key={qwertyNote[y].note + props.octaveArray[x]} id={`${qwertyNote[y].note + props.octaveArray[x]}-track`} className='note-track'></div>);
    //   }
    // }

    // for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
    //   if(i % props.subdiv === 0) {
    //     gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px rgb(114, 114, 114)'}}></span>)
    //   } else {
    //     gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
    //   }
    // }
    
    if(gridMeasure.length === 12 * props.octaveArray.length) {
      var i = 0;
      gridMidi.push(<div key='subdivs' id='subdivs' style={{gridTemplateColumns: `repeat(${props.subdiv * props.numMeasures}, ${(100) / (props.numMeasures * props.subdiv)}%)`}}>{gridSubdivisions}</div>)
      gridMidi.push(<div key='note-tracks' ref={props.noteTracksRef} id='note-tracks'>{gridMeasure}</div>);
      setGrid(gridMidi);
    }
  }, [props.subdiv, props.octaveArray, props.numMeasures]);
  useEffect(() => {
    function trackPosition() {
      let position = {};
      if(props.noteTracksRef.current) {
        position = {left: `${(props.pulseNum / (props.midiLength * props.pulseRate)) * 100}%`};
      } else {
        position = {left: `${(props.pulseNum / (props.midiLength * props.pulseRate) * 100)}%`};
      }
      setPosition(position);
      return <div id='track-position' className='keyboard' style={position}></div>;
    }

    setTrackPosition(trackPosition())
  }, [props.pulseNum]);
  

  const bgSizeTrack = 100 / props.numMeasures;
  
  return (
    <>
      {/* {(props.noteTracksRef.current) ? <input type='range' id='time-slider' min='0' max={`${props.midiLength * props.pulseRate}`} value={props.pulseNum} style={{position: 'sticky', height: 'max-content', top: `${props.selectorsRef.current.offsetHeight}px`}} onChange={(e) => {props.setTime(parseInt(e.target.value) / props.pulseRate); props.setPulseNum(parseInt(e.target.value))}}></input> : null} */}
      {/* {trackPosition} */}
      <div id='track-position' className='keyboard' style={position}></div>
      {grid}
    </>
  )
}

export default Grid;