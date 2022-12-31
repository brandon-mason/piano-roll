import React, { useState, useEffect, useLayoutEffect, createElement} from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { KeysPressed, MidiRecord, MidiState, QwertyNoteObj } from './Interfaces';
import './MidiNotes.css';
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('./note-to-qwerty-key-obj');

interface MidiNoteProps {
  [noteStart: string] : {
    keyPressed: KeyPressed
    noteTrackId: string;
    noteTracksRef: React.RefObject<HTMLDivElement>;
    props: {
      className: string;
      key: string;
      style: {
        left: string;
        width: string;
        height: string;
      }
    }
  }
}

function MidiNote(props: MidiNoteProps) {

}


interface KeyPressed {
  octave: number;
  pressed: boolean;
  start?: number;
  end?: number;
}

interface MidiNotesProps {
  keysPressed: KeysPressed;
  midiLength: number;
  midiRecord: MidiRecord;
  midiState: MidiState;
  pulseNum: number;
  pulseRate: number;
  noteTracksRef: React.RefObject<HTMLDivElement>;
}

interface MidiNotes {
  [id: string]: JSX.Element;
}

interface Widths {
  [noteStart: string]: {
    start: number;
    end?: number;
  };
}

function MidiNotes(props: MidiNotesProps) {
  const [count, setCount] = useState<number>(0);
  const [widths, setWidths] = useState<Widths>({});
  const [clickCoords, setClickCoords] = useState<number[]>([])
  const [midiNoteProps, setMidiNoteProps] = useState<MidiNoteProps>({})

  useEffect(() => console.log(clickCoords), [clickCoords])

  useEffect(() => {
    function printMousePos(e: MouseEvent) {
        setClickCoords([e.clientX, e.clientY]);
    }
    
    if(props.noteTracksRef.current) {
      props.noteTracksRef.current.addEventListener('dblclick', printMousePos)
    }
    
    return () => {
      if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('dblclick', printMousePos);
    }
  })

  useEffect(() => {
    Object.keys(props.keysPressed).forEach((noteOct) => {
      // setWidths()
        if(props.keysPressed[noteOct].start) {
          if(props.keysPressed[noteOct].end === -1 && !widths[props.keysPressed[noteOct].start + noteOct]) {
            setWidths((widths) => ({...widths, [props.keysPressed[noteOct].start + noteOct]: {start: props.keysPressed[noteOct].start!}}));
          } else {
            setWidths((widths) => ({...widths, [props.keysPressed[noteOct].start + noteOct]: {start: props.keysPressed[noteOct].start!, end: props.pulseNum}}));
          }
      }
    });
  }, [props.pulseNum, props.keysPressed])

  useEffect(() => {
    // console.warn(widths)
  }, [widths])

  useEffect(() => {
    const addNoteBox = () => {
      let key: string;
      let octave: number;
      let countTemp = count;
      if(props.noteTracksRef.current) {
        Object.keys(props.keysPressed).forEach((noteOct) => {
          octave = parseInt(noteOct.replace(/\D/g,''));
          // console.log(widths)
          let noteStart = props.keysPressed[noteOct].start + noteOct;
          // console.log(widths[noteStart].start)
          if(props.keysPressed[noteOct].pressed && widths[noteStart].start !== undefined) {
            // console.log(widths)
            let width: number;
            // console.error(widths)
            if(widths[noteStart].end) {
              width = widths[noteStart].end! - widths[noteStart].start;
            } else {
              width = props.pulseNum - widths[noteStart].start;
              // console.log(props.pulseNum , widths[noteStart].start)
            }
            let noteTrackId = `${noteOct}-track`;
            // console.error(width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth)
            setMidiNoteProps((midiNoteProps) => ({...midiNoteProps, [props.keysPressed[noteOct].start + noteOct]: {
              props: {
                key: noteTrackId + countTemp,
                className: 'midi-note',
                style: {
                  height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
                  top: ``,
                  left: `${.08 * window.innerWidth + (props.keysPressed[noteOct].start! / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current!.offsetWidth}px`,
                  width: `${width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth}px`,
                }
              },
              keyPressed: props.keysPressed[noteOct],
              noteTrackId: noteTrackId,
              noteTracksRef: props.noteTracksRef,
            }}))
            countTemp++;
          }
        })
      }
      setCount(countTemp)
    }

    // console.log(props.noteTracksRef.current?.children)
    if(props.noteTracksRef && props.midiState.mode === 'recording') {
      addNoteBox();
    }
    if(props.midiState.mode != 'recording') {
      // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
    }
    // console.warn(midiNotesArr, props.midiState.mode)
  }, [props.noteTracksRef, props.midiState.mode, widths]);

  // const items = midiNotesArr.map((items) => (<>{items}</>));
  return (
    <>
      {Object.keys(midiNoteProps).map((props) => {
        var elem = createElement('span' , midiNoteProps[props].props)
        // console.log(elem)
        // console.log(midiNoteProps[props].noteTracksRef.current!.children.namedItem(midiNoteProps[props].noteTrackId))
        return createPortal(
          elem,
          midiNoteProps[props].noteTracksRef.current!.children.namedItem(midiNoteProps[props].noteTrackId)!
        )
    })}
    </>
  )
}

export default MidiNotes