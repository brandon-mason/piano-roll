import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MidiRecorderProps, MidiNoteInfo, NotesRemoved, KeyPressed, Midi } from '../../Tools/Interfaces';
// import MidiNotes from './MidiNotes';
import MidiNotes from '../MidiNotes/MidiNotes';
import './MidiRecorder.css';
// import SavedTracks from '../../SettingsComponents/SavedTracks/SavedTracks';
// import SaveExport from '../../SettingsComponents/SaveExport/SaveExport';
const qwertyNote = require('../../Tools/JSON/note-to-qwerty-key-obj');
// replace midistate prop with mode prop

interface NotesAdded {
  [noteTrackId: string]: {pulse: number};

}

function MidiRecorder(props: MidiRecorderProps) {
  const [count, setCount] = useState<number>(0);
  const [clickCoords, setClickCoords] = useState<number[]>([]);
  const [midiRecorded, setMidiRecorded] = useState<Map<string, KeyPressed>[]>([]);
  const [midiRecording, setMidiRecording] = useState<MidiNoteInfo[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [notesAdded, setNotesAdded] = useState<NotesAdded[]>([]);
  const [orderOfEvents, setOrderOfEvents] = useState<MidiNoteInfo[][]>([]);
  const [startVal, setStartVal] = useState(0);
  const [origVal, setOrigVal] = useState<number>(0)
  const moveNote = useRef<MidiNoteInfo>({});

  useEffect(() => {
    const changeStart = (midiNoteInfo: MidiNoteInfo[], midiNote: MidiNoteInfo, modifier: number, noteOct: string) => {
      let state = [...midiNoteInfo];
      let props;
      let noteTrackId;
      let keyPressed;
      let midiNoteCp: MidiNoteInfo;
      
      if(Object.keys(moveNote.current).length > 0) {
        midiNoteCp = moveNote.current;
      } else {
        midiNoteCp = midiNote
      }

      props = {...state[state.indexOf(midiNoteCp)][Object.keys(midiNoteCp)[0]].props};
        noteTrackId = state[state.indexOf(midiNoteCp)][Object.keys(midiNoteCp)[0]].noteTrackId;
        keyPressed = {...state[state.indexOf(midiNoteCp)][Object.keys(midiNoteCp)[0]].keyPressed};
        state[state.indexOf(midiNoteCp)] = {
          [modifier + noteOct.substring(noteOct.indexOf(noteOct.replace(/[0-9]/g, '')), noteOct.length)]: {
            keyPressed: keyPressed,
            props: props,
            noteTrackId: noteTrackId,
            key: state[state.indexOf(midiNoteCp)][Object.keys(midiNoteCp)[0]].key,
          }
        };

      keyPressed.start = modifier;
      props.id = modifier + noteTrackId.substring(0, noteTrackId.indexOf('-')) + props.id.substring(props.id.indexOf('-'), props.id.length);
      
      return state;
    }

    const changeEnd = (midiNoteInfo: MidiNoteInfo[], midiNote: MidiNoteInfo, modifier: number) => {
      let state = [...midiNoteInfo];
      let props = {...state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].props};
      let noteTrackId = state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].noteTrackId;
      let keyPressed = {...state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].keyPressed};

      keyPressed.end = modifier;

      let newMidiNote = {
        [Object.keys(midiNote)[0]]: {
          keyPressed: keyPressed,
          props: props,
          noteTrackId: noteTrackId,
          key: state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].key,
        }
      };

      moveNote.current = newMidiNote;

      state[state.indexOf(midiNote)] = newMidiNote;
      // state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].keyPressed.end = modifier;
      return state;
    }

    const onUpdate = (e: MouseEvent) => {
      e.preventDefault();
      if(e.target instanceof Element) {
        if(e.target.className === 'midi-note' && props.noteTracksRef.current && (e.shiftKey || e.ctrlKey || e.metaKey)) {
          let noteOct = e.target.id.substring(0, e.target.id.indexOf('-'));
          setIsDragging(true)
          props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
            let state = [...midiNoteInfo]
            let modifier = Math.trunc((e.clientX - startVal) * props.midiLength * props.pulseRate / props.noteTracksRef.current!.offsetWidth + origVal);
            
            midiNoteInfo.some((midiNote) => {
              if(midiNote && Object.keys(midiNoteInfo[midiNoteInfo.indexOf(midiNote)])[0] === noteOct && startVal > 0 && state[state.indexOf(midiNote)][Object.keys(midiNote)[0]]) {
                let length = state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].keyPressed.end - state[state.indexOf(midiNote)][Object.keys(midiNote)[0]].keyPressed.start

                if(e.shiftKey && (e.ctrlKey || e.metaKey) && modifier > 0 && modifier + length < props.midiLength * props.pulseRate) {
                  state = changeEnd(state, midiNote, modifier + length);
                  state = changeStart(state, midiNote, modifier, noteOct);
                  moveNote.current = {}; // THIS IS WHAT IS CAUSING ORDEROFEVENTS TO UPDATE WHEN SETTINGS BUTTONS ARE CLICKED!!!
                  return true;
                } else if(!e.shiftKey && (e.ctrlKey || e.metaKey) && modifier > midiNote[Object.keys(midiNote)[0]].keyPressed.start && modifier < props.midiLength * props.pulseRate) {
                  state = changeEnd(state, midiNote, modifier);
                  moveNote.current = {};
                  return true;
                } else if(modifier > 0 && modifier < midiNote[Object.keys(midiNote)[0]].keyPressed.end) {
                  state = changeStart(state, midiNote, modifier, noteOct);
                  return true;
                }
              }
            })

            return state;
          });
        }

        // if(e.target.tagName === 'SPAN') {
        //   // console.log(e)
        //   let noteStart = e.target.id.substring(0, e.target.id.indexOf('-'));
        //   let note = (e.target.id.indexOf('#') !== -1 || e.target.id.indexOf('b') !== -1) ? e.target.id.substring(e.target.id.indexOf('-') - 3, e.target.id.indexOf('-')) : e.target.id.substring(e.target.id.indexOf('-') - 2, e.target.id.indexOf('-'));
        //   let start = -1; // parseInt(noteStart.substring(0, noteStart.indexOf(note)));
        //   let end = -1;
        //   console.log(note)
        //   props.midiNoteInfo.forEach((noteInfo, i) => {
        //     if(noteInfo) {
        //       let noteStart2 = Object.keys(noteInfo)[0];
        //       let note2 = (noteStart2.indexOf('#') !== -1 || noteStart2.indexOf('b') !== -1) ? noteStart2.substring(noteStart2.length - 3, noteStart2.length) : noteStart2.substring(noteStart2.length - 2, noteStart2.length);

        //       if(note === note2 && noteStart !== noteStart2) {
        //         console.log(note, note2)
        //         start = noteInfo[noteStart].keyPressed.start;
        //         end = noteInfo[noteStart].keyPressed.end;
        //       } else if(end > -1 && start > -1) {
        //         // console.log(end, start)
        //         let start2 = noteInfo[noteStart2].keyPressed.start;
        //         let end2 = noteInfo[noteStart2].keyPressed.end;

        //         if(start < start2 && end > start2) {
        //           console.log(start , start2 , end , start2)
        //           props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
        //             let state = [...midiNoteInfo];

        //             console.log(state[i])
        //             delete state[i];
        //             return state;
        //           })
        //         }
        //       }
        //     }
        //   })
        // }
      }      
    }

    const onEnd = (e: MouseEvent) => {
      setStartVal(0);
      // if(isDragging) props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => midiNoteInfo)
      setIsDragging(false);
    }

    document.addEventListener('mousemove', onUpdate);
    document.addEventListener('mouseup', onEnd);
    return () => {
      document.removeEventListener('mousemove', onUpdate);
      document.removeEventListener('mouseup', onEnd);
    }
  }, [props.midiNoteInfo, startVal, origVal]);


  // Add or remove note upon clicking a note track or a note
  useEffect(() => {
    const addRemNote = (e: MouseEvent) => {
      var elem: HTMLElement;
      if(e.target){
        elem = e.target as HTMLElement;
        if(elem.tagName == 'DIV') {
          setClickCoords([e.clientX, e.clientY]);
        } else if(elem.tagName === 'SPAN' && props.midiState.mode === 'keyboard') {
          let key = elem.id.substring(0, elem.id.indexOf('-'));
          let remIndex = 0;

          for(var i = 0; i < props.midiNoteInfo.length; i++) {
            if(props.midiNoteInfo[i]) {
              if(Object.keys(props.midiNoteInfo[i])[0] === key) remIndex = i;
            }
          }

          props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
            let state = [...midiNoteInfo];
            state.splice(remIndex, 1)
            return state;
          });

          // if(props.controlsState.undo) {
          //   props.controlsDispatch({type: 'undo', undo: false});
          // } else {
          //   // setOrderOfEvents((orderOfEvents) => [props.midiNoteInfo, ...orderOfEvents]);
          // }
        }
      }
    }

    if(props.noteTracksRef.current) {
      props.noteTracksRef.current.addEventListener('dblclick', addRemNote)
    }

    return () => {
      if(props.noteTracksRef.current) props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
    }
  }, [props.noteTracksRef.current, props.midiNoteInfo, props.midiState.mode])

  // Not exactly sure what this was for.
  // useEffect(() => {
  //   if(props.midiNoteInfo.length > 0 && props.midiState.mode === 'keyboard') {
  //     let mniTemp: MidiNoteInfo[] = [...props.midiNoteInfo];
  //     props.midiNoteInfo.forEach((noteInfo, i, midiNoteInfo) => {
  //       if(noteInfo) {
  //         let noteStart = Object.keys(midiNoteInfo[midiNoteInfo.indexOf(noteInfo)])[0];
  //         if(noteInfo[noteStart].keyPressed) {
  //           if(noteInfo[noteStart].keyPressed!.end === -1) {
  //             mniTemp[i] = {
  //               [noteStart]: {...midiNoteInfo[i][noteStart], 
  //               keyPressed: {...midiNoteInfo[i][noteStart].keyPressed, end: props.pulseNum}
  //             }}
  //           }
  //         }
  //       }
  //     });
      
  //     props.setMidiNoteInfo(mniTemp);
  //   }
  // }, [props.midiState.mode]);

  // Add new notes to midiRecorded so that they can be added to playback.
  useEffect(() => {
    if(props.midiNoteInfo.length > 0) {
      let midiRecTemp: Map<string, KeyPressed>[] = [];

      props.midiNoteInfo.forEach((noteInfo) => {
        if(noteInfo) {
          let noteStart = Object.keys(props.midiNoteInfo[props.midiNoteInfo.indexOf(noteInfo)])[0]

          if(noteInfo[noteStart].keyPressed) {
            let noteOct = noteStart.replace(noteInfo[noteStart].keyPressed!.start.toString(), '');
            let qwertyKeys = Object.keys(qwertyNote);

            for(var i = 0; i < qwertyKeys.length; i++) {
              if(qwertyNote[qwertyKeys[i]].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwertyKeys[i]].octave === 0) {
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
                let keyPressedStart = (midiRecTemp[noteInfo[noteStart].keyPressed!.start]) ? midiRecTemp[noteInfo[noteStart].keyPressed!.start] : new Map()
                let keyPressedEnd = (midiRecTemp[noteInfo[noteStart].keyPressed!.end]) ? midiRecTemp[noteInfo[noteStart].keyPressed!.end] : new Map()

                keyPressedStart.set(noteOct, startNote);
                keyPressedEnd.set(noteOct, endNote);
                midiRecTemp[noteInfo[noteStart].keyPressed!.start] = keyPressedStart;
                midiRecTemp[noteInfo[noteStart].keyPressed!.end] =  keyPressedEnd;
                break;
              }
            }
          }
        }
      });

      setMidiRecorded(midiRecTemp)
    } else {
      setMidiRecorded([])
    }
  }, [props.midiNoteInfo])

  // Add notes from clicking grid to midiNoteInfo.
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
          let ret = '';
          Object.keys(qwertyNote).forEach((key) => {
            if(qwertyNote[key].note === noteOct.replace(/[0-9]/g, '')) {ret = key;}
          })
          return ret;
        })();
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
        setNotesAdded((notesAdded) => [...notesAdded, {[noteTrackId]: {pulse: start}}])
        props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => [...midiNoteInfo, ...[{[start + noteOct]: {
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
        // setOrderOfEvents((orderOfEvents) => [props.midiNoteInfo, ...orderOfEvents]);
      }
    }
  }, [clickCoords])

  // Undo add or remove note from midiNoteInfo.
  useEffect(() => {
    if(props.controlsState.undo && orderOfEvents.length > 1) {
      props.setMidiNoteInfo(orderOfEvents[1]);
      setOrderOfEvents((orderOfEvents: MidiNoteInfo[][]) => orderOfEvents.slice(2));
    }
  }, [props.controlsState.undo])

  useEffect(() => {
    if(!props.controlsState.undo && !isDragging) {
      setOrderOfEvents((orderOfEvents) => [props.midiNoteInfo, ...orderOfEvents]);
    } else {
      props.controlsDispatch({type: 'undo', undo: false});
    }
  }, [props.midiNoteInfo, props.controlsState.undo, isDragging])

  // Adds notes from recording to midiNoteInfo, checks for any overlapping notes, and resolves if any are overlapping.
  useEffect(() => {
    // This Function checks if a note has already been recorded, and adjusts its length if so.
    const findSameNote = (noteOct: string, start: number) => {
      props.midiNoteInfo.forEach((midiNote, i) => {
        var noteStart2 = Object.keys(midiNote)[0];
        var noteOct2 = midiNote[noteStart2].noteTrackId.substring(0, midiNote[noteStart2].noteTrackId.indexOf('-'))

        if(noteOct === noteOct2) {
          var start2 = parseInt(noteStart2.substring(0, noteStart2.indexOf(noteOct2)));
          var end2 = midiNote[noteStart2].keyPressed.end;

          if(start < end2 && start > start2) {
            props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
              let state = [...midiNoteInfo];
              
              state[i][noteStart2].keyPressed = {...state[i][noteStart2].keyPressed, end: start - 1}
              return state
            })
          }
        }
      })
    }

    if(props.noteTracksRef && props.midiState.mode === 'recording') {
      let octave: number;
      let countTemp = count;
      // if(props.noteTracksRef.current) {
        props.keysPressed.forEach((keyPressed, noteOct) => {
          octave = parseInt(noteOct.replace(/\D/g,''));
          let noteStart = keyPressed.start + noteOct;
          if(!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
            let noteTrackId = `${noteOct}-track`;
            findSameNote(noteOct, keyPressed.start);

            props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => [...midiNoteInfo, {[noteStart]: {
              key: `${noteTrackId}-${countTemp}`,
              props: {
                id: keyPressed.start + noteTrackId + '-' + countTemp,
                className: 'midi-note',
              },
              keyPressed: keyPressed,
              noteTrackId: noteTrackId,
            }}])
            // setOrderOfEvents((orderOfEvents) => [props.midiNoteInfo, ...orderOfEvents]);
            countTemp++;
            setCount(countTemp);
          }
        })

        /* Looks at all notes that are currently being recorded and checks if their 
           start time is in between another same notes start and end time. */
        props.keysUnpressed.forEach((keyUnpressed, noteOct) => {
          octave = parseInt(noteOct.replace(/\D/g,''));
          let noteStart = keyUnpressed.start + noteOct;

          for(let i = props.midiNoteInfo.length - 1; i > -1; i--) {
            if(Object.keys(props.midiNoteInfo[i])[0] === noteStart && props.midiNoteInfo[i][Object.keys(props.midiNoteInfo[i])[0]].keyPressed.end === -1) {
              let newMidiNote = {[noteStart]: {...props.midiNoteInfo[i][noteStart], keyPressed: keyUnpressed}};
              setMidiRecording((midiRecording) => [...midiRecording, newMidiNote]);
              props.setMidiNoteInfo((midiNoteInfo: MidiNoteInfo[]) => {
                let state = [...midiNoteInfo];
                let newMidiNote = {[noteStart]: {...state[i][noteStart], keyPressed: keyUnpressed}}

                state.splice(i, 1, newMidiNote);
                return state;
              })
              break;
            }
          }
        })
        props.setKeysUnpressed(new Map())
      // }
    }
  }, [props.pulseNum, props.midiState.mode, props.keysPressed]);

  // Correct notes that go beyond midiLength by setting their end time to midiLength.
  useEffect(() => {
    if(props.midiNoteInfo.length > 0 && props.midiState.mode === 'stop') {
      let state = [...props.midiNoteInfo]

      for(let i = props.midiNoteInfo.length - 1; i > -1; i--) {
        if(props.midiNoteInfo[i]){
          let noteOct = Object.keys(state[i])[0]

          if(state[i][noteOct].keyPressed.end <= 0) {
            state[i][noteOct] = {...state[i][noteOct], keyPressed: {...state[i][noteOct].keyPressed, end: props.midiLength * props.pulseRate}}
          } else {
            break;
          }
        }
      }
      props.setMidiNoteInfo(state);
    }
  }, [props.midiNoteInfo, props.midiState.mode]);

  // Add notes from current recording to props.midiNoteInfo.
  useEffect(() => {
    if(props.midiState.mode === 'keyboard' && midiRecording.length > 0) {
      let mniTemp = [...props.midiNoteInfo]

      midiRecording.forEach((midiNote, i) => {
        var noteStart = Object.keys(midiNote)[0];
        var start = midiNote[noteStart].keyPressed.start;
        var end = midiNote[noteStart].keyPressed.end;
        var noteOct = noteStart.replace(`${start}`, '')

        for(var j = 0; j < props.midiNoteInfo.length; j++) {
          var midiNote2 = props.midiNoteInfo[j];
          var noteStart2 = Object.keys(midiNote2)[0]
          var start2 = midiNote2[noteStart2].keyPressed.start;
          var noteOct2 = noteStart2.replace(`${start2}`, '')

          if(start > start2) break;
          if(noteOct === noteOct2 && start < start2 && end > start2) {
            Object.entries(mniTemp).some((entry) => {
              if(entry[1][noteStart2]) {
                mniTemp.splice(parseInt(entry[0]), 1);
              }
            })
            break;
          }
        }
      })
      props.setMidiNoteInfo(mniTemp)
      setMidiRecording([]);
    }
  }, [midiRecording, props.midiState.mode])

  // Set playback to current recording which includes what 
  useEffect(() => {
    if(props.midiState.mode === 'keyboard' ) {
      props.setPlayback(midiRecorded);
    }
  }, [props.midiState.mode, midiRecorded]);
  
  return (
      <MidiNotes gridSize={props.gridSize} midiNoteInfo={props.midiNoteInfo} controlsState={props.controlsState} midiLength={props.midiLength} midiState={props.midiState} pulseNum={props.pulseNum} pulseRate={props.pulseRate} noteTracksRef={props.noteTracksRef} subdiv={props.midiState.subdiv} controlsDispatch={props.controlsDispatch} setOrigVal={setOrigVal} setStartVal={setStartVal} />
  )
}

export default MidiRecorder;