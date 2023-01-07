import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes} from 'react';
import { createPortal, unmountComponentAtNode } from 'react-dom';
import { ControlsState, KeysPressed, MidiNoteInfo, MidiRecorded, MidiState, NotesRemoved, NoteTrackChilds, QwertyNoteObj, Widths } from '../Tools/Interfaces';
import './MidiNotes.css';
import { createRoot } from 'react-dom/client';
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

interface MidiNotesProps {
    controlsState: ControlsState;
    midiLength: number;
    midiRecorded: MidiRecorded;
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
  // const [count, setCount] = useState<number>(0);
  const [widths, setWidths] = useState<Widths>({});
  // const [clickCoords, setClickCoords] = useState<number[]>([]); //
  // const [midiNoteInfo, setMidiNoteInfo] = useState<MidiNoteInfo[]>([]); //
  const [midiNotes, setMidiNotes] = useState<ReactPortal[]>([]); //
  // const [notesRemoved, setNotesRemoved] = useState<NotesRemoved[]>([]); //
  // const [orderOfEvents, setOrderOfEvents] = useState<number[]>([]); //

  useEffect(() => {
    // console.warn(widths)
  }, [widths])

  useEffect(() => {
    // console.error(props.midiNoteInfo)
  }, [props.midiNoteInfo])

  useEffect(() => {
    // console.log(props.midiNoteInfo)
<<<<<<< HEAD
=======
    let key: string;
    let start: number;
    let end: number;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
    // setWidths({});
    setWidths((widths) => {
      let state = {...widths}
      Object.keys(state).forEach((key) => {
        if(!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] === key)) {
          delete state[key];
        }
      });
      props.midiNoteInfo.forEach((noteStart) => {
<<<<<<< HEAD
        let key = Object.keys(noteStart)[0];
        let start = noteStart[key].keyPressed!.start!;
        let end = noteStart[key].keyPressed!.end!;
        // console.warn(noteStart[key].keyPressed)
        // console.log('noteStart', noteStart);
        if(noteStart[key].keyPressed!.start >= 0) {
            state[key] = {start: start, end: end};
        }
      })
      // console.log('state', state);
      return state;
    })
  }, [props.pulseNum, props.midiNoteInfo])
=======
        key = Object.keys(noteStart)[0];
        start = noteStart[key].keyPressed!.start!;
        end = noteStart[key].keyPressed!.end!;
        // console.warn(noteStart[key].keyPressed)

        if(noteStart[key].keyPressed!.start) {
          if(end === -1) {
            state[key] = {start: start, end: end};
          } else {
            state[key] = {start: start, end: end};
          }
        }
      })
      return state;
    })
  }, [props.midiNoteInfo])
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)

  useEffect(() => {
    setMidiNotes([])
    function renderPortals() {
      // console.log(props.midiNoteInfo)
      const noteTrackChilds: NoteTrackChilds = {};
      const midiNotesArr: ReactPortal[] = []
      props.midiNoteInfo.forEach((noteStart) => {
<<<<<<< HEAD
        let key = Object.keys(noteStart)[0];

        // console.log('midiNoteInfo', props.midiNoteInfo);
        // console.log('widths, key', widths, key)
        if(Object.keys(widths).includes(key)) {
          let left = widths[key].start / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth + 1;
          // let width = (noteStart[key].keyPressed!.end! - noteStart[key].keyPressed!.start!) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
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
        
=======
        // console.log(widths)
        let key = Object.keys(noteStart)[0];
        let left = widths[key].start! / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth + 1;
        // let width = (noteStart[key].keyPressed!.end! - noteStart[key].keyPressed!.start!) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
        let width = (widths[key].end! - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth;
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
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
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

  }, [widths, props.pulseNum])

  // Notes recorded from keyboard

  // const Portal = usePortal(document.querySelector('.noteTrack'));

  // useEffect(() => {
  //   console.error(midiNoteInfo)
  // }, [midiNoteInfo])
  
  // useEffect(() => {
  //   // console.log(notesRemoved)
  // }, [notesRemoved])

  // Notes clicked onto grid
  // useEffect(() => {
  //   function addRemNote(e: MouseEvent) {
  //     var elem: HTMLElement;
  //     if(e.target){
  //       elem = e.target as HTMLElement;
  //       console.log(e)
  //       if(elem.tagName == "DIV") {
  //         setClickCoords([e.clientX, e.clientY]);
  //         // setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
  //       } else if(elem.tagName == "SPAN") {
  //         let key = elem.id.substring(0, elem.id.indexOf('-'));
  //         let remIndex = 0;
  //         for(var i = 0; i < midiNoteInfo.length; i++) {
  //           if(Object.keys(midiNoteInfo[i])[0] === key) remIndex = i;
  //         }
  //         // console.log(key, midiNoteInfo[remIndex])
  //         // let remProp = 
  //         setNotesRemoved((notesRemoved) => [{[remIndex]: {[key]: midiNoteInfo[remIndex][key]}}, ...notesRemoved]);
  //         setMidiNoteInfo((midiNoteInfo) => {
  //           let state = [...midiNoteInfo];
  //           state.splice(remIndex, 1)
  //           return state;
  //         });
  //         setMidiNotes([])
  //         if(props.controlsState.undo) {
  //           props.controlsDispatch({type: 'undo', undo: false});
  //         } else {
  //           setOrderOfEvents((orderOfEvents) => [1, ...orderOfEvents]);
  //         }
  //       }
  //     }
  //   }

  //   if(props.noteTracksRef.current) {
  //     props.noteTracksRef.current.addEventListener('dblclick', addRemNote)
  //   }

  //   return () => {
  //     if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
  //   }
  // }, [props.noteTracksRef.current, midiNoteInfo, notesRemoved])

  // useEffect(() => {
  //   // console.error(props.controlsState.undo)
  //   if(props.controlsState.undo && orderOfEvents.length > 0) {
  //     if(orderOfEvents[0] === 1) {
  //       let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
  //       let key = Object.keys(notesRemoved[0][remIndex])[0]
  //       let start = notesRemoved[0][remIndex][key].keyPressed!.start;
  //       let end = notesRemoved[0][remIndex][key].keyPressed!.end! - 1;
  //       let noteOct = key.replace(start!.toString(), '')
  //       props.controlsDispatch({type: 'undo', undo: false});
  //       setMidiNoteInfo((midiNoteInfo) => {
  //         let state = [...midiNoteInfo];// , {...notesRemoved[0]}]));
  //         state.splice(remIndex, 0, notesRemoved[0][remIndex])
  //         return state;
  //       })
  //       Object.keys(qwertyNote).forEach((qwerty) => {
  //         if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
  //           setNotesRemoved((notesRemoved) => {
  //             let state = [...notesRemoved];
  //             state.shift();
  //             return state;
  //           })
  //           // console.log(note);
  //           // let key = Object.keys(note)
  //           // let qwerty
  //           props.onNoteClicked(noteOct, {
  //             key: qwerty,
  //             octave: parseInt(noteOct.replace(/\D/g,'')),
  //             pressed: true,
  //             start: start,
  //             end: -1,
  //           }, {
  //             key: qwerty,
  //             octave: parseInt(noteOct.replace(/\D/g,'')),
  //             pressed: false,
  //             start: start,
  //             end: end,
  //           })
  //         }
  //       });
  //       setOrderOfEvents((orderOfEvents) => {
  //         let state = [...orderOfEvents];
  //         state.shift();
  //         // console.log('1',state)
  //         return state;
  //       })
  //     } else {
  //       // console.warn(Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0])
  //       let key = Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0];
  //       let elem = document.getElementById(midiNoteInfo[midiNoteInfo.length - 1][key].props.id)
  //       var event = new MouseEvent('dblclick', {
  //         'view': window,
  //         'bubbles': true,
  //         'cancelable': true
  //       });
  //       elem?.dispatchEvent(event);
  //       setOrderOfEvents((orderOfEvents) => {
  //         let state = [...orderOfEvents];
  //         state.shift();
  //         // console.log('0', state)
  //         return state;
  //       })
  //     }
  //   } else {
  //     props.controlsDispatch({type: 'undo', undo: false});
  //   }
  // }, [props.controlsState.undo])

  // useEffect(() => {
  //   if(Object.keys(notesRemoved).length > 0) {
  //     let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
  //     let key = Object.keys(notesRemoved[0][remIndex])[0]
  //     let start = notesRemoved[0][remIndex][key].keyPressed!.start;
  //     let end = notesRemoved[0][remIndex][key].keyPressed!.end! - 1;
  //     let noteOct = key.replace(start!.toString(), '')

  //     // console.log(key[0])
  //     // console.log(notesRemoved[0][key].keyPressed!.start)
  //     Object.keys(qwertyNote).forEach((qwerty) => {
  //       if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
  //         // console.log(start, end)
  //         props.onNoteRemoved(start, end)
  //       }
  //     });
  //   }
  // }, [notesRemoved])


  
  // Notes clicked onto grid
  // useEffect(() => {
  //   // console.log(clickCoords)
  //   if(props.noteTracksRef.current) {
  //     let noteTrackElem: Element ;
  //     let noteTrackId = '';
  //     let subdivElem: Element ;
  //     let subdivId = '';
  //     let countTemp = count;
  //     // console.log('pp')
  //     document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
  //       if(elem.getAttribute('class') === 'note-track') {
  //         // console.log('note')
  //         noteTrackElem = elem;
  //         noteTrackId = elem.id;
  //         // console.log(elem)
  //       }
  //       if(elem.getAttribute('class') === 'subdivision') {
  //         // console.log(midiNoteInfo)
  //         subdivElem = elem;
  //         subdivId = elem.id;
  //       }
  //     })
  //     // console.log(noteTrackId, subdivId)
  //     if(noteTrackId.length > 0 && subdivId.length > 0) {
  //       let noteOct = noteTrackId.replace('-track', '');
  //       let subdiv = parseInt(subdivId.replace(/\D/g, ''));
  //       // console.log('rect')
  //       let rect = subdivElem!.getBoundingClientRect();
  //       // console.log(rect)
  //       // console.log(props.noteTracksRef.current!.children)
  //       let left = rect.left;
  //       let width = rect.right - rect.left;
  //       let height = props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2;
  //       if((subdiv - 1) % props.subdiv === 0) {
  //         // left += 2;
  //         width -= 2;
  //       }
  //       console.log(left, width, {
  //         height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
  //         marginLeft: `${left }px`,
  //         width: `${width - 1}px`,
  //       })
  //       let start = Math.trunc((left - .08 * window.innerWidth) / props.noteTracksRef.current!.offsetWidth * (props.midiLength * props.pulseRate));
  //       let end = Math.trunc((left + width - .08 * window.innerWidth) / props.noteTracksRef.current!.offsetWidth * (props.midiLength * props.pulseRate));
  //       setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, ...[{[start + noteOct]: {
  //         key: noteTrackId + countTemp,
  //         keyPressed: {
  //           octave: parseInt(noteOct.replace(/\D/g, '')),
  //           pressed: true,
  //           start: start,
  //           end: end,
  //         },
  //         noteTrackId: noteTrackId,
  //         noteTracksRef: props.noteTracksRef,
  //         props: {
  //           id: start + noteTrackId + '-' + countTemp,
  //           className: 'midi-note',
  //           style: {
  //             height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
  //             marginLeft: `${6 + left / props.noteTracksRef.current!.offsetWidth}vw`,
  //             width: `${width - 1}px`,
  //           },
  //         },
  //       }}]])

  //       Object.keys(qwertyNote).forEach((qwerty) => {
  //         if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
  //           // console.warn(qwertyNote[qwerty]);
  //           props.onNoteClicked(noteOct, {
  //             key: qwerty,
  //             octave: parseInt(noteOct.replace(/\D/g,'')),
  //             pressed: true,
  //             start: start,
  //             end: -1,
  //           }, {
  //             key: qwerty,
  //             octave: noteOct.replace(/\D/g,''),
  //             pressed: false,
  //             start: start,
  //             end: Math.trunc((left - .08 * window.innerWidth) / props.noteTracksRef.current!.offsetWidth * (props.midiLength * props.pulseRate) + width / props.noteTracksRef.current!.offsetWidth * (props.midiLength * props.pulseRate) - 1),
  //           })
  //         }
  //       })
  //       countTemp++;
  //       setCount(countTemp);
  //       setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
  //     }
  //   }
    
  // }, [clickCoords])

  // useEffect(() => {
  //   const addNoteBox = () => {
  //     let key: string;
  //     let octave: number;
  //     let countTemp = count;
  //     if(props.noteTracksRef.current) {
  //       Object.keys(props.keysPressed).forEach((noteOct) => {
  //         octave = parseInt(noteOct.replace(/\D/g,''));
  //         console.log(widths)
  //         let noteStart = props.keysPressed[noteOct].start + noteOct;
  //         // console.log(widths[noteStart].start)
  //         if(props.keysPressed[noteOct].pressed && widths[noteStart].start !== undefined) {
  //           // console.log(widths)
  //           let width: number;
  //           // console.error(widths)
  //           if(widths[noteStart].end) {
  //             width = widths[noteStart].end! - widths[noteStart].start;
  //           } else {
  //             width = props.pulseNum - widths[noteStart].start;
  //             // console.log(props.pulseNum , widths[noteStart].start)
  //           }
  //           let noteTrackId = `${noteOct}-track`;
  //           // console.error(width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth)
  //           setMidiNoteInfo((midiNoteInfo) => ({...midiNoteInfo, [props.keysPressed[noteOct].start + noteOct]: {
  //             key: noteTrackId + countTemp,
  //             props: {
  //               id: props.keysPressed[noteOct].start + noteTrackId + '-' + countTemp,
  //               className: 'midi-note',
  //               style: {
  //                 height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 4}px`,
  //                 marginLeft: `${.08 * window.innerWidth + (props.keysPressed[noteOct].start! / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current!.offsetWidth + 2}px`,
  //                 width: `${width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth - 3}px`,
  //               }
  //             },
  //             keyPressed: props.keysPressed[noteOct],
  //             noteTrackId: noteTrackId,
  //             noteTracksRef: props.noteTracksRef,
  //           }}))
  //           setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
  //           countTemp++;
  //           setCount(countTemp);
  //         }
  //       })
  //     }
  //     // setCount(countTemp)
  //   }

  //   // console.log(props.noteTracksRef.current?.children)
  //   if(props.noteTracksRef && props.midiState.mode === 'recording') {
  //     addNoteBox();
  //   }
  //   if(props.midiState.mode != 'recording') {
  //     // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
  //   }
  //   // console.warn(midiNotesArr, props.midiState.mode)
  // }, [props.noteTracksRef, props.midiState.mode, widths]);




  // const items = midiNotesArr.map((items) => (<>{items}</>));
  return (
    <>
      {midiNotes}
    </>
  )
}

export default MidiNotes