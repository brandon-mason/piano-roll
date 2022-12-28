"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = require("axios");
const SoundSettings_1 = require("./SettingsComponents/SoundSettings");
const MidiSettings_1 = require("./SettingsComponents/MidiSettings");
const KeyNoteInput_1 = require("./ToolComponents/KeyNoteInput");
const Timer_1 = require("./ToolComponents/Timer");
const MidiRecorder_1 = require("./MidiRecorder");
const Piano_1 = require("./Piano");
const Piano_roll_1 = require("./Piano-roll");
require("./App.css");
// interface Reducer<State, Action> {
//   (state: State, action: Action): State;
// }
// interface SoundState {
//   sound: string;
//   octave: number;
//   volume: string;
// };
// interface SoundAction {
//   type: string;
//   sound?: string;
//   octave?: number;
//   volume?: string;
// }
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
// interface MidiState {
//   numMeasures: number;
//   subdiv: number;
//   bpm: number;
//   mode: string;
// }
// interface MidiAction {
//   type: string;
//   numMeasures?: number;
//   subdiv?: number;
//   bpm?: number;
//   mode?: string;
// }
function midiReducer(state, action) {
    switch (action.type) {
        case 'numMeasures':
            return { ...state, numMeasures: action.numMeasures };
        case 'subdiv':
            return { ...state, subdiv: action.subdiv };
        case 'bpm':
            return { ...state, bpm: action.bpm };
        case 'mode':
            return { ...state, mode: action.mode };
        default:
            return state;
    }
}
// interface KeysPressed {
//   [key: string]: {
//     octave: number;
//     pressed: boolean;
//     time: number;
//   };
// }
// interface Midi {
//   [time: number]: KeysPressed;
// }
function App() {
    const [soundDetails, setSoundDetails] = (0, react_1.useState)({});
    const [soundState, soundDispatch] = (0, react_1.useReducer)(soundReducer, { sound: 'GrandPiano', octave: 3, volume: '2mf' });
    const [midiState, midiDispatch] = (0, react_1.useReducer)(midiReducer, { numMeasures: 4, subdiv: 4, bpm: 120, mode: 'keyboard' });
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [time, setTime] = (0, react_1.useState)(0);
    const [pulseNum, setPulseNum] = (0, react_1.useState)(0);
    const [playback, setPlayback] = (0, react_1.useState)({});
    const [pianoRollKey, setPianoRollKey] = (0, react_1.useState)([]);
    const pianoRollKeyRef = (0, react_1.useRef)(null);
    const labelsRef = (0, react_1.useRef)(null);
    // const [soundDetails, setSoundDetails] = useState({});
    (0, react_1.useEffect)(() => {
        console.log(soundState);
    }, [soundState]);
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
        console.log(pulseNum, 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4);
        if (time > 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
            midiDispatch({ type: 'mode', mode: 'keyboard' });
    }, [time]);
    (0, react_1.useEffect)(() => {
        if (midiState.mode === 'stop' || midiState.mode === 'keyboard') {
            let tempOutput = JSON.stringify(playback).replaceAll('true', 'false');
            setPlayback(JSON.parse(tempOutput));
        }
    }, [midiState.mode]);
    function setNoteProps(controller) {
        setKeysPressed(controller);
    }
    function pianoRollKeysPressed(keyPressed) {
        pianoRollKeyRef.current = keyPressed;
    }
    function handlePlayback(midi) {
        setPlayback(midi);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "App", children: [(0, jsx_runtime_1.jsxs)("div", { id: 'selectors', children: [(0, jsx_runtime_1.jsx)(SoundSettings_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, volume: soundState.volume, pianoDispatch: soundDispatch }), (0, jsx_runtime_1.jsx)(MidiSettings_1.default, { soundDetails: soundDetails, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, bpm: midiState.bpm, mode: midiState.mode, midiDispatch: midiDispatch })] }), (0, jsx_runtime_1.jsx)(KeyNoteInput_1.default, { octave: soundState.octave, onNotePlayed: setNoteProps, pianoRollKey: pianoRollKeyRef.current }), (0, jsx_runtime_1.jsx)(Timer_1.default, { mode: midiState.mode, bpm: midiState.bpm, midiLength: 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4, time: time, pulseNum: pulseNum, handleSetTime: setTime, handleSetPulseNum: setPulseNum, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(MidiRecorder_1.default, { soundDetails: soundDetails, soundState: soundState, midiState: midiState, keysPressed: keysPressed, time: pulseNum, handlePlayback: handlePlayback, soundDispatch: soundDispatch, midiDispatch: midiDispatch }), (0, jsx_runtime_1.jsx)(Piano_1.default, { soundDetails: soundDetails, sound: soundState.sound, octave: soundState.octave, volume: soundState.volume, mode: midiState.mode, keysPressed: keysPressed, pianoRollKey: pianoRollKey, playback: playback, labelsRef: labelsRef }), (0, jsx_runtime_1.jsx)(Piano_roll_1.default, { soundDetails: soundDetails, time: time, midiLength: 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4, playback: playback, sound: soundState.sound, octave: soundState.octave, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, labelsRef: labelsRef, handleNotePlayed: pianoRollKeysPressed })] }));
}
exports.default = App;
