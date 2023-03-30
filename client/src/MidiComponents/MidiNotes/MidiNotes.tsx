import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes, useCallback} from 'react';
import { createPortal } from 'react-dom';
import { ControlsState, MidiNoteInfo, MidiState, NoteTrackChilds, Widths } from '../../Tools/Interfaces';
import './MidiNotes.css';

interface MidiNotesProps {
  controlsState: ControlsState;
  gridSize: number[];
  midiLength: number;
  midiNoteInfo: MidiNoteInfo[];
  midiState: MidiState;
  pulseNum: number;
  pulseRate: number;
  noteTracksRef: React.RefObject<HTMLDivElement>;
  subdiv: number;
  controlsDispatch: React.Dispatch<any>;
  setOrigVal: Function;
  setStartVal: Function;
}

function MidiNotes(props: MidiNotesProps) {
  const [widths, setWidths] = useState<Widths>({});
  const [midiNotes, setMidiNotes] = useState<ReactPortal[]>([]);

  const onStart = useCallback((e: MouseEvent) => {
    if(e.target instanceof Element) {
      let noteOct = e.target.id.substring(0, e.target.id.indexOf('-'));

      props.midiNoteInfo.some((midiNote) => {
        if(midiNote) {
          if(Object.keys(midiNote)[0] === noteOct) {
            if(e.shiftKey) {
              props.setOrigVal(midiNote[noteOct].keyPressed.start);
              return true;
            } else {
              props.setOrigVal(midiNote[noteOct].keyPressed.end);
              return true;
            }
          }
        }
      })
      props.setStartVal(e.clientX);      
    }
  }, [props.midiNoteInfo])

  useLayoutEffect(() => {
    setWidths((widths) => {
      let state: Widths = {...widths};

      props.midiNoteInfo.forEach((midiNote) => {
        if(midiNote) {
          let noteStart = Object.keys(props.midiNoteInfo[props.midiNoteInfo.indexOf(midiNote)])[0];
          let start = midiNote[noteStart].keyPressed!.start!;
          let end = midiNote[noteStart].keyPressed!.end!;

          if(midiNote[noteStart].keyPressed!.start >= 0) {
            state[noteStart] = {start: start, end: end};
          }
        }
      })
      return state;
    })
  }, [props.pulseNum, props.midiNoteInfo, props.gridSize, props.midiState.numMeasures])

  useLayoutEffect(() => {
    setMidiNotes([])
    function renderPortals() {
      const noteTrackChilds: NoteTrackChilds = {};
      const midiNotesArr: ReactPortal[] = []

      props.midiNoteInfo.forEach((noteStart) => {
        if(noteStart) {
          let key = Object.keys(props.midiNoteInfo[props.midiNoteInfo.indexOf(noteStart)])[0];

          if(Object.keys(widths).includes(key)) {
            let left = widths[key].start / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth + 2;
            let width = (widths[key].end - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth - 2;

            if(widths[key].end === -1) {
              width = (props.pulseNum - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
            }

            var elem = createElement('span', {...noteStart[key].props, key: noteStart[key].key, onMouseDown: onStart, style: {
              height: `${document.getElementById(noteStart[key].noteTrackId)!.offsetHeight - 4}px`,
              left: `${left}px` ,
              width: `${width}px`,
            }});

            if(!noteTrackChilds[noteStart[key].noteTrackId]) {
              noteTrackChilds[noteStart[key].noteTrackId] = [];
            }

            noteTrackChilds[noteStart[key].noteTrackId].push(elem)
          }
        }
      });
      Object.keys(noteTrackChilds).forEach((noteTrackId) => {
        midiNotesArr.push(createPortal(noteTrackChilds[noteTrackId], props.noteTracksRef.current!.children.namedItem(noteTrackId)!))
      })
      return midiNotesArr;
    }

    if(Object.keys(widths).length > 0) {
      setMidiNotes(renderPortals())
    }
  }, [widths, props.pulseNum, props.gridSize]);

  return (
    <>
      {midiNotes}
    </>
  )
}

export default MidiNotes;