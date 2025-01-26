import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { GridProps} from '../../Tools/Interfaces';
import './Grid.css';
const qwertyNote = require('../../Tools/JSON/note-to-qwerty-key-obj');

function Grid(props: GridProps) {
  const [grid, setGrid] = useState<JSX.Element[]>();
  const [position, setPosition] = useState<any>();

  /*
    Memoizes the elements making up the grid measures to avoid discrepancies in its display between renders.
  */
  const gridMeasure = useMemo(() => {
    const qwertyKeys = Object.keys(qwertyNote);
    let gridMeasure = []

    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        gridMeasure.push(<div key={qwertyNote[qwertyKeys[y]].note + props.octaveArray[x]} id={`${qwertyNote[qwertyKeys[y]].note + props.octaveArray[x]}-track`} className='note-track'></div>);
      }
    }
    return gridMeasure;
  }, [props.subdiv, props.octaveArray]);

  // const renderCount = useRef(1);
  // useEffect(() => {
  //   renderCount.current = renderCount.current + 1;
  // })

  /*
    Memoizes the elements making up the subdivisions of the grid to avoid discrepancies in its display between renders.
  */
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

  /*
    Updates the display of the grid.
    If gridSubdivisions and gridMeasure are altered this will run after those changes are made.
  */
  useLayoutEffect(() => {
    let gridMidi = [];

    if(gridMeasure.length === 12 * props.octaveArray.length) {
      var i = 0;
      gridMidi.push(<div key='subdivs' id='subdivs' style={{gridTemplateColumns: `repeat(${props.subdiv * props.numMeasures}, ${(100) / (props.numMeasures * props.subdiv)}%)`}}>{gridSubdivisions}</div>)
      gridMidi.push(<div key='note-tracks' ref={props.noteTracksRef} id='note-tracks'>{gridMeasure}</div>);
      setGrid(gridMidi);
    }
  }, [props.subdiv, props.octaveArray, props.numMeasures]);
  
  /*
    Updates the position of the track position element to reflect the current time of the track.
  */
  useEffect(() => {
      let position = {};
      if(props.noteTracksRef.current) {
        position = {left: `${(props.pulseNum / (props.midiLength * props.pulseRate)) * 100}%`};
      } else {
        position = {left: `${(props.pulseNum / (props.midiLength * props.pulseRate) * 100)}%`};
      }
      setPosition(position);
  }, [props.pulseNum]);
  
  return (
    <>
      <div id='track-position' className='keyboard' style={position}></div>
      {grid}
    </>
  )
}

export default Grid;