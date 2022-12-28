import React, {useState, useEffect, useLayoutEffect} from 'react';
import {NoteTrackProps, GridProps} from './Interfaces';
import './Grid.css';
const qwertyNote = require('./note-to-qwerty-key');

// interface NoteTrackProps {
//   key: string;
//   note: string;
//   octave: number;
//   subdiv: number;
// }

function NoteTrack(props: NoteTrackProps) {

  return (
    <div id={props.note+props.octave + '-measure '} className='note-measure' ></div>
  );
}

// interface GridProps {
//   octaveArray: string[];
//   numMeasures: number;
//   subdiv: number;
// }

function Grid(props: GridProps) {
  const [grid, setGrid] = useState<JSX.Element[]>();

  useLayoutEffect(() => {
    let gridMidi = [];
    let gridSubdivisions = [];
    let gridMeasure = [];
    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
        gridMeasure.push(<span key={qwertyNote[y].note + props.octaveArray[x]} id={`${qwertyNote[y].note}-track `} className='note-track'></span>);
      }
    }

    for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
      if(i % props.subdiv === 0) {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px rgb(114, 114, 114)'}}></span>)
      } else {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
      }
    }
    
    if(gridMeasure.length === 12 * props.octaveArray.length) {
      var i = 0;
      gridMidi.push(<div key='subdivs' id='subdivs' style={{gridTemplateColumns: 'repeat(' + props.subdiv * props.numMeasures + ', auto)'}}>{gridSubdivisions}</div>)
      gridMidi.push(<div key='measures' id='measures' style={{/*backgroundSize: bgSizeTrack / props.subdiv + '%'*/}}>{gridMeasure}</div>);
      setGrid(gridMidi);
    }
  }, [props.subdiv, props.octaveArray, props.numMeasures]);

  const bgSizeTrack = 100 / props.numMeasures;

  return <>{grid}</>;
}

export default Grid;