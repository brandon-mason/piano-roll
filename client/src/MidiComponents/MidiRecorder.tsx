import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes} from 'react';
import { createPortal } from 'react-dom';
import { MidiRecorded, KeysPressed, MidiRecorderProps, KeyPressed, MidiNoteInfo, NotesRemoved } from '../Tools/Interfaces';
import axios from 'axios';
import MidiWriter from 'midi-writer-js';
// import MidiNotes from './MidiNotes';
import MidiNotes from './MidiNotes';
import './MidiRecorder.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
// replace midistate prop with mode prop

function MidiRecorder(props: MidiRecorderProps) {
  const [count, setCount] = useState<number>(0);
  const [clickCoords, setClickCoords] = useState<number[]>([]);
  const [midiRecorded, setMidiRecorded] = useState<MidiRecorded>({});
  const [midiRecording, setMidiRecording] = useState<MidiRecorded>({});
  const [midiNoteInfo, setMidiNoteInfo] = useState<MidiNoteInfo[]>([]);
  // const [midiNotes, setMidiNotes] = useState<ReactPortal[]>([]);
  const [notesRemoved, setNotesRemoved] = useState<NotesRemoved[]>([]);
  const [orderOfEvents, setOrderOfEvents] = useState<number[]>([]);

  useEffect(() => {
    // console.log(props.midiState.mode)
  }, [props.midiState.mode])

  // Add or remove note upon clicking a note track or a note
  useEffect(() => {
    function addRemNote(e: MouseEvent) {
      var elem: HTMLElement;
      if(e.target){
        elem = e.target as HTMLElement;
        // console.log(props.midiState.mode)
        if(elem.tagName == "DIV") {
          setClickCoords([e.clientX, e.clientY]);
          // setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
        } else if(elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
          let key = elem.id.substring(0, elem.id.indexOf('-'));
          let remIndex = 0;
          for(var i = 0; i < midiNoteInfo.length; i++) {
            if(Object.keys(midiNoteInfo[i])[0] === key) remIndex = i;
          }
          // console.log(remIndex, key, midiNoteInfo[remIndex][key])
          // let remProp = 
          setNotesRemoved((notesRemoved) => [{[remIndex]: {[key]: midiNoteInfo[remIndex][key]}}, ...notesRemoved]);
          setMidiNoteInfo((midiNoteInfo) => {
            let state = [...midiNoteInfo];
            state.splice(remIndex, 1)
            return state;
          });
          // setMidiNotes([])
          if(props.controlsState.undo) {
            props.controlsDispatch({type: 'undo', undo: false});
          } else {
            setOrderOfEvents((orderOfEvents) => [1, ...orderOfEvents]);
          }
        }
      }
    }

    if(props.noteTracksRef.current) {
      props.noteTracksRef.current.addEventListener('dblclick', addRemNote)
    }

    return () => {
      if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
    }
  }, [props.noteTracksRef.current, midiNoteInfo, props.midiState.mode])

  useLayoutEffect(() => {

  }, [props.midiState.mode])

  // Add notes from clicking
  useEffect(() => {
    // console.log(clickCoords)
    if(props.noteTracksRef.current) {
      let noteTrackElem: Element ;
      let noteTrackId = '';
      let subdivElem: Element ;
      let subdivId = '';
      let countTemp = count;
      if(document.elementsFromPoint(clickCoords[0], clickCoords[1]).length > 0) {
        document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
          if(elem.getAttribute('class') === 'note-track') {
            // console.log('note')
            noteTrackElem = elem;
            noteTrackId = elem.id;
            // console.log(elem)
          }
          if(elem.getAttribute('class') === 'subdivision') {
            // console.log(midiNoteInfo)
            subdivElem = elem;
            subdivId = elem.id;
          }
        })
      }
      // console.log(noteTrackId, subdivId)
      if(noteTrackId.length > 0 && subdivId.length > 0) {
        let noteOct = noteTrackId.replace('-track', '');
        let subdiv = parseInt(subdivId.replace(/\D/g, ''));
        // console.log('rect')
        let rect = subdivElem!.getBoundingClientRect();
        // console.log(rect)
        // console.log(props.noteTracksRef.current!.children)
        let left = rect.left;
        let width = rect.right - rect.left;
        let height = props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2;
        if((subdiv - 1) % props.midiState.subdiv === 0) {
          // left += 2;
          width -= 2;
        }
        let start = Math.trunc((subdiv - 1) / (props.midiState.numMeasures * props.midiState.subdiv) * props.midiLength * props.pulseRate);
        let end = Math.trunc(start + 1 / (props.midiState.subdiv * props.midiState.numMeasures) * props.midiLength * props.pulseRate) - 1;
        // console.log(1/16*1000, subdiv - 1 , props.midiState.numMeasures , props.midiState.subdiv , props.noteTracksRef.current!.offsetWidth, start, end)
        setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, ...[{[start + noteOct]: {
          key: noteTrackId + countTemp,
          keyPressed: {
            octave: parseInt(noteOct.replace(/\D/g, '')),
            pressed: true,
            start: start,
            end: end,
          },
          noteTrackId: noteTrackId,
          noteTracksRef: props.noteTracksRef,
          props: {
            id: start + noteTrackId + '-' + countTemp,
            className: 'midi-note',
          },
        }}]])

        Object.keys(qwertyNote).forEach((qwerty) => {
          if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
            // console.warn(qwertyNote[qwerty]);
            setMidiRecorded((midiRecorded) => (
              {
                ...midiRecorded, [start]: {
                  ...midiRecorded[start], 
                  ...{[noteOct]: {
                    key: qwerty,
                    octave: parseInt(noteOct.replace(/\D/g,'')),
                    pressed: true,
                    start: start,
                    end: -1,
                  }}
                }, 
                [end]: {
                  ...midiRecorded[end], 
                  ...{[noteOct]: {
                    key: qwerty,
                    octave: parseInt(noteOct.replace(/\D/g,'')),
                    pressed: false,
                    start: start,
                    end: end,
                  }}
                }
              }
            ));
          }
        })
        countTemp++;
        setCount(countTemp);
        setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
      }
    }
  }, [clickCoords])

  // Add notes from recording
  useEffect(() => {
    if(props.noteTracksRef && props.midiState.mode === 'recording') {
    // const updateMidiNoteInfo = () => {
      let key: string;
      let octave: number;
      let countTemp = count;
      if(props.noteTracksRef.current) {
        Object.keys(props.keysPressed).forEach((noteOct) => {
          // console.warn(noteOct)
          octave = parseInt(noteOct.replace(/\D/g,''));
          // console.log(props.keysPressed[noteOct].pressed)
          let noteStart = props.keysPressed[noteOct].start + noteOct;
          if(props.keysPressed[noteOct].pressed && !midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
            // console.log('bee')
            let noteTrackId = `${noteOct}-track`;
            setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, {[noteStart]: {
              key: `${noteTrackId}-${countTemp}`,
              props: {
                id: props.keysPressed[noteOct].start + noteTrackId + '-' + countTemp,
                className: 'midi-note',
              },
              keyPressed: props.keysPressed[noteOct],
              noteTrackId: noteTrackId,
              noteTracksRef: props.noteTracksRef,
            }}])
            setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
            countTemp++;
            setCount(countTemp);
          } else if(!props.keysPressed[noteOct].pressed) {
            // console.log(midiNoteInfo.length)
            for(let i = midiNoteInfo.length - 1; i > -1; i--) {
              if(Object.keys(midiNoteInfo[i])[0] === noteStart) {

                // console.log('what', noteStart)
                // console.log(midiNoteInfo[i][noteStart].keyPressed, {...midiNoteInfo[i][noteStart].keyPressed, ...{end: props.keysPressed[noteOct].end}})
                setMidiNoteInfo((midiNoteInfo) => {
                  // console.log(props.keysPressed[noteOct].end)
                  let state = [...midiNoteInfo];
                  // console.log(state[i][noteStart])
                  let newNoteInfo = {[noteStart]: {...state[i][noteStart], keyPressed: props.keysPressed[noteOct]}}
                  // console.error(i, midiNoteInfo[i], newNoteInfo)
                  state.splice(i, 1, newNoteInfo);
                  // console.log(state)
                  return state;
                })
                break;
              }
            }
          }
        })
      }
    }
  }, [props.noteTracksRef, props.midiState.mode, props.keysPressed]);

  // Undo add or remove note from midiRecorded
  useEffect(() => {
    // console.error(props.controlsState.undo)
    if(props.controlsState.undo && orderOfEvents.length > 0) {
      if(orderOfEvents[0] === 1) {
        let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
        let key = Object.keys(notesRemoved[0][remIndex])[0]
        let start = notesRemoved[0][remIndex][key].keyPressed!.start;
        let end = notesRemoved[0][remIndex][key].keyPressed!.end! - 1;
        let noteOct = key.replace(start!.toString(), '')
        props.controlsDispatch({type: 'undo', undo: false});
        setMidiNoteInfo((midiNoteInfo) => {
          let state = [...midiNoteInfo];// , {...notesRemoved[0]}]));
          state.splice(remIndex, 0, notesRemoved[0][remIndex])
          return state;
        })
        Object.keys(qwertyNote).forEach((qwerty) => {
          if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
            setNotesRemoved((notesRemoved) => {
              let state = [...notesRemoved];
              state.shift();
              return state;
            })
            // console.log(note);
            // let key = Object.keys(note)
            // let qwerty
            setMidiRecorded((midiRecorded) => (
              {
                ...midiRecorded, [start!]: {
                  ...midiRecorded[start!], 
                  ...{[noteOct]: {
                    key: qwerty,
                    octave: parseInt(noteOct.replace(/\D/g,'')),
                    pressed: true,
                    start: start,
                    end: -1,
                  }}
                }, 
                [end!]: {
                  ...midiRecorded[end!], 
                  ...{[noteOct]: {
                    key: qwerty,
                    octave: parseInt(noteOct.replace(/\D/g,'')),
                    pressed: false,
                    start: start,
                    end: end,
                  }}
                }
              }
            ));
          }
        });
        setOrderOfEvents((orderOfEvents) => {
          let state = [...orderOfEvents];
          state.shift();
          // console.log('1',state)
          return state;
        })
      } else {
        // console.warn(Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0])
        let key = Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0];
        let elem = document.getElementById(midiNoteInfo[midiNoteInfo.length - 1][key].props.id)
        var event = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        elem?.dispatchEvent(event);
        setOrderOfEvents((orderOfEvents) => {
          let state = [...orderOfEvents];
          state.shift();
          // console.log('0', state)
          return state;
        })
      }
    } else {
      props.controlsDispatch({type: 'undo', undo: false});
    }
  }, [props.controlsState.undo])

  // Remove deleted notes from midiRecorded
  useEffect(() => {
    if(Object.keys(notesRemoved).length > 0) {
      let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
      let key = Object.keys(notesRemoved[0][remIndex])[0]
      let start = notesRemoved[0][remIndex][key].keyPressed!.start;
      let end = notesRemoved[0][remIndex][key].keyPressed!.end! - 1;
      let noteOct = key.replace(start!.toString(), '')

      // console.log(key[0])
      // console.log(notesRemoved[0][key].keyPressed!.start)
      Object.keys(qwertyNote).forEach((qwerty) => {
        if(start && qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
          // console.log(start, end)
          // props.onNoteRemoved(start, end) 
          setMidiRecorded((midiRecorded) => {
            const state = {...midiRecorded};
            delete state[start!];
            delete state[end];
            return state;
        });
        }
      });
    }
  }, [notesRemoved])


  // Add notes from current recording 
  useEffect(() => {
    if(props.midiState.mode === 'keyboard' && Object.keys(midiRecording).length > 0) {
      setMidiRecorded((midiRecorded) => ({...midiRecorded, ...midiRecording}));
      setMidiRecording({});
    }
  }, [midiRecording, props.midiState.mode])
  useEffect(() => {
    // console.log(midiRecording)
  }, [midiRecording])

  // Recording and playback handler
  useEffect(() => {
    const recording = () => {
      setMidiRecording((midiRecording) => ({...midiRecording, [props.pulseNum]: props.keysPressed}));
      // console.log({[props.pulseNum]: props.keysPressed})
    }

    // if(props.pulseNum >= props.midiLength * props.pulseRate) props.midiDispatch({type: 'mode', mode: 'keyboard'})

    if(props.midiState.mode === 'recording' && props.keysPressed) {
      recording();
    } 
  }, [props.keysPressed, props.midiState.mode]);

  // useEffect(() => {
  //   const playing = () => {
  //     // console.log('midiRecorded', midiRecorded)
  //     Object.keys(midiRecorded).forEach((timeKey) => {
  //       console.log(timeKey)
  //       // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
  //       if(props.pulseNum === parseInt(timeKey)) {
  //         console.log(midiRecorded[parseInt(timeKey)])
  //         props.setPlayback(midiRecorded[parseInt(timeKey)])
  //       }
  //     })
  //   }
  //   if(props.midiState.mode === 'playing' || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
  //     playing();
  //   }
  // }, [props.pulseNum, props.midiState.mode]);
  useEffect(() => {
    const playing = () => {
      // console.log('midiRecorded', midiRecorded)
      Object.keys(midiRecorded).forEach((timeKey) => {
        console.log(timeKey)
        // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
        if(props.pulseNum === parseInt(timeKey)) {
          console.log(midiRecorded[parseInt(timeKey)])
          props.setPlayback(midiRecorded[parseInt(timeKey)])
        }
      })
    }
    /*if((props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
        console.log(Object.keys(midiRecorded), midiRecorded[props.pulseNum])

        props.setPlayback(midiRecorded[props.pulseNum])
      
      // playing();
    }
    else*/ if(props.midiState.mode === 'playing' || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
      if(Object.keys(midiRecorded).includes(props.pulseNum + ''))
      {
        console.log(Object.keys(midiRecorded), midiRecorded[props.pulseNum])
        props.setPlayback(midiRecorded[props.pulseNum])
      }
      // playing();
    }
  }, [props.pulseNum, props.midiState.mode]);

  function getPressed(): KeysPressed {
    let pressed = {}
    Object.keys(props.keysPressed).forEach((noteOct) => {
      if(Object.values(props.keysPressed[noteOct]).includes(true)) {
        pressed = {...pressed, [noteOct]: props.keysPressed[noteOct]};
      }
    })
    console.log(pressed)
    return pressed;
  }

  function setNoteClicked(noteOct: string, noteStartProps: KeyPressed, noteEndProps: KeyPressed) {
    console.log(noteOct, noteStartProps, noteEndProps);
    console.warn({
      ...midiRecorded[noteStartProps.start!], 
      [noteOct]: noteStartProps
    }, noteStartProps.start)
    console.warn({
      ...midiRecorded[noteEndProps.end!], 
      [noteOct]: noteEndProps
    })
    setMidiRecorded((midiRecorded) => (
      {
        ...midiRecorded, [noteStartProps.start!]: {
          ...midiRecorded[noteStartProps.start!], 
          ...{[noteOct]: noteStartProps}
        }, 
        [noteEndProps.end!]: {
          ...midiRecorded[noteEndProps.end!], 
          ...{[noteOct]: noteEndProps}
        }
      }
    ));
  }
  function setNoteRemoved(start: number, end: number) {
    console.log(start, end)
    setMidiRecorded((midiRecorded) => {
        const state = {...midiRecorded};
        delete state[start];
        delete state[end];
        return state;
    });
  }
  
  return (
    <MidiNotes midiRecorded={midiRecorded} midiNoteInfo={midiNoteInfo} notesRemoved={notesRemoved} orderOfEvents={orderOfEvents} controlsState={props.controlsState} midiLength={props.midiLength} midiState={props.midiState} pulseNum={props.pulseNum} pulseRate={props.pulseRate} noteTracksRef={props.noteTracksRef} subdiv={props.midiState.subdiv} controlsDispatch={props.controlsDispatch}/>
  )
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;