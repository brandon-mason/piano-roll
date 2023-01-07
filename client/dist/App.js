"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = require("axios");
const SoundSettings_1 = require("./SettingsComponents/SoundSettings");
const MidiSettings_1 = require("./SettingsComponents/MidiSettings");
const TimerButtons_1 = require("./SettingsComponents/TimerButtons");
const KbFunctions_1 = require("./ToolComponents/KbFunctions");
const KeyNoteInput_1 = require("./ToolComponents/KeyNoteInput");
const Timer_1 = require("./ToolComponents/Timer");
const MidiRecorder_1 = require("./MidiRecorder");
const Piano_1 = require("./Piano");
const PianoRoll_1 = require("./PianoRoll");
const Grid_1 = require("./Grid");
require("./App.css");
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
function App() {
    const [soundDetails, setSoundDetails] = (0, react_1.useState)({});
    const [soundState, soundDispatch] = (0, react_1.useReducer)(soundReducer, { octave: 3, sound: 'GrandPiano', volume: '2mf' });
    const [midiState, midiDispatch] = (0, react_1.useReducer)(midiReducer, { bpm: 120, metronome: 'off', mode: 'keyboard', numMeasures: 4, ppq: 32, subdiv: 4 });
    const [octaveMinMax, setOctaveMinMax] = (0, react_1.useState)([0, 0]);
    const [controlsPressed, setControlsPressed] = (0, react_1.useState)(['', false]);
    const selectorsRef = (0, react_1.useRef)(null);
    ;
    const ppq = 24;
    const midiLength = (0, react_1.useMemo)(() => midiState.numMeasures * 4 / (midiState.bpm / 60 / 1000), [midiState.bpm, midiState.numMeasures]); // number of beats / bpm in ms
    const pulseRate = (0, react_1.useMemo)(() => midiState.ppq * midiState.bpm / 60 / 1000, [midiState.bpm, midiState.ppq]); // ppq / bpm in ms
    const [time, setTime] = (0, react_1.useState)(0); // 24 * 120 /60/1000 * 16 /(120/60/1000)
    const [pulseNum, setPulseNum] = (0, react_1.useState)(0);
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [playback, setPlayback] = (0, react_1.useState)({});
    const [metPlay, setMetPlay] = (0, react_1.useState)(false);
    const [pianoRollKey, setPianoRollKey] = (0, react_1.useState)([]);
    const pianoRollKeyRef = (0, react_1.useRef)(null);
    const labelsRef = (0, react_1.useRef)(null);
    const [noteTracks, setNoteTracks] = (0, react_1.useState)(null);
    const noteTracksRef = (0, react_1.useRef)(null);
    // const [soundDetails, setSoundDetails] = useState({});
    (0, react_1.useEffect)(() => {
        // console.error(midiState)
    }, [midiState]);
    (0, react_1.useEffect)(() => {
        async function getSoundDetails() {
            const url = 'http://localhost:3001/api/sounds/';
            const options = {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,
                },
            };
            var soundDetails = {};
            const soundDeets = await axios_1.default.get(url, options)
                .then(res => {
                soundDetails = res.data;
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
        if (time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
            midiDispatch({ type: 'mode', mode: 'keyboard' });
    }, [time]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'stop' || midiState.mode === 'keyboard') {
            let tempPlayback = JSON.stringify(playback).replaceAll('true', 'false');
            setPlayback(JSON.parse(tempPlayback));
        }
    }, [midiState.mode]);
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
    function pianoRollKeysPressed(keyPressed) {
        pianoRollKeyRef.current = keyPressed;
    }
    function metPlayed(dut) {
        setMetPlay(dut);
    }
    function clearControls() {
        setControlsPressed(['', false]);
    }
    const bgSizeTrack = 100 / midiState.numMeasures;
    return ((0, jsx_runtime_1.jsxs)("div", { className: "App", children: [(0, jsx_runtime_1.jsxs)("div", { ref: selectorsRef, id: 'selectors', children: [(0, jsx_runtime_1.jsx)(SoundSettings_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, volume: soundState.volume, pianoDispatch: soundDispatch }), (0, jsx_runtime_1.jsx)(MidiSettings_1.default, { soundDetails: soundDetails, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, bpm: midiState.bpm, mode: midiState.mode, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(TimerButtons_1.default, { metPlay: metPlay, metronome: midiState.metronome, mode: midiState.mode, pulseNum: pulseNum, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(KbFunctions_1.default, { controlsPressed: controlsPressed, metronome: midiState.metronome, mode: midiState.mode, octaveMinMax: octaveMinMax, selectorsRef: selectorsRef, clearControls: clearControls, midiDispatch: midiDispatch, soundDispatch: soundDispatch })] }), (0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)(PianoRoll_1.default, { labelsRef: labelsRef, midiLength: midiLength, noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, octave: soundState.octave, playback: playback, pulseNum: pulseNum, pulseRate: pulseRate, sound: soundState.sound, soundDetails: soundDetails, subdiv: midiState.subdiv, time: pulseNum, handleNotePlayed: pianoRollKeysPressed }), (0, jsx_runtime_1.jsx)("div", { id: 'midi-track', style: { backgroundSize: bgSizeTrack + '%' }, children: (0, jsx_runtime_1.jsx)(Grid_1.default, { octaveArray: getOctaveArray(), noteTracksRef: noteTracksRef, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, setNoteTracks: setNoteTracks }) })] }), (0, jsx_runtime_1.jsx)(KeyNoteInput_1.default, { octave: soundState.octave, pianoRollKey: pianoRollKeyRef.current, pulseNum: pulseNum, onControlsPressed: setControlsPressed, onNotePlayed: setKeysPressed }), (0, jsx_runtime_1.jsx)(Timer_1.default, { bpm: midiState.bpm, metronome: midiState.metronome, midiLength: midiLength, time: time, mode: midiState.mode, ppq: ppq, pulseNum: pulseNum, pulseRate: pulseRate, handleMetPlay: metPlayed, handleSetTime: setTime, handleSetPulseNum: setPulseNum, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(MidiRecorder_1.default, { soundDetails: soundDetails, midiState: midiState, keysPressed: keysPressed, midiLength: midiLength, pulseNum: pulseNum, pulseRate: pulseRate, noteTracks: noteTracks, noteTracksRef: noteTracksRef, setPlayback: setPlayback, soundDispatch: soundDispatch, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(Piano_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, octaveMinMax: octaveMinMax, volume: soundState.volume, mode: midiState.mode, keysPressed: keysPressed, pianoRollKey: pianoRollKey, playback: playback, labelsRef: labelsRef })] }));
}
exports.default = App;
