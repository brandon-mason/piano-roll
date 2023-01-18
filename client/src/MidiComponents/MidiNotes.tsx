import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes} from 'react';
import { createPortal, unmountComponentAtNode } from 'react-dom';
import { ControlsState, KeysPressed, MidiNoteInfo, MidiRecorded, MidiState, NotesRemoved, NoteTrackChilds, QwertyNoteObj, Widths } from '../Tools/Interfaces';
import './MidiNotes.css';
import { createRoot } from 'react-dom/client';
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

interface MidiNotesProps {
    controlsState: ControlsState;
    gridSize: number[];
    midiLength: number;
    midiNoteInfo: MidiNoteInfo[];
    midiState: MidiState;
    notesRemoved: NotesRemoved[]
    orderOfEvents: number[];
    pulseNum: number;
    pulseRate: number;
    noteTracksRef: React.RefObject<HTMLDivElement>;
    subdiv: number;
    controlsDispatch: React.Dispatch<any>;
  }

function MidiNotes(props: MidiNotesProps) {
  const [widths, setWidths] = useState<Widths>({});
  const [midiNotes, setMidiNotes] = useState<ReactPortal[]>([]);

  useEffect(() => {
    // console.warn(widths)
  }, [widths])

  useEffect(() => {
    // console.log(props.midiNoteInfo)
  }, [props.midiNoteInfo])

  useLayoutEffect(() => {
    setWidths((widths) => {
      let state: Widths = {}

      // Object.keys(state).forEach((key) => {
      //   if(!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] === key)) {
      //     delete state[key];
      //   }
      // });

      props.midiNoteInfo.forEach((midiNote) => {
        let noteStart = Object.keys(midiNote)[0];
        let start = midiNote[noteStart].keyPressed!.start!;
        let end = midiNote[noteStart].keyPressed!.end!;
        if(midiNote[noteStart].keyPressed!.start >= 0) {
          // console.log({start: start, end: end})
          state[noteStart] = {start: start, end: end};
          // console.log(noteStart, state[noteStart])
        }
      })
      return state;
    })
  }, [props.pulseNum, props.midiNoteInfo, props.gridSize])

  useLayoutEffect(() => {
    setMidiNotes([])
    function renderPortals() {
      const noteTrackChilds: NoteTrackChilds = {};
      const midiNotesArr: ReactPortal[] = []

      props.midiNoteInfo.forEach((noteStart) => {
        let key = Object.keys(noteStart)[0];

        if(Object.keys(widths).includes(key)) {
          let left = widths[key].start / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth + 1;
          let width = (widths[key].end - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;

          if(widths[key].end === -1) {
            width = (props.pulseNum - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
          }

          var elem = createElement('span', {...noteStart[key].props, key: noteStart[key].key, style: {
            height: '23.5px',
            left: `${left}px` ,
            width: `${width}px`,
          }});

          if(!noteTrackChilds[noteStart[key].noteTrackId]) {
            noteTrackChilds[noteStart[key].noteTrackId] = [];
          }

          noteTrackChilds[noteStart[key].noteTrackId].push(elem)
        }
      });
      Object.keys(noteTrackChilds).forEach((noteTrackId) => {
        midiNotesArr.push(createPortal(noteTrackChilds[noteTrackId], props.noteTracksRef.current!.children.namedItem(noteTrackId)!))
      })
      return midiNotesArr;
    }

    if(Object.keys(widths).length > 0) {
      // console.log(renderPortals())
      setMidiNotes(renderPortals())
    }
  }, [widths, props.pulseNum, props.gridSize])

  return (
    <>
      {midiNotes}
    </>
  )
}

export default MidiNotes