import React, { useState, useEffect, createElement, useLayoutEffect, ReactPortal, ReactElement, DetailedReactHTMLElement, HTMLAttributes} from 'react';
import { createPortal } from 'react-dom';
import { MidiRecorded, KeysPressed, MidiRecorderProps, MidiNoteInfo, NotesRemoved } from '../Tools/Interfaces';
import axios from 'axios';
// import MidiNotes from './MidiNotes';
import MidiNotes from './MidiNotes';
import './MidiRecorder.css';
import SaveExport from '../SettingsComponents/SaveExport';
import SavedTracks from '../SettingsComponents/SavedTracks';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
// replace midistate prop with mode prop

interface PlaybackOff {

}

function MidiRecorder(props: MidiRecorderProps) {
  const [count, setCount] = useState<number>(0);
  const [clickCoords, setClickCoords] = useState<number[]>([]);
  const [midiRecorded, setMidiRecorded] = useState<MidiNoteInfo[]>([]);
  const [midiRecording, setMidiRecording] = useState<MidiRecorded>({});
  const [midiNoteInfo, setMidiNoteInfo] = useState<MidiNoteInfo[]>([]);
  const [notesRemoved, setNotesRemoved] = useState<NotesRemoved[]>([]);
  const [orderOfEvents, setOrderOfEvents] = useState<number[]>([]);
  const [pausePulse, setPausePulse] = useState<number>(-1);
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})
  
  useEffect(() => {
    // console.log('midiNoteInfo', midiNoteInfo)
    console.log('notesRemoved', midiRecording)
  }, [midiRecording])

  // Add or remove note upon clicking a note track or a note
  useEffect(() => {
    function addRemNote(e: MouseEvent) {
      var elem: HTMLElement;
      if(e.target){
        elem = e.target as HTMLElement;
        console.log(props.midiState.mode)
        if(elem.tagName == "DIV") {
          setClickCoords([e.clientX, e.clientY]);
          // setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
        } else if(elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
          console.log('double')
          let key = elem.id.substring(0, elem.id.indexOf('-'));
          let remIndex = 0;
          for(var i = 0; i < midiNoteInfo.length; i++) {
            if(Object.keys(midiNoteInfo[i])[0] === key) remIndex = i;
          }
          console.log(remIndex, key, midiNoteInfo[remIndex])
          // let remProp = 
          setNotesRemoved((notesRemoved) => [ ...notesRemoved, {[remIndex]: {[key]: midiNoteInfo[remIndex][key]}}]);
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

  useEffect(() => {
    if(midiNoteInfo.length > 0 && props.midiState.mode === 'keyboard') {
      let mniTemp: MidiNoteInfo[] = [...midiNoteInfo];
      midiNoteInfo.forEach((midiNote, i, midiNoteInfo) => {
        let noteStart = Object.keys(midiNote)[0];
        if(midiNote[noteStart].keyPressed) {
          if(midiNote[noteStart].keyPressed!.end === -1) {
            mniTemp[i][noteStart] = {...midiNoteInfo[i][noteStart], 
              keyPressed: {...midiNoteInfo[i][noteStart].keyPressed, end: props.pulseNum}
            }
          }
        }
      });
      setPausePulse(props.pulseNum);
      // console.log(mniTemp)
      setMidiNoteInfo(mniTemp);
    }
  }, [props.midiState.mode]);

  // Add notes from midiNoteInfo to midiRecorded.
  useEffect(() => {
    if(midiNoteInfo.length > 0) {
      // console.log(midiNoteInfo);
      let midiRecTemp: MidiRecorded = {};
      midiNoteInfo.forEach((noteInfo) => {
        let noteStart = Object.keys(noteInfo)[0]
        if(noteInfo[noteStart].keyPressed) {
          let noteOct = noteStart.replace(noteInfo[noteStart].keyPressed!.start.toString(), '')
          // console.log(qwertyNote[noteInfo[noteStart].keyPressed!.key!])
          let qwertyKeys = Object.keys(qwertyNote)
          for(var i = 0; i < qwertyKeys.length; i++) {
            if(qwertyNote[qwertyKeys[i]].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwertyKeys[i]].octave === 0) {
              // console.log(noteOct)
              let startNote = {
                key: qwertyKeys[i],
                octave: parseInt(noteOct.replace(/\D/g,'')),
                pressed: true,
                start: noteInfo[noteStart].keyPressed!.start,
                end: -1,
              };
              let endNote = {
                key: qwertyKeys[i],
                octave: parseInt(noteOct.replace(/\D/g,'')),
                pressed: false,
                start: noteInfo[noteStart].keyPressed!.start,
                end: noteInfo[noteStart].keyPressed!.end,
              };
              // console.log(noteInfo[noteStart].keyPressed!.start)
              midiRecTemp = {
                ...midiRecTemp, [noteInfo[noteStart].keyPressed!.start]: {
                  ...midiRecTemp[noteInfo[noteStart].keyPressed!.start], 
                  ...{[noteOct]: startNote}
                }, 
                [noteInfo[noteStart].keyPressed!.end]: {
                  ...midiRecTemp[noteInfo[noteStart].keyPressed!.end], 
                  ...{[noteOct]: endNote}
                }
              }
              break;
            }
          }
        }
        
      })
      // setMidiRecorded(midiRecTemp)
    }
  }, [midiNoteInfo])

  // Add notes from clicking to midiNoteInfo.
  useEffect(() => {
    if(props.noteTracksRef.current) {
      let noteTrackElem: Element ;
      let noteTrackId = '';
      let subdivElem: Element ;
      let subdivId = '';
      let countTemp = count;
      if(document.elementsFromPoint(clickCoords[0], clickCoords[1]).length > 0) {
        document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
          if(elem.getAttribute('class') === 'note-track') {
            noteTrackElem = elem;
            noteTrackId = elem.id;
          }
          if(elem.getAttribute('class') === 'subdivision') {
            subdivElem = elem;
            subdivId = elem.id;
          }
        })
      }
      if(noteTrackId.length > 0 && subdivId.length > 0) {
        let noteOct = noteTrackId.replace('-track', '');
        let key = (() => {
          Object.keys(qwertyNote).forEach((qwerty) => {
            // console.log(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
            if(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '')) return qwerty;
          })
          return '';
        })();
        // console.error(key)
        let subdiv = parseInt(subdivId.replace(/\D/g, ''));
        let rect = subdivElem!.getBoundingClientRect();
        let left = rect.left;
        let width = rect.right - rect.left;
        let height = props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2;
        if((subdiv - 1) % props.midiState.subdiv === 0) {
          width -= 2;
        }
        let start = Math.trunc((subdiv - 1) / (props.midiState.numMeasures * props.midiState.subdiv) * props.midiLength * props.pulseRate);
        let end = Math.trunc(start + 1 / (props.midiState.subdiv * props.midiState.numMeasures) * props.midiLength * props.pulseRate) - 1;
        setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, ...[{[start + noteOct]: {
          key: noteTrackId + countTemp,
          keyPressed: {
            key: key,
            // octave: parseInt(noteOct.replace(/\D/g, '')),
            pressed: true,
            start: start,
            end: end,
          },
          noteTrackId: noteTrackId,
          props: {
            id: start + noteTrackId + '-' + countTemp,
            className: 'midi-note',
          },
        }}]])

        countTemp++;
        setCount(countTemp);
        setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
      }
    }
  }, [clickCoords])

  // Undo add or remove note from midiNoteInfo.
  useEffect(() => {
    // console.error(props.controlsState.undo)
    if(props.controlsState.undo && orderOfEvents.length > 0 && notesRemoved.length > 0) {
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
            let startNote = {
              key: qwerty,
              octave: parseInt(noteOct.replace(/\D/g,'')),
              pressed: true,
              start: start,
              end: -1,
            };
            let endNote = {
              key: qwerty,
              octave: parseInt(noteOct.replace(/\D/g,'')),
              pressed: false,
              start: start,
              end: end,
            };

            setNotesRemoved((notesRemoved) => {
              let state = [...notesRemoved];
              state.shift();
              return state;
            })
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

  // Add notes from recording to midiNoteInfo
  useEffect(() => {
    function findSameNote(noteOct: string, start: number, end: number) {
      // var start = parseInt(start.substring(0, noteStart.indexOf(noteOct)));
      midiNoteInfo.forEach((midiNote, i) => {
        var noteStart2 = Object.keys(midiNote)[0];
        var noteOct2 = midiNote[noteStart2].noteTrackId.substring(0, midiNote[noteStart2].noteTrackId.indexOf('-'))

        if(noteOct === noteOct2) {
          var start2 = parseInt(noteStart2.substring(0, noteStart2.indexOf(noteOct2)));
          var end2 = midiNote[noteStart2].keyPressed.end;

          if(start < end2 && start > start2) {
            setMidiNoteInfo((midiNoteInfo) => {
              let state = [...midiNoteInfo];
              
              state[i][noteStart2].keyPressed = {...state[i][noteStart2].keyPressed, end: start - 1}
              return state
            })
          }
        }
      })
    }

    if(props.noteTracksRef && props.midiState.mode === 'recording') {
      if(props.noteTracksRef.current) {
        let countTemp = count;
        let noteRecorded: MidiNoteInfo[] = [];

        Object.keys(props.keysPressed).forEach((noteOct) => {
          let noteStart = props.keysPressed[noteOct].start + noteOct;

          if(props.keysPressed[noteOct].pressed && !midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
            let noteTrackId = `${noteOct}-track`;
            let end = (props.keysPressed[noteOct].start - props.keysPressed[noteOct].end !== props.keysPressed[noteOct].start) ? props.keysPressed[noteOct].end : props.midiLength * props.pulseRate;

            findSameNote(noteOct, props.keysPressed[noteOct].start, end);
            var midiNote = {[noteStart]: {
              key: `${noteTrackId}-${countTemp}`,
              props: {
                id: props.keysPressed[noteOct].start + noteTrackId + '-' + countTemp,
                className: 'midi-note',
              },
              keyPressed: props.keysPressed[noteOct],
              noteTrackId: noteTrackId,
            }};
            setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, midiNote])
            setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
            countTemp++;
            setCount(countTemp);
          } else if(!props.keysPressed[noteOct].pressed) {
            // console.log('brandon')
            for(let i = midiNoteInfo.length - 1; i > -1; i--) {
              if(midiNoteInfo[i][Object.keys(midiNoteInfo[i])[0]].keyPressed.end !== -1) break;
              // console.log(midiNoteInfo[i] , noteStart);
              let newMidiNote: MidiNoteInfo;
              if(Object.keys(midiNoteInfo[i])[0] === noteStart) {
                setMidiNoteInfo((midiNoteInfo) => {
                  let state = [...midiNoteInfo];
                  newMidiNote = {[noteStart]: {...state[i][noteStart], keyPressed: props.keysPressed[noteOct]}}
                  noteRecorded.push(newMidiNote)
                  state.splice(i, 1, newMidiNote);
                  console.warn(newMidiNote)
                  return state;
                })
                console.log(noteRecorded)
                setMidiRecorded((midiRecorded) => [...midiRecorded, newMidiNote])
                break;
              }
            }
          }
        })
      }
    }
  }, [props.pulseNum, props.midiState.mode, props.keysPressed]);

  // Correct notes that go beyond midiLength
  useEffect(() => {
    if(midiNoteInfo.length > 0 && props.midiState.mode === 'stop') {
      let state = [...midiNoteInfo]
      for(let i = midiNoteInfo.length - 1; i > -1; i--) {
        let noteOct = Object.keys(state[i])[0];

        if(state[i][noteOct].keyPressed.end <= 0) {
          state[i][noteOct] = {...state[i][noteOct], keyPressed: {...state[i][noteOct].keyPressed, end: props.midiLength * props.pulseRate}}
        } else {
          break;
        }
      }
      setMidiNoteInfo(state);
    }
  }, [midiNoteInfo, props.midiState.mode]);

  // Add notes from current recording 
  useEffect(() => {
    if(props.midiState.mode === 'keyboard' && Object.keys(midiRecorded).length > 0) {
      console.log(midiRecorded, props.pulseNum);
      console.log(midiNoteInfo, props.pulseNum);
      let mniTemp = [...midiNoteInfo]
      midiRecorded.forEach((midiNote) => {
        var noteStart = Object.keys(midiNote)[0];
        var start = midiNote[noteStart].keyPressed.start;
        var end = midiNote[noteStart].keyPressed.end;

        for(var i = 0; i < midiNoteInfo.length; i++) {
          var midiNote2 = midiNoteInfo[i];
          var noteStart2 = Object.keys(midiNote2)[0]
          var start2 = midiNote2[noteStart2].keyPressed.start;
          var end2 = midiNote2[noteStart2].keyPressed.end;
          console.log(noteStart === noteStart2 , start2 , start , start2 , end);
          console.log(noteStart === noteStart2 && start2 > start && start2 < end);
          if(noteStart === noteStart2 && start2 < start && start2 < end) {
            console.log(mniTemp.slice(i, 1));
            break
          }
        }
      })
      setMidiNoteInfo(mniTemp)
      setMidiRecorded([]);
    }
  }, [midiRecorded, props.midiState.mode])

  useEffect(() => {
      props.setPlayback(midiRecorded);
      console.log(midiRecorded)
  }, [midiRecorded]);

  useEffect(() => {
    // console.log(midiRecorded);
    // if(midiNoteInfo) {
      
    // }
  }, [midiRecorded]);
  
  return (
    <>
      <MidiNotes gridSize={props.gridSize} midiNoteInfo={midiNoteInfo} notesRemoved={notesRemoved} orderOfEvents={orderOfEvents} controlsState={props.controlsState} midiLength={props.midiLength} midiState={props.midiState} pulseNum={props.pulseNum} pulseRate={props.pulseRate} noteTracksRef={props.noteTracksRef} subdiv={props.midiState.subdiv} controlsDispatch={props.controlsDispatch}/>
      {props.selectorsRef.current && createPortal(<>
      <SavedTracks midiNoteInfoLength={midiNoteInfo.length} username={props.username} setMidiNoteInfo={setMidiNoteInfo} />
      <SaveExport controlsDispatch={props.controlsDispatch} midiNoteInfo={midiNoteInfo} mode={props.midiState.mode} username={props.username} setFocus={props.setFocus} setTrackName={props.setTrackName} />
      </>,
        props.selectorsRef.current)}
    </>
  )
}
// 1000 / (120 / 60) * 4 * 4
export default MidiRecorder;