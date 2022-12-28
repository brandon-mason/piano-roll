import React, { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { KeyProps, NoteLabelsProps, PianoRollProps } from './Interfaces';
import axios from 'axios';
import MidiNotes from './MidiNotes';
import Grid from './Grid';
import './Piano-roll.css';
const qwertyNote = require('./note-to-qwerty-key');

// interface KeyProps {
//   key: string;
//   qwertyKey: string;
//   note: string;
//   altNote: string;
//   octave: number;
//   handleNotePlayed: Function;
// }

function Key(props: KeyProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      let input = document.getElementById('key-note-input');
      let keydownE = new KeyboardEvent('keydown', {
        key: props.qwertyKey,
        code: props.octave + ' ' + true,
      });
      if(input) input.dispatchEvent(keydownE);
      // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), true]);
    }

    const onPointerUp = (e: PointerEvent) => {
      let input = document.getElementById('key-note-input');
      let keydownE = new KeyboardEvent('keyup', {
        key: props.qwertyKey,
        code: props.octave + ' ' + false,
      });
      if(input) input.dispatchEvent(keydownE);
      // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), false]);
    }

    const element = ref.current!;
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    return (() => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
    });
  });

  let noteName;

  (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');

  return (
    <button type='button' ref={ref} id={noteName.toLowerCase() + props.octave + '-label'} className={(props.note.length > 1) ? 'note-label accidental' : 'note-label natural'}> {/* onClick={() => handleClick()}> */}
      {props.note + props.octave}
    </button>
  );
}

// interface NoteLabelsProps {
//   octaveArray: string[];
//   octave: number;
//   labelsRef: React.RefObject<HTMLDivElement>;
//   handleNotePlayed: Function
// }

function NoteLabels(props: NoteLabelsProps) {
  const memoNoteLabels = useMemo<JSX.Element[]>((): JSX.Element[] => {
    let gridLabelOctaves = [];
    let gridLabels: JSX.Element[] = [];

    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        gridLabelOctaves.push(<Key key={qwertyNote[y].note + props.octaveArray[x]} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={parseInt(props.octaveArray[x])} handleNotePlayed={sendNoteProps} />);
      }

      gridLabels.push(<div key={x} id={`${x}-octave`} className='note-label-octaves'>{gridLabelOctaves}</div>);
      gridLabelOctaves = [];
    }

    if(gridLabels.length === props.octaveArray.length) {
      return gridLabels;
    }

    return [];
  }, [props.octaveArray]);

  useEffect(() => {
    var element = document.getElementById('g' + props.octave + '-label');

    if(element) {
      element.scrollIntoView({block: 'center'});
    }
  }, [memoNoteLabels]);

  function sendNoteProps(keyPressed: any[]) {
    props.handleNotePlayed(keyPressed);
  }
  return <div ref={props.labelsRef} id='midi-note-labels'>{memoNoteLabels}</div>
}

// interface PianoRollProps {
//   soundDetails: Object;
//   time: number;
//   midiLength: number;
//   playback: KeysPressed;
//   sound: string
//   octave: number;
//   numMeasures: number;
//   subdiv: number;
//   labelsRef: React.RefObject<HTMLDivElement>;
//   handleNotePlayed: Function;
// }

function PianoRoll(props: PianoRollProps) {
  const gridRef = useRef(null);
  const [labels, setLabels] = useState([]);
  const [octaveArray, setOctaveArray] = useState(['']);
  const bgSizeTrack = 100 / props.numMeasures;

  useLayoutEffect(() => {
    getOctaveArray();
  }, [props.soundDetails, props.sound])

  useEffect(() => {

  });

  function sendNoteProps(keyPressed: any[]) {
    props.handleNotePlayed(keyPressed);
  }

  function getOctaveArray() {
    Object.keys(props.soundDetails).some((key) => {
      if(key === props.sound) {
        setOctaveArray(Object.keys(props.soundDetails[key as keyof typeof props.soundDetails]));
        return Object.keys(props.soundDetails[key as keyof typeof props.soundDetails]);
      } else {
        return [];
      }
    })
  }
  
  function trackPosition() {
    const position = {left: `${8 + props.time / props.midiLength * 92}%`};
    return <div id='track-position' className='keyboard' style={position}></div>;
  }

  return (
    <>
      {/* <BpmSlider /> */}
      <div id='midi' >
        <NoteLabels octaveArray={octaveArray} octave={props.octave} labelsRef={props.labelsRef} handleNotePlayed={sendNoteProps} />
        {trackPosition()}
        <div id='midi-track' ref={gridRef} style={{backgroundSize: bgSizeTrack + '%'}}>
          <MidiNotes gridRef={gridRef} />
          <Grid octaveArray={octaveArray} numMeasures={props.numMeasures} subdiv={props.subdiv} />
        </div>
      </div>
    </>
  );
}

export default PianoRoll;