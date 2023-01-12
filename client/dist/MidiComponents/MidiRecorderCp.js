"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import MidiNotes from './MidiNotes';
const MidiNotes_1 = require("./MidiNotes");
require("./MidiRecorder.css");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
function MidiRecorder(props) {
    const [count, setCount] = (0, react_1.useState)(0);
    const [clickCoords, setClickCoords] = (0, react_1.useState)([]);
    const [midiRecorded, setMidiRecorded] = (0, react_1.useState)({});
    const [midiRecording, setMidiRecording] = (0, react_1.useState)({});
    const [midiNoteInfo, setMidiNoteInfo] = (0, react_1.useState)([]);
    const [notesRemoved, setNotesRemoved] = (0, react_1.useState)([]);
    const [orderOfEvents, setOrderOfEvents] = (0, react_1.useState)([]);
    const [pausePulse, setPausePulse] = (0, react_1.useState)(-1);
    const [playbackOff, setPlaybackOff] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        // console.log('midiNoteInfo', midiNoteInfo)
        // console.log('notesRemoved', midiRecorded)
    }, [midiNoteInfo]);
    // Add or remove note upon clicking a note track or a note
    (0, react_1.useEffect)(() => {
        function addRemNote(e) {
            var elem;
            if (e.target) {
                elem = e.target;
                console.log(props.midiState.mode);
                if (elem.tagName == "DIV") {
                    setClickCoords([e.clientX, e.clientY]);
                    // setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
                }
                else if (elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
                    console.log('double');
                    let key = elem.id.substring(0, elem.id.indexOf('-'));
                    let remIndex = 0;
                    for (var i = 0; i < midiNoteInfo.length; i++) {
                        if (Object.keys(midiNoteInfo[i])[0] === key)
                            remIndex = i;
                    }
                    console.log(remIndex, key, midiNoteInfo[remIndex]);
                    // let remProp = 
                    setNotesRemoved((notesRemoved) => [...notesRemoved, { [remIndex]: { [key]: midiNoteInfo[remIndex][key] } }]);
                    setMidiNoteInfo((midiNoteInfo) => {
                        let state = [...midiNoteInfo];
                        state.splice(remIndex, 1);
                        return state;
                    });
                    // setMidiNotes([])
                    if (props.controlsState.undo) {
                        props.controlsDispatch({ type: 'undo', undo: false });
                    }
                    else {
                        setOrderOfEvents((orderOfEvents) => [1, ...orderOfEvents]);
                    }
                }
            }
        }
        if (props.noteTracksRef.current) {
            props.noteTracksRef.current.addEventListener('dblclick', addRemNote);
        }
        return () => {
            if (props.noteTracksRef.current)
                props.noteTracksRef.current.removeEventListener('dblclick', addRemNote);
        };
    }, [props.noteTracksRef.current, midiNoteInfo, props.midiState.mode]);
    (0, react_1.useEffect)(() => {
        if (midiNoteInfo.length > 0 && props.midiState.mode === 'keyboard') {
            let mniTemp = [...midiNoteInfo];
            midiNoteInfo.forEach((noteInfo, i, midiNoteInfo) => {
                let noteStart = Object.keys(noteInfo)[0];
                if (noteInfo[noteStart].keyPressed) {
                    if (noteInfo[noteStart].keyPressed.end === -1) {
                        mniTemp[i] = { [noteStart]: { ...midiNoteInfo[i][noteStart],
                                keyPressed: { ...midiNoteInfo[i][noteStart].keyPressed, end: props.pulseNum }
                            } };
                    }
                }
            });
            setPausePulse(props.pulseNum);
            // console.log(mniTemp)
            setMidiNoteInfo(mniTemp);
        }
    }, [props.midiState.mode]);
    // Add notes from midiNoteInfo to midiRecorded.
    (0, react_1.useEffect)(() => {
        if (midiNoteInfo.length > 0) {
            // console.log(midiNoteInfo);
            let midiRecTemp = {};
            midiNoteInfo.forEach((noteInfo) => {
                let noteStart = Object.keys(noteInfo)[0];
                if (noteInfo[noteStart].keyPressed) {
                    let noteOct = noteStart.replace(noteInfo[noteStart].keyPressed.start.toString(), '');
                    // console.log(qwertyNote[noteInfo[noteStart].keyPressed!.key!])
                    let qwertyKeys = Object.keys(qwertyNote);
                    for (var i = 0; i < qwertyKeys.length; i++) {
                        if (qwertyNote[qwertyKeys[i]].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwertyKeys[i]].octave === 0) {
                            // console.log(noteOct)
                            let startNote = {
                                key: qwertyKeys[i],
                                octave: parseInt(noteOct.replace(/\D/g, '')),
                                pressed: true,
                                start: noteInfo[noteStart].keyPressed.start,
                                end: -1,
                            };
                            let endNote = {
                                key: qwertyKeys[i],
                                octave: parseInt(noteOct.replace(/\D/g, '')),
                                pressed: false,
                                start: noteInfo[noteStart].keyPressed.start,
                                end: noteInfo[noteStart].keyPressed.end,
                            };
                            // console.log(noteInfo[noteStart].keyPressed!.start)
                            midiRecTemp = {
                                ...midiRecTemp, [noteInfo[noteStart].keyPressed.start]: {
                                    ...midiRecTemp[noteInfo[noteStart].keyPressed.start],
                                    ...{ [noteOct]: startNote }
                                },
                                [noteInfo[noteStart].keyPressed.end]: {
                                    ...midiRecTemp[noteInfo[noteStart].keyPressed.end],
                                    ...{ [noteOct]: endNote }
                                }
                            };
                            break;
                        }
                    }
                }
            });
            setMidiRecorded(midiRecTemp);
        }
    }, [midiNoteInfo]);
    // Add notes from clicking to midiNoteInfo.
    (0, react_1.useEffect)(() => {
        if (props.noteTracksRef.current) {
            let noteTrackElem;
            let noteTrackId = '';
            let subdivElem;
            let subdivId = '';
            let countTemp = count;
            if (document.elementsFromPoint(clickCoords[0], clickCoords[1]).length > 0) {
                document.elementsFromPoint(clickCoords[0], clickCoords[1]).forEach((elem) => {
                    if (elem.getAttribute('class') === 'note-track') {
                        noteTrackElem = elem;
                        noteTrackId = elem.id;
                    }
                    if (elem.getAttribute('class') === 'subdivision') {
                        subdivElem = elem;
                        subdivId = elem.id;
                    }
                });
            }
            if (noteTrackId.length > 0 && subdivId.length > 0) {
                let noteOct = noteTrackId.replace('-track', '');
                let key = (() => {
                    Object.keys(qwertyNote).forEach((qwerty) => {
                        // console.log(qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
                        if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, ''))
                            return qwerty;
                    });
                    return '';
                })();
                // console.error(key)
                let subdiv = parseInt(subdivId.replace(/\D/g, ''));
                let rect = subdivElem.getBoundingClientRect();
                let left = rect.left;
                let width = rect.right - rect.left;
                let height = props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 2;
                if ((subdiv - 1) % props.midiState.subdiv === 0) {
                    width -= 2;
                }
                let start = Math.trunc((subdiv - 1) / (props.midiState.numMeasures * props.midiState.subdiv) * props.midiLength * props.pulseRate);
                let end = Math.trunc(start + 1 / (props.midiState.subdiv * props.midiState.numMeasures) * props.midiLength * props.pulseRate) - 1;
                setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, ...[{ [start + noteOct]: {
                                key: noteTrackId + countTemp,
                                keyPressed: {
                                    key: key,
                                    // octave: parseInt(noteOct.replace(/\D/g, '')),
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
                            } }]]);
                countTemp++;
                setCount(countTemp);
                setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
            }
        }
    }, [clickCoords]);
    // Undo add or remove note from midiNoteInfo.
    (0, react_1.useEffect)(() => {
        // console.error(props.controlsState.undo)
        if (props.controlsState.undo && orderOfEvents.length > 0 && notesRemoved.length > 0) {
            if (orderOfEvents[0] === 1) {
                let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
                let key = Object.keys(notesRemoved[0][remIndex])[0];
                let start = notesRemoved[0][remIndex][key].keyPressed.start;
                let end = notesRemoved[0][remIndex][key].keyPressed.end - 1;
                let noteOct = key.replace(start.toString(), '');
                props.controlsDispatch({ type: 'undo', undo: false });
                setMidiNoteInfo((midiNoteInfo) => {
                    let state = [...midiNoteInfo]; // , {...notesRemoved[0]}]));
                    state.splice(remIndex, 0, notesRemoved[0][remIndex]);
                    return state;
                });
                Object.keys(qwertyNote).forEach((qwerty) => {
                    if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                        let startNote = {
                            key: qwerty,
                            octave: parseInt(noteOct.replace(/\D/g, '')),
                            pressed: true,
                            start: start,
                            end: -1,
                        };
                        let endNote = {
                            key: qwerty,
                            octave: parseInt(noteOct.replace(/\D/g, '')),
                            pressed: false,
                            start: start,
                            end: end,
                        };
                        setNotesRemoved((notesRemoved) => {
                            let state = [...notesRemoved];
                            state.shift();
                            return state;
                        });
                        // setMidiRecorded((midiRecorded) => (
                        //   {
                        //     ...midiRecorded, [start!]: {
                        //       ...midiRecorded[start!], 
                        //       ...{[noteOct]: startNote}
                        //     }, 
                        //     [end!]: {
                        //       ...midiRecorded[end!], 
                        //       ...{[noteOct]: endNote}
                        //     }
                        //   }
                        // ));
                    }
                });
                setOrderOfEvents((orderOfEvents) => {
                    let state = [...orderOfEvents];
                    state.shift();
                    // console.log('1',state)
                    return state;
                });
            }
            else {
                // console.warn(Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0])
                let key = Object.keys(midiNoteInfo[midiNoteInfo.length - 1])[0];
                let elem = document.getElementById(midiNoteInfo[midiNoteInfo.length - 1][key].props.id);
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
                });
            }
        }
        else {
            props.controlsDispatch({ type: 'undo', undo: false });
        }
    }, [props.controlsState.undo]);
    // Remove deleted notes from midiRecorded
    (0, react_1.useEffect)(() => {
        if (Object.keys(notesRemoved).length > 0) {
            let remIndex = parseInt(Object.keys(notesRemoved[0])[0]);
            let key = Object.keys(notesRemoved[0][remIndex])[0];
            let start = notesRemoved[0][remIndex][key].keyPressed.start;
            let end = notesRemoved[0][remIndex][key].keyPressed.end;
            let noteOct = key.replace(start.toString(), '');
            // console.log(key[0])
            // console.log(notesRemoved[0][key].keyPressed!.start)
            // console.log(Object.entries(qwertyNote))
            Object.keys(qwertyNote).forEach((qwerty) => {
                // console.log(qwertyNote[qwerty].note , noteOct.replace(/[0-9]/g, ''))
                if (start && qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                    // console.log('midiRecorded', midiRecorded)
                    // props.onNoteRemoved(start, end) 
                    //   setMidiRecorded((midiRecorded) => {
                    //     let state = {...midiRecorded};
                    //     let temp = {};
                    //     // console.log(midiRecorded);
                    //     // console.log(state, start, end,noteOct);
                    //     let {[noteOct]: _, ...obj} = state[start]
                    //     state[start] = obj;
                    //     let {[noteOct]: __, ...obj2} = midiRecorded[end]
                    //     state[end] = obj;
                    //     return state;
                    // });
                }
            });
        }
    }, [notesRemoved]);
    (0, react_1.useEffect)(() => {
        // console.groupCollapsed('midirecording')
        // console.log(props.pulseNum)
        // console.log('midiRecording', midiRecording)
        // console.log('midiRecorded', midiRecorded)
        // console.log('midiNoteInfo', midiNoteInfo)
        // console.log('props.keysPressed', props.keysPressed)
        // console.groupEnd()
    }, [midiRecording]);
    // Add notes from recording to midiNoteInfo
    (0, react_1.useEffect)(() => {
        if (props.noteTracksRef && props.midiState.mode === 'recording') {
            let octave;
            let countTemp = count;
            if (props.noteTracksRef.current) {
                Object.keys(props.keysPressed).forEach((noteOct) => {
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    let noteStart = props.keysPressed[noteOct].start + noteOct;
                    if (props.keysPressed[noteOct].pressed && !midiNoteInfo.find((exists) => Object.keys(exists)[0] == noteStart)) {
                        let noteTrackId = `${noteOct}-track`;
                        console.log(props.keysPressed[noteOct]);
                        let end = (props.keysPressed[noteOct].start - props.keysPressed[noteOct].end !== props.keysPressed[noteOct].start) ? props.keysPressed[noteOct].end : props.midiLength * props.pulseRate;
                        console.log(props.keysPressed[noteOct], end);
                        setMidiNoteInfo((midiNoteInfo) => [...midiNoteInfo, { [noteStart]: {
                                    key: `${noteTrackId}-${countTemp}`,
                                    props: {
                                        id: props.keysPressed[noteOct].start + noteTrackId + '-' + countTemp,
                                        className: 'midi-note',
                                    },
                                    keyPressed: props.keysPressed[noteOct],
                                    noteTrackId: noteTrackId,
                                    noteTracksRef: props.noteTracksRef,
                                } }]);
                        setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
                        countTemp++;
                        setCount(countTemp);
                    }
                    else if (!props.keysPressed[noteOct].pressed) {
                        for (let i = midiNoteInfo.length - 1; i > -1; i--) {
                            if (Object.keys(midiNoteInfo[i])[0] === noteStart) {
                                setMidiNoteInfo((midiNoteInfo) => {
                                    let state = [...midiNoteInfo];
                                    let newNoteInfo = { [noteStart]: { ...state[i][noteStart], keyPressed: props.keysPressed[noteOct] } };
                                    state.splice(i, 1, newNoteInfo);
                                    return state;
                                });
                                break;
                            }
                        }
                    }
                });
            }
        }
    }, [props.pulseNum, props.noteTracksRef, props.midiState.mode, props.keysPressed]);
    // Correct notes that go beyond midiLength
    (0, react_1.useEffect)(() => {
        if (midiNoteInfo.length > 0 && props.midiState.mode === 'stop') {
            let state = [...midiNoteInfo];
            for (let i = midiNoteInfo.length - 1; i > -1; i--) {
                let noteOct = Object.keys(state[i])[0];
                console.log("bot", state[i][noteOct].keyPressed.end);
                if (state[i][noteOct].keyPressed.end <= 0) {
                    console.log('bit');
                    state[i][noteOct] = { ...state[i][noteOct], keyPressed: { ...state[i][noteOct].keyPressed, end: props.midiLength * props.pulseRate } };
                }
                else {
                    console.log('but');
                    break;
                }
            }
            setMidiNoteInfo(state);
        }
    }, [midiNoteInfo, props.midiState.mode]);
    // Add notes from current recording 
    (0, react_1.useEffect)(() => {
        if (props.midiState.mode === 'keyboard' && Object.keys(midiRecording).length > 0) {
            // setMidiRecorded((midiRecorded) => {
            //   let state: MidiRecorded = {...midiRecorded};
            //   let keys = Object.keys(midiRecording);
            //   // for(var i = 0; i < Object.keys(midiRecording).length; i++) {
            //     Object.keys(midiRecording).forEach((key) => {
            //     Object.entries(midiRecording[key]).forEach((entry) => {
            //       let newNote = {
            //         key: entry[1].key,
            //         pressed: entry[1].pressed,
            //         start: entry[1].start,
            //         end: entry[1].end,
            //       }
            //       state = {...state, 
            //         [key]: {...state[key], [entry[0]]: newNote},
            //       }
            //     })
            //   })
            //   return state;
            // })
            setMidiRecording({});
        }
    }, [midiRecording, props.midiState.mode]);
    // useEffect(() => {
    //   let notesRem: string[] = [];
    //   if(Object.keys(midiRecorded).length > 0) {
    //     Object.keys(midiRecorded).forEach((pulseNum) => {
    //       notesRem = notesRem.concat(Object.keys(midiRecorded[pulseNum]))
    //     })
    //   setNotesRecorded(new Set(notesRem))
    //   }
    // }, [midiRecorded])
    // Recording and playback handler
    // useEffect(() => {
    //   const recording = () => {
    //     // if(props.pulseNum === 0) {
    //     //   setMidiRecording((midiRecording) => ({...midiRecording, [props.pulseNum]: {}}))
    //     // } else {
    //       // console.error(midiRecorded)
    //       setMidiRecording((midiRecording) => {
    //         let state = {...midiRecording};
    //         Object.keys(props.keysPressed).forEach((key) => {
    //           if(!notesRecorded.has(key)) {
    //             // console.warn(props.pulseNum, key, {
    //             //   ...state, [props.pulseNum]: {...state[props.pulseNum],
    //             //     [key]: {
    //             //       key: props.keysPressed[key].key,
    //             //       pressed: props.keysPressed[key].pressed,
    //             //       start: props.keysPressed[key].start,
    //             //       end: (props.pulseNum !== props.keysPressed[key].end!) ? -1 : props.keysPressed[key].end!
    //             //     }
    //             //   },
    //             // })
    //             state = {
    //               ...state, [props.pulseNum]: {...state[props.pulseNum],
    //                 [key]: {
    //                   key: props.keysPressed[key].key,
    //                   pressed: props.keysPressed[key].pressed,
    //                   start: props.keysPressed[key].start,
    //                   end: (props.pulseNum !== props.keysPressed[key].end!) ? -1 : props.keysPressed[key].end!
    //                 }
    //               },
    //             }
    //           }
    //         })
    //         // console.log('recording()', state, props.pulseNum, props.keysPressed, midiNoteInfo)
    //         return state;
    //       })
    //     }
    //   // }
    //   if(props.midiState.mode === 'recording' && Object.keys(props.keysPressed).length > 1) {
    //     recording();
    //   }
    // }, [props.keysPressed, props.midiState.mode]);
    // useEffect(() => {
    //   if(props.midiState.mode === 'playing' || props.midiState.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
    //     // console.log(props.pulseNum);
    //     if(Object.keys(midiRecorded).includes(props.pulseNum + ''))
    //     {
    //       setPlaybackOff((playbackOff) => {
    //         let state = {...playbackOff};
    //         // console.log(midiRecorded[props.pulseNum])
    //         Object.keys(midiRecorded[props.pulseNum]).forEach((noteOct) => {
    //           state = {...state, [noteOct]: {...midiRecorded[props.pulseNum][noteOct], end: midiRecorded[props.pulseNum][noteOct].start}}
    //         });
    //         // console.log(state)
    //         return state;
    //       })
    //       console.log(midiRecorded[props.pulseNum])
    //       props.setPlayback(midiRecorded[props.pulseNum]);
    //     }
    //   }
    //   if(props.midiState.mode === 'stop') {
    //     // let pulses = Object.keys(midiRecorded)
    //     // console.log(pausePulse, props.pulseNum)
    //     // for(var i = 0; i < pulses.length; i++) {
    //     //   if(parseInt(pulses[i]) > pausePulse) {
    //     //   }
    //     //   props.setPlayback(playbackOff)
    //     // }
    //     // console.log(playbackOff)
    //     // props.setPlayback(playbackOff);
    //   }
    // }, [props.pulseNum, props.midiState.mode]);
    (0, react_1.useEffect)(() => {
        props.setPlayback(midiRecorded);
    }, [midiRecorded]);
    return ((0, jsx_runtime_1.jsx)(MidiNotes_1.default, { midiRecorded: midiRecorded, midiNoteInfo: midiNoteInfo, notesRemoved: notesRemoved, orderOfEvents: orderOfEvents, controlsState: props.controlsState, midiLength: props.midiLength, midiState: props.midiState, pulseNum: props.pulseNum, pulseRate: props.pulseRate, noteTracksRef: props.noteTracksRef, subdiv: props.midiState.subdiv, controlsDispatch: props.controlsDispatch }));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
