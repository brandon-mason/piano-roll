"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import MidiNotes from './MidiNotes';
const MidiNotes_1 = require("./MidiNotes");
require("./MidiRecorder.css");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
// replace midistate prop with mode prop
function MidiRecorder(props) {
    const [count, setCount] = (0, react_1.useState)(0);
    const [clickCoords, setClickCoords] = (0, react_1.useState)([]);
    const [midiRecorded, setMidiRecorded] = (0, react_1.useState)({});
    const [midiRecording, setMidiRecording] = (0, react_1.useState)({});
    const [midiNoteInfo, setMidiNoteInfo] = (0, react_1.useState)([]);
    const [notesRemoved, setNotesRemoved] = (0, react_1.useState)([]);
    const [orderOfEvents, setOrderOfEvents] = (0, react_1.useState)([]);
    const [notesRecorded, setNotesRecorded] = (0, react_1.useState)(new Set());
    (0, react_1.useEffect)(() => {
        // console.log(props.midiState.mode)
    }, [props.midiState.mode]);
    // Add or remove note upon clicking a note track or a note
    (0, react_1.useEffect)(() => {
        function addRemNote(e) {
            var elem;
            if (e.target) {
                elem = e.target;
                // console.log(props.midiState.mode)
                if (elem.tagName == "DIV") {
                    setClickCoords([e.clientX, e.clientY]);
                    // setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
                }
                else if (elem.tagName == "SPAN" && props.midiState.mode === 'keyboard') {
                    let key = elem.id.substring(0, elem.id.indexOf('-'));
                    let remIndex = 0;
                    for (var i = 0; i < midiNoteInfo.length; i++) {
                        if (Object.keys(midiNoteInfo[i])[0] === key)
                            remIndex = i;
                    }
                    // console.log(remIndex, key, midiNoteInfo[remIndex][key])
                    // let remProp = 
                    setNotesRemoved((notesRemoved) => [{ [remIndex]: { [key]: midiNoteInfo[remIndex][key] } }, ...notesRemoved]);
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
    (0, react_1.useLayoutEffect)(() => {
    }, [props.midiState.mode]);
    // Add notes from clicking
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
                            } }]]);
                Object.keys(qwertyNote).forEach((qwerty) => {
                    if (qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                        setMidiRecorded((midiRecorded) => ({
                            ...midiRecorded, [start]: {
                                ...midiRecorded[start],
                                ...{ [noteOct]: {
                                        key: qwerty,
                                        octave: parseInt(noteOct.replace(/\D/g, '')),
                                        pressed: true,
                                        start: start,
                                        end: -1,
                                    } }
                            },
                            [end]: {
                                ...midiRecorded[end],
                                ...{ [noteOct]: {
                                        key: qwerty,
                                        octave: parseInt(noteOct.replace(/\D/g, '')),
                                        pressed: false,
                                        start: start,
                                        end: end,
                                    } }
                            }
                        }));
                    }
                });
                countTemp++;
                setCount(countTemp);
                setOrderOfEvents((orderOfEvents) => [0, ...orderOfEvents]);
            }
        }
    }, [clickCoords]);
    // Add notes from recording
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
    }, [props.noteTracksRef, props.midiState.mode, props.keysPressed]);
    // Undo add or remove note from midiRecorded
    (0, react_1.useEffect)(() => {
        // console.error(props.controlsState.undo)
        if (props.controlsState.undo && orderOfEvents.length > 0) {
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
                        setNotesRemoved((notesRemoved) => {
                            let state = [...notesRemoved];
                            state.shift();
                            return state;
                        });
                        // console.log(note);
                        // let key = Object.keys(note)
                        // let qwerty
                        setMidiRecorded((midiRecorded) => ({
                            ...midiRecorded, [start]: {
                                ...midiRecorded[start],
                                ...{ [noteOct]: {
                                        key: qwerty,
                                        octave: parseInt(noteOct.replace(/\D/g, '')),
                                        pressed: true,
                                        start: start,
                                        end: -1,
                                    } }
                            },
                            [end]: {
                                ...midiRecorded[end],
                                ...{ [noteOct]: {
                                        key: qwerty,
                                        octave: parseInt(noteOct.replace(/\D/g, '')),
                                        pressed: false,
                                        start: start,
                                        end: end,
                                    } }
                            }
                        }));
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
            let end = notesRemoved[0][remIndex][key].keyPressed.end - 1;
            let noteOct = key.replace(start.toString(), '');
            // console.log(key[0])
            // console.log(notesRemoved[0][key].keyPressed!.start)
            Object.keys(qwertyNote).forEach((qwerty) => {
                if (start && qwertyNote[qwerty].note === noteOct.replace(/[0-9]/g, '') && qwertyNote[qwerty].octave === 0) {
                    // console.log(start, end)
                    // props.onNoteRemoved(start, end) 
                    setMidiRecorded((midiRecorded) => {
                        const state = { ...midiRecorded };
                        delete state[start];
                        delete state[end];
                        return state;
                    });
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
    // Add notes from current recording 
    (0, react_1.useEffect)(() => {
        if (props.midiState.mode === 'keyboard' && Object.keys(midiRecording).length > 0) {
            setMidiRecorded((midiRecorded) => {
                let state = { ...midiRecorded };
                let keys = Object.keys(midiRecording);
                // console.log(midiRecording)
                for (var i = 0; i < Object.keys(midiRecording).length; i++) {
                    // console.error(Object.entries(midiRecording[keys[i]]))
                    let entries = Object.entries(midiRecording[keys[i]]);
                    // console.log(entries, keys)
                    entries.forEach((entry) => {
                        // console.log(entry);
                        state = {
                            ...state, [keys[i]]: { ...state[keys[i]],
                                [entry[0]]: {
                                    key: entry[1].key,
                                    pressed: entry[1].pressed,
                                    start: entry[1].start,
                                    end: entry[1].end,
                                }
                            },
                        };
                        // console.groupCollapsed('setmidirecorded')
                        // console.log(entry[0], parseInt(keys[i]) , entry)
                        // console.log({
                        //   [entry[0]]: {
                        //     key: entry[1].key,
                        //     pressed: entry[1].pressed,
                        //     start: entry[1].start,
                        //     end: entry[1].end,
                        //   }
                        // })
                        // console.groupEnd()
                    });
                }
                // console.log('state', state)
                return state;
            });
            setMidiRecording({});
        }
    }, [midiRecording, props.midiState.mode]);
    const [addedToRecording, setAddedToRecording] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        let notesRem = [];
        if (Object.keys(midiRecorded).length > 0) {
            Object.keys(midiRecorded).forEach((pulseNum) => {
                // console.log(Object.keys(midiRecorded[pulseNum]))
                notesRem = notesRem.concat(Object.keys(midiRecorded[pulseNum]));
            });
            // console.log(notesRem, new Set(notesRem), midiRecorded)
            setNotesRecorded(new Set(notesRem));
        }
    }, [midiRecorded]);
    // Recording and playback handler
    (0, react_1.useEffect)(() => {
        const recording = () => {
            if (props.pulseNum === 0) {
                setMidiRecording((midiRecording) => ({ ...midiRecording, [props.pulseNum]: {} }));
            }
            else {
                console.error(midiRecorded);
                setMidiRecording((midiRecording) => {
                    let state = { ...midiRecording };
                    Object.keys(props.keysPressed).forEach((key) => {
                        // state[props.pulseNum] = {...state[props.pulseNum], [key]: props.keysPressed[key]}
                        if (!notesRecorded.has(key)) {
                            console.warn(props.pulseNum, key, {
                                ...state, [props.pulseNum]: { ...state[props.pulseNum],
                                    [key]: {
                                        key: props.keysPressed[key].key,
                                        pressed: props.keysPressed[key].pressed,
                                        start: props.keysPressed[key].start,
                                        end: (props.pulseNum !== props.keysPressed[key].end) ? -1 : props.keysPressed[key].end
                                    }
                                },
                            });
                            state = {
                                ...state, [props.pulseNum]: { ...state[props.pulseNum],
                                    [key]: {
                                        key: props.keysPressed[key].key,
                                        pressed: props.keysPressed[key].pressed,
                                        start: props.keysPressed[key].start,
                                        end: (props.pulseNum !== props.keysPressed[key].end) ? -1 : props.keysPressed[key].end
                                    }
                                },
                            };
                        }
                    });
                    console.log('recording()', state, props.pulseNum, props.keysPressed, midiNoteInfo);
                    return state;
                });
            }
        };
        // useEffect(() => {
        //   const recording = () => {
        //     let notes: string[] = [];
        //     if(props.pulseNum === 0) {
        //       setMidiRecording((midiRecording) => ({...midiRecording, [props.pulseNum]: {}}))
        //     } else {
        //       // setMidiRecording((midiRecording) => ({...midiRecording, [props.pulseNum]: props.keysPressed}));
        //       setMidiRecording((midiRecording) => {
        //         let state = {...midiRecording};
        //         Object.keys(props.keysPressed).forEach((key) => {
        //           // console.log(addedToRecording.includes(props.keysPressed[key].start + key) && props.keysPressed[key].end !== -1, addedToRecording, key)
        //           console.log(notes)
        //           if(!notes.includes(props.keysPressed[key].start + key)) {
        //             state[props.pulseNum] = {...state[props.pulseNum], [key]: props.keysPressed[key]}
        //             notes.splice(notes.indexOf(props.keysPressed[key].start + key), 1)
        //           } else if(notes.includes(props.keysPressed[key].start + key) && props.keysPressed[key].end !== -1) {
        //             state[props.pulseNum] = {...state[props.pulseNum], [key]: props.keysPressed[key]}
        //           }
        //         })
        //         console.log('recording()', state, props.pulseNum, props.keysPressed, midiNoteInfo)
        //         return state;
        //       })
        //     }
        //     console.log(notes)
        //     // return notes;
        //     // console.log({...midiRecording, [props.pulseNum]: props.keysPressed})
        //   }
        // if(props.pulseNum >= props.midiLength * props.pulseRate) props.midiDispatch({type: 'mode', mode: 'keyboard'})
        if (props.midiState.mode === 'recording' && Object.keys(props.keysPressed).length > 1) {
            recording();
            // setAddedToRecording(notes)
        }
        // console.log(props.keysPressed)
    }, [props.keysPressed, props.midiState.mode]);
    (0, react_1.useEffect)(() => console.log('addedtorecording', addedToRecording), [addedToRecording]);
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
    (0, react_1.useEffect)(() => {
        if (props.midiState.mode === 'playing' || props.midiState.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
            if (Object.keys(midiRecorded).includes(props.pulseNum + '')) {
                console.log('setPlayback', props.pulseNum, midiRecorded);
                props.setPlayback(midiRecorded[props.pulseNum]);
            }
            // playing();
        }
    }, [props.pulseNum, props.midiState.mode]);
    return ((0, jsx_runtime_1.jsx)(MidiNotes_1.default, { midiRecorded: midiRecorded, midiNoteInfo: midiNoteInfo, notesRemoved: notesRemoved, orderOfEvents: orderOfEvents, controlsState: props.controlsState, midiLength: props.midiLength, midiState: props.midiState, pulseNum: props.pulseNum, pulseRate: props.pulseRate, noteTracksRef: props.noteTracksRef, subdiv: props.midiState.subdiv, controlsDispatch: props.controlsDispatch }));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
