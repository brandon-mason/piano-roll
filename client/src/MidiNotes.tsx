import React, {useState, useEffect, useLayoutEffect} from 'react';
const qwertyNote = require('./note-to-qwerty-key');

interface MidiNotesProps {
  gridRef: React.RefObject<JSX.Element>;
}

function MidiNotes(props: MidiNotesProps) {
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      console.log(document.querySelectorAll(':hover'));
    }
    let grid = document.getElementById('midi-track');
    if(grid) {
      grid.addEventListener('mousemove', mouseMove);
    }
  }, [props.gridRef.current])
  return <span className='midi-note'></span>
}

export default MidiNotes