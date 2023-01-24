"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = require("axios");
const SoundSettings_1 = require("./SettingsComponents/SoundSettings");
const MidiSettings_1 = require("./SettingsComponents/MidiSettings");
const TimerButtons_1 = require("./SettingsComponents/TimerButtons");
const KbFunctions_1 = require("./Tools/KbFunctions");
const KeyNoteInput_1 = require("./Tools/KeyNoteInput");
const Timer_1 = require("./Tools/Timer");
const MidiRecorder_1 = require("./MidiComponents/MidiRecorder");
const Piano_1 = require("./PianoComponents/Piano");
const PianoRoll_1 = require("./PianoComponents/PianoRoll");
const Grid_1 = require("./MidiComponents/Grid");
const ErrorBoundary_1 = require("./Tools/ErrorBoundary");
require("./App.css");
const UISettings_1 = require("./SettingsComponents/UISettings");
const LoginModal_1 = require("./LoginModal");
var JZZ = require('jzz');
require('jzz-midi-smf')(JZZ);
function soundReducer(state, action) {
    switch (action.type) {
        case 'sound':
            return { ...state, sound: action.sound };
        case 'octave':
            return { ...state, octave: action.octave };
        case 'volume':
            return { ...state, volume: action.volume };
        default:
            return state;
    }
}
function midiReducer(state, action) {
    switch (action.type) {
        case 'numMeasures':
            return { ...state, numMeasures: action.numMeasures };
        case 'subdiv':
            return { ...state, subdiv: action.subdiv };
        case 'bpm':
            return { ...state, bpm: action.bpm };
        case 'metronome':
            return { ...state, metronome: action.metronome };
        case 'mode':
            return { ...state, mode: action.mode };
        default:
            return state;
    }
}
function controlsReducer(state, action) {
    switch (action.type) {
        case 'export':
            return { ...state, export: action.export };
        case 'undo':
            return { ...state, undo: action.undo };
        default:
            return state;
    }
}
function App() {
    const [soundDetails, setSoundDetails] = (0, react_1.useState)({});
    const [soundState, soundDispatch] = (0, react_1.useReducer)(soundReducer, { octave: 3, sound: 'GrandPiano', volume: '2mf' });
    const [midiState, midiDispatch] = (0, react_1.useReducer)(midiReducer, { bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 96, subdiv: 4 });
    const [controlsState, controlsDispatch] = (0, react_1.useReducer)(controlsReducer, { export: false, undo: false });
    const [octaveMinMax, setOctaveMinMax] = (0, react_1.useState)([0, 0]);
    const [controlsPressed, setControlsPressed] = (0, react_1.useState)(['', false]);
    const selectorsRef = (0, react_1.useRef)(null);
    const midiLength = (0, react_1.useMemo)(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
    const pulseRate = (0, react_1.useMemo)(() => midiState.ppq * midiState.bpm / 60 / 1000, [midiState.bpm, midiState.ppq]); // ppq / bpm in ms
    const timerRef = (0, react_1.useRef)(null);
    const [time, setTime] = (0, react_1.useState)(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
    const [pulseNum, setPulseNum] = (0, react_1.useState)(0);
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [keysUnpressed, setKeysUnpressed] = (0, react_1.useState)({});
    const [playback, setPlayback] = (0, react_1.useState)({});
    const [metPlay, setMetPlay] = (0, react_1.useState)(false);
    const pianoRollKeyRef = (0, react_1.useRef)(null);
    const labelsRef = (0, react_1.useRef)(null);
    const [noteTracks, setNoteTracks] = (0, react_1.useState)(null);
    const noteTracksRef = (0, react_1.useRef)(null);
    const [gridSize, setGridSize] = (0, react_1.useState)([]);
    const [focus, setFocus] = (0, react_1.useState)(false);
    const [user, setUser] = (0, react_1.useState)('');
    const [trackName, setTrackName] = (0, react_1.useState)('');
    // const [soundDetails, setSoundDetails] = useState({});
    (0, react_1.useEffect)(() => {
        console.log('keyPr', keysPressed);
    }, [keysPressed]);
    (0, react_1.useEffect)(() => {
        console.log('keyUn', keysUnpressed);
        console.log('keyPr', keysPressed);
    }, [keysUnpressed]);
    (0, react_1.useEffect)(() => {
        console.log(`${process.env.REACT_APP_API}/sounds/Instruments`);
        async function getSoundDetails() {
            console.log('hello');
            const url = `${process.env.REACT_APP_API}/sounds/Instruments`;
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,
                },
            };
            var soundDetails = {};
            console.log(options);
            const soundDeets = await axios_1.default.get(url, options)
                .then(res => {
                soundDetails = res.data;
                console.log(soundDetails);
                return res.data;
            }).catch(err => console.error(err));
            setSoundDetails(soundDetails);
            return soundDeets;
        }
        getSoundDetails();
    }, []);
    (0, react_1.useEffect)(() => {
        if (Object.keys(soundDetails).length > 0) {
            let octavesArray = Object.keys(soundDetails[soundState.sound]);
            let octaveNums = [];
            octavesArray.forEach((octave) => {
                octaveNums.push(parseInt(octave));
            });
            let result = [Math.min(...octaveNums) + 1, Math.max(...octaveNums) + 1];
            setOctaveMinMax(result);
        }
    }, [soundDetails]);
    (0, react_1.useEffect)(() => {
        // console.log(pulseNum , 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
        if (time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4) {
            midiDispatch({ type: 'mode', mode: 'stop' });
            setTimeout(() => midiDispatch({ type: 'mode', mode: 'keyboard' }));
        }
    }, [time]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'stop') {
            setPulseNum(0);
            setTime(0);
            // setPlayback(tempPlayback)
            // setPlayback({})
        }
    }, [midiState.mode]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'keyboard') {
            let tempKeysPressed = { ...keysPressed };
            let tempPlayback = { ...playback };
            Object.entries(keysPressed).forEach((keyPressed) => {
                tempKeysPressed[keyPressed[0]] = { ...keyPressed[1], end: -1 };
            });
            setKeysPressed({});
        }
    }, [midiState.mode]);
    (0, react_1.useEffect)(() => {
        console.log(controlsState.export);
        if (controlsState.export) {
            if (/[a-zA-Z]/g.test(trackName)) {
                alert('Please name your track.');
            }
            else {
                console.log(midiState.mode);
                let pulses = Object.keys(playback);
                var smf = new JZZ.MIDI.SMF(0, midiState.ppq);
                var trk = new JZZ.MIDI.SMF.MTrk();
                smf.push(trk);
                trk.add(0, JZZ.MIDI.smfSeqName('Midi from *Working Site Name*.com'));
                trk.add(0, JZZ.MIDI.smfBPM(midiState.bpm));
                for (var i = 0; i < pulses.length; i++) {
                    let note = Object.keys(playback[pulses[i]])[0];
                    if (playback[pulses[i]][note].end === -1) {
                        continue;
                    }
                    else {
                        trk.add(playback[pulses[i]][note].start, JZZ.MIDI.noteOn(0, note, 70));
                        trk.add(playback[pulses[i]][note].end, JZZ.MIDI.noteOff(0, note, 70));
                    }
                }
                smf.dump();
                let element = document.createElement("a");
                let midiUrl = "data:audio/midi;base64," + window.btoa(smf.dump());
                element.setAttribute("href", midiUrl);
                element.setAttribute("download", `${trackName}.mid`);
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
            controlsDispatch({ type: 'export', export: false });
        }
    }, [controlsState.export]);
    function getOctaveArray() {
        let octaveArray = [];
        Object.keys(soundDetails).some((key) => {
            if (key === soundState.sound) {
                Object.keys(soundDetails[key]).forEach((octave) => {
                    octaveArray.push(parseInt(octave));
                });
            }
        });
        return octaveArray;
    }
    function setResetPlayback(recording, playbackOff) {
        console.log(recording, playbackOff, midiState.mode);
        if (midiState.mode === 'playing' || midiState.mode === 'recording') {
            // setPlayback(recording)
        }
        else if (midiState.mode === 'stop') {
            // setPlayback(recording)
        }
    }
    function pianoRollKeysPressed(keyPressed) {
        pianoRollKeyRef.current = keyPressed;
    }
    function metPlayed(dut) {
        setMetPlay(dut);
    }
    function clearControls() {
        setControlsPressed(['', false]);
    }
    function setXGridSize(size) {
        setGridSize((gridSize) => {
            let state = [...gridSize];
            state[0] = size;
            return state;
        });
    }
    function setFocusLogin(focus) {
        setFocus(focus);
    }
    const bgSizeTrack = 100 / midiState.numMeasures;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "App", id: 'App', children: [(0, jsx_runtime_1.jsx)("style", { children: `
        @media only screen and (min-width: 768px) {
          #midi {
            grid-template:
            'labels' 'midi' / 100px ${window.innerWidth - 100}px;
          }

            #midi-note-labels {
              max-width: 100px;
              width: 100%;
            }
            #midi-track {  
              width: calc(100% + ${gridSize[0]});
            }
        }
        ` }), (0, jsx_runtime_1.jsxs)("div", { ref: selectorsRef, id: 'selectors', children: [(user.length > 0) ? (0, jsx_runtime_1.jsxs)("span", { children: ["welcome ", user] }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (0, jsx_runtime_1.jsx)(LoginModal_1.default, { setFocus: setFocus, setUser: setUser }), (0, jsx_runtime_1.jsx)(SoundSettings_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, volume: soundState.volume, pianoDispatch: soundDispatch }), (0, jsx_runtime_1.jsx)(MidiSettings_1.default, { soundDetails: soundDetails, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, bpm: midiState.bpm, mode: midiState.mode, controlsDispatch: controlsDispatch, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(UISettings_1.default, { setXGridSize: setXGridSize }), (0, jsx_runtime_1.jsxs)("div", { ref: timerRef, id: 'timer-buttons', children: [(0, jsx_runtime_1.jsx)(TimerButtons_1.default, { metPlay: metPlay, metronome: midiState.metronome, mode: midiState.mode, pulseNum: pulseNum, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(KbFunctions_1.default, { controlsPressed: controlsPressed, metronome: midiState.metronome, mode: midiState.mode, octaveMinMax: octaveMinMax, selectorsRef: selectorsRef, clearControls: () => setControlsPressed(['', false]), controlsDispatch: controlsDispatch, midiDispatch: midiDispatch, soundDispatch: soundDispatch })] })] }), (0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)(PianoRoll_1.default, { labelsRef: labelsRef, midiLength: midiLength, noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, octave: soundState.octave, pulseNum: pulseNum, pulseRate: pulseRate, sound: soundState.sound, soundDetails: soundDetails, subdiv: midiState.subdiv, time: pulseNum, handleNotePlayed: pianoRollKeysPressed }), (0, jsx_runtime_1.jsx)("div", { id: 'midi-track', style: { backgroundSize: `${bgSizeTrack}%`, width: `calc(100% - ${gridSize[0]})` }, children: (0, jsx_runtime_1.jsx)(Grid_1.default, { gridSize: gridSize, midiLength: midiLength, noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, pulseNum: pulseNum, pulseRate: pulseRate, subdiv: midiState.subdiv, octaveArray: getOctaveArray(), setNoteTracks: setNoteTracks }) })] }), (0, jsx_runtime_1.jsx)(KeyNoteInput_1.default, { focus: focus, octave: soundState.octave, pianoRollKey: pianoRollKeyRef.current, pulseNum: pulseNum, onControlsPressed: setControlsPressed, setKeysPressed: setKeysPressed, setKeysUnpressed: setKeysUnpressed }), (0, jsx_runtime_1.jsx)(Timer_1.default, { bpm: midiState.bpm, metronome: midiState.metronome, midiLength: midiLength, time: time, timerRef: timerRef, mode: midiState.mode, ppq: midiState.ppq, pulseNum: pulseNum, pulseRate: pulseRate, handleMetPlay: metPlayed, handleSetTime: setTime, handleSetPulseNum: setPulseNum }), (0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MidiRecorder_1.default, { controlsState: controlsState, gridSize: gridSize, keysPressed: keysPressed, keysUnpressed: keysUnpressed, midiLength: midiLength, midiState: midiState, noteTracks: noteTracks, noteTracksRef: noteTracksRef, pulseNum: pulseNum, pulseRate: pulseRate, selectorsRef: selectorsRef, username: user, controlsDispatch: controlsDispatch, midiDispatch: midiDispatch, setFocus: setFocus, setPlayback: setPlayback, setTrackName: setTrackName }) }), (0, jsx_runtime_1.jsx)(Piano_1.default, { keysPressed: keysPressed, keysUnpressed: keysUnpressed, pulseNum: pulseNum, soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, octaveMinMax: octaveMinMax, volume: soundState.volume, mode: midiState.mode, playback: playback, labelsRef: labelsRef })] }));
}
exports.default = App;
