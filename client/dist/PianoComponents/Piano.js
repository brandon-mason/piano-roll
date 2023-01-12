"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const howler_1 = require("howler");
require("./Piano.css");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
function OctavesInView(props) {
    const [toFetch, setToFetch] = (0, react_1.useState)([]);
    const observer = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let octavesInView = [];
        const buildThresholdArr = () => {
            let arr = [0];
            for (let i = 1; i < props.octaveMax + 1; i++) {
                let num = i / props.octaveMax;
                arr.push(Math[num < 0 ? 'ceil' : 'floor'](num * 100) / 100);
            }
            return arr;
        };
        const callback = (entries, observer) => {
            let toFetchTemp = [];
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    toFetchTemp.push(parseInt(entry.target.getAttribute('id').substring(0, 1)));
                    // console.log(toFetchTemp)
                }
            });
            setToFetch(toFetchTemp);
        };
        props.handleViewChange(toFetch);
        const options = { root: null, rootMargin: '0px', threshold: 0 };
        observer.current = new IntersectionObserver(callback, options);
    }, [props.octaveMax, toFetch]);
    (0, react_1.useEffect)(() => {
        let element = document.getElementById('midi');
        if (observer.current && props.labelsRef.current && props.labelsRef.current.children.length === props.octaveMax) {
            let children = props.labelsRef.current.children;
            for (let i = 0; i < children.length; i++) {
                observer.current.observe(children[i]);
            }
        }
        return (() => {
            if (observer.current)
                observer.current.disconnect();
        });
    }, [props.labelsRef, props.octaveMax]);
    (0, react_1.useEffect)(() => {
        props.handleViewChange([props.octave]);
    }, [props.octave]);
    return null;
}
function Piano(props) {
    const [fetchedSounds, setFetchedSounds] = (0, react_1.useState)({});
    const [prevNotes, setPrevNotes] = (0, react_1.useState)({});
    const [keysRecorded, setKeysRecorded] = (0, react_1.useState)([]);
    const [playbackOff, setPlaybackOff] = (0, react_1.useState)({});
    const [playbackOn, setPlaybackOn] = (0, react_1.useState)({});
    const [startPulse, setStartPulse] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => {
        // console.log('piano playback', props.playback);
        setPlaybackOff((playbackOff) => {
            let state = { ...playbackOff };
            if (props.playback[props.pulseNum]) {
                Object.keys(props.playback[props.pulseNum]).forEach((noteOct) => {
                    state = { ...state, [noteOct]: { ...props.playback[props.pulseNum][noteOct], pressed: false, end: props.pulseNum } };
                });
            }
            // console.log(state)
            return state;
        });
        setPlaybackOn((playbackOn) => {
            let state = {};
            if (props.playback[props.pulseNum]) {
                Object.keys(props.playback[props.pulseNum]).forEach((noteOct) => {
                    state = { ...state, [noteOct]: { ...props.playback[props.pulseNum][noteOct], pressed: true, end: -1 } };
                });
            }
            // console.log(state)
            return state;
        });
    }, [props.pulseNum]);
    (0, react_1.useEffect)(() => {
        if (Object.keys(prevNotes).length > 0) {
            if (props.mode === 'stop') {
                Object.keys(prevNotes).forEach((noteOct) => {
                    if (prevNotes[noteOct] > 0) {
                        let octave = noteOct.replace(/\D/g, '');
                        howler_1.Howler.stop();
                        fetchedSounds[octave][props.volume].mute(true, prevNotes[noteOct]);
                    }
                });
            }
            else if (props.mode === 'keyboard') {
                // Object.keys(prevNotes).forEach((noteOct) => {
                //   if(prevNotes[noteOct] > 0) {
                //     let octave = noteOct.replace(/\D/g, '');
                //     Howler.stop(); 
                //     fetchedSounds[octave][props.volume].mute(true, prevNotes[noteOct]); 
                //   }
                // })
                Object.keys(prevNotes).forEach((noteOct) => {
                    if (prevNotes[noteOct] > 0) {
                        let octave = noteOct.replace(/\D/g, '');
                        fetchedSounds[octave][props.volume].pause();
                    }
                });
            }
            else if (props.mode === 'playing') {
                Object.keys(prevNotes).forEach((noteOct) => {
                    if (prevNotes[noteOct] > 0) {
                        let octave = noteOct.replace(/\D/g, '');
                        fetchedSounds[octave][props.volume].play(prevNotes[noteOct]);
                    }
                });
            }
        }
    }, [props.mode]);
    (0, react_1.useEffect)(() => {
        // console.log(props.pulseNum);
    }, [props.pulseNum]);
    (0, react_1.useEffect)(() => {
        function playNote(output) {
            // console.log(output)
            let qwertyOctave;
            let noteName;
            let prevNotesTemp = prevNotes;
            Object.keys(output).forEach((noteOct) => {
                // console.log(output)
                let key = output[noteOct].key;
                let note = noteOct.replace(/[0-9]/g, '');
                let octave = parseInt(noteOct.replace(/\D/g, ''));
                console.log(octave);
                Object.keys(qwertyNote).forEach((qwertyKey) => {
                    qwertyOctave = qwertyNote[qwertyKey].octave;
                    if (octave < props.octaveMinMax[1]) {
                        if (qwertyKey === key && fetchedSounds[octave][props.volume]) {
                            (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
                            let labelElem = document.getElementById(noteName.toLowerCase() + '-label');
                            if (output[noteOct].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                                let sound = fetchedSounds[octave][props.volume];
                                let soundId = sound.play(note);
                                prevNotesTemp[noteName] = soundId;
                                labelElem.classList.toggle('active');
                            }
                            else if (!output[noteOct].pressed && prevNotes[noteName] > 0) {
                                labelElem.classList.toggle('active');
                                Object.keys(prevNotes).some((playedNote) => {
                                    if (playedNote === noteName) {
                                        fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                                    }
                                });
                                prevNotesTemp[noteName] = 0;
                            }
                        }
                    }
                });
            });
            setPrevNotes(prevNotesTemp);
            // setPlaybackOff({})
        }
        if (props.mode === 'playing' || props.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
            // console.log(props.pulseNum);
            let pbKp = { ...props.playback[props.pulseNum] };
            let state = [];
            if (startPulse === 0) {
                // console.log('pbkp');
                playNote(pbKp);
            }
            else if (Object.keys(props.playback).includes(props.pulseNum + '')) {
                Object.keys(props.keysPressed).forEach((noteOct) => {
                    if (props.keysPressed[noteOct].pressed) {
                        pbKp = { ...pbKp, [noteOct]: props.keysPressed[noteOct] };
                        state.push(noteOct);
                    }
                    else if (keysRecorded.find((key) => key === noteOct)) {
                        pbKp = { ...pbKp, [noteOct]: props.keysPressed[noteOct] };
                    }
                });
                console.log(props.pulseNum);
                setPlaybackOn((playbackOn) => {
                    let state = { ...playbackOn };
                    Object.keys(pbKp).forEach((noteOct) => {
                        if (pbKp[noteOct].end !== -1 && state[noteOct]) {
                            console.log('playbackOn', noteOct);
                            delete state[noteOct];
                        }
                    });
                    // console.log(state);
                    return state;
                });
                // console.log('not pbkp');
                playNote({ ...pbKp, ...playbackOn });
                setPlaybackOn({});
            }
            setKeysRecorded(state);
        }
        else if (props.mode === 'keyboard') {
            console.log('keyb');
            setStartPulse(props.pulseNum);
            playNote(props.keysPressed);
        }
        else if (props.mode === 'stop') {
            setStartPulse(0);
            // console.log('stop');
            playNote(playbackOff);
            setPlaybackOff({});
        }
        // if(props.mode === 'recording' || props.mode === 'playing'){
        //   let pbKp: KeysPressed = {...props.playback}
        //   let state: string[] = [];
        //   Object.keys(props.keysPressed).forEach((noteOct) => {
        //     if(props.keysPressed[noteOct].pressed) {
        //       pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
        //       state.push(noteOct)
        //     } else if(keysRecorded.find((key) => key === noteOct)) {
        //       pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
        //     }
        //   })
        //   if(props.pulseNum > 0) {
        //     // setUnpausePulse(props.pulseNum)
        //     setPlaybackOn((playbackOn) => {
        //       let state = {...playbackOn}
        //       Object.keys(pbKp).forEach((noteOct) => {
        //         if(pbKp[noteOct].end > -1 && state[noteOct]) delete state[noteOct];
        //       })
        //       console.log(state);
        //       return state;
        //     })
        //     playNote({...pbKp, ...playbackOn});
        //   } else {
        //     playNote(pbKp);
        //   }
        //   setKeysRecorded(state);
        // } else if(props.mode === 'keyboard') {
        //   playNote(props.keysPressed);
        // } else if(props.mode === 'stop') {
        //   playNote(playbackOff);
        // }
    }, [props.mode, props.pulseNum, props.keysPressed, props.playback]);
    (0, react_1.useEffect)(() => {
        // if(props.pulseNum === unpausePulse) setPlaybackOn({})
    }, [props.pulseNum]);
    function loadSound(url) {
        let octaveSound;
        octaveSound = new howler_1.Howl({
            src: [url + '.webm', url + 'mp3'],
            sprite: {
                C: [0, 4999],
                'C#': [5000, 4999],
                D: [10000, 4999],
                Eb: [15000, 4999],
                E: [20000, 4999],
                F: [25000, 4999],
                'F#': [30000, 4999],
                G: [35000, 4999],
                'G#': [40000, 4999],
                A: [45000, 4999],
                Bb: [50000, 4999],
                B: [55000, 5000],
            },
            volume: .75,
        });
        return octaveSound;
    }
    function setView(toFetch) {
        let notFetched = [];
        // console.log(toFetch)
        for (let i = 0; i < toFetch.length; i++) {
            let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + toFetch[i] + '/' + props.volume;
            if (!fetchedSounds[toFetch[i]] || fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3') {
                notFetched.push(toFetch[i]);
            }
            if (notFetched.length > 0) {
                setFetchedSounds((fetchedSounds) => ({ ...fetchedSounds, [toFetch[i]]: { [props.volume]: loadSound(url) } }));
            }
        }
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(OctavesInView, { octaveMax: props.octaveMinMax[1], labelsRef: props.labelsRef, octave: props.octave, handleViewChange: setView }) }));
}
exports.default = Piano;
