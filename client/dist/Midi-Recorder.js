"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const axios_1 = require("axios");
require("./Midi-Recorder.css");
const sound_settings_1 = require("./settings-components/sound-settings");
const midi_settings_1 = require("./settings-components/midi-settings");
const Piano_1 = require("./Piano");
const Piano_roll_1 = require("./Piano-roll");
function Timer(props) {
    const [date, setDate] = (0, react_1.useState)();
    const [time, setTime] = (0, react_1.useState)(0);
    (0, react_1.useLayoutEffect)(() => {
        let ppq = 24;
        let pulseRate = 60 / props.bpm / ppq * 1000; //interval
        // 60 / 120 / 24 * 1000
        if (props.mode === 'recording') {
            let start = performance.now();
            let timeTemp = time;
            let pulseNum = 0;
            setDate(setInterval(() => {
                let expected = timeTemp + pulseRate;
                timeTemp += performance.now() - start;
                timeTemp += timeTemp - expected;
                // timeTemp -= delta;
                // console.log(timeTemp, expected)
                pulseNum++;
                // console.log(countTemp);
                start = performance.now();
                setTime(timeTemp);
                props.handleSetTime(timeTemp);
                props.handleSetPulseNum(pulseNum);
            }, pulseRate));
            // setDate(date);
        }
        else if (props.mode === 'keyboard') {
            // console.error(date)
            clearInterval(date);
            if (time >= props.midiLength)
                setTime(0);
        }
    }, [props.mode]);
    function updateTime() {
        props.handleSetTime(time);
    }
    return null;
}
// interface IPiano {
//   type: string;
//   sound: string;
//   octave: number;
//   volume: string;
// }
const useEffectOnlyOnce = (callback, dependencies, condition) => {
    const calledOnce = react_1.default.useRef(false);
    react_1.default.useEffect(() => {
        if (calledOnce.current) {
            return;
        }
        if (condition(dependencies)) {
            callback(dependencies);
            calledOnce.current = true;
        }
    }, [callback, condition, dependencies]);
};
function pianoReducer(state, action) {
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
// interface IMidi {
//   type: string;
//   numMeasures: number
//   subdiv: number;
//   bpm: number;
//   mode: string;
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
function timeReducer(state, action) {
    switch (action.type) {
        case 'pulseNum':
            return { ...state, pulseNum: action.pulseNum };
        default:
            return state;
    }
}
function MidiRecorder() {
    const [toggle, setToggle] = (0, react_1.useState)(true);
    const [pianoState, pianoDispatch] = (0, react_1.useReducer)(pianoReducer, { sound: 'GrandPiano', octave: 3, volume: '2mf' });
    const [midiState, midiDispatch] = (0, react_1.useReducer)(midiReducer, { numMeasures: 4, subdiv: '4', bpm: 120, mode: 'keyboard' });
    const [timeState, timeStateDispatch] = (0, react_1.useReducer)(timeReducer, { pulseNum: 0 });
    const [time, setTime] = (0, react_1.useState)(0);
    const [pulseNum, setPulseNum] = (0, react_1.useState)(0);
    const [midi, setMidi] = (0, react_1.useState)({});
    const [notesPlayed, setNotesPlayed] = (0, react_1.useState)({});
    const [pianoRollKey, setPianoRollKey] = (0, react_1.useState)([]);
    const [soundDetails, setSoundDetails] = (0, react_1.useState)({});
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
    const calledOnce = react_1.default.useRef(false);
    (0, react_1.useEffect)(() => {
        if (calledOnce.current)
            return;
        if (!toggle) {
            let input = document.getElementById('key-note-input');
            let keydownE = new KeyboardEvent('keydown', {
                key: pianoRollKey[0],
                code: pianoRollKey[1]
            });
            if (input)
                input.dispatchEvent(keydownE);
            console.log('input', keydownE);
            calledOnce.current = true;
        }
        // console.error(pianoRollKey.length, pianoRollKey)
        // // if(pianoRollKey.length === 0){
        //   let input = document.getElementById('key-note-input');
        //   let keydownE = new KeyboardEvent('keydown', {
        //     key: pianoRollKey[0],
        //   });
        //   if(input) input.dispatchEvent(keydownE);
        //   console.log('input', keydownE)
        // }
    }, [toggle]);
    (0, react_1.useEffect)(() => {
        if (time >= 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4)
            midiDispatch({ type: 'mode', mode: 'keyboard' });
        // while(midiState.mode === 'recording') {
        //   setLastPulse(performance.now());
        // }
        // console.log(pianoState)
        // console.log(midiState)
    }, [time]);
    function timeKeeper() {
        let ppq = 24;
        let pulseRate = 60000 / midiState.bpm / ppq;
        if (midiState.mode === 'recording') {
            // recording(pulseRate);
        }
        else if (midiState.mode === 'playing') {
        }
    }
    function pianoRollKeysPressed(keyPressed) {
        // console.warn('keyPressed', keyPressed)
        setToggle(false);
        setPianoRollKey(keyPressed);
        // setNotesPlayed((notesPlayed) => ({...notesPlayed, [keyPressed[0]]: keyPressed[1]}))
    }
    function recording() {
    }
    // function setTimer(time) {
    //   setTime(time);
    // }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { id: 'selectors', children: [(0, jsx_runtime_1.jsx)(sound_settings_1.default, { soundDetails: soundDetails, sound: pianoState.sound, octave: pianoState.octave, volume: pianoState.volume, pianoDispatch: pianoDispatch }), (0, jsx_runtime_1.jsx)(midi_settings_1.default, { soundDetails: soundDetails, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, bpm: midiState.bpm, mode: midiState.mode, midiDispatch: midiDispatch })] }), (0, jsx_runtime_1.jsx)(Timer, { mode: midiState.mode, bpm: midiState.bpm, midiLength: 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4, handleSetTime: setTime, handleSetPulseNum: setPulseNum }), (0, jsx_runtime_1.jsx)(Piano_1.default, { soundDetails: soundDetails, sound: pianoState.sound, octave: parseInt(pianoState.octave), volume: pianoState.volume, pianoRollKey: pianoRollKey, pianoRollNotes: notesPlayed, onNotePlayed: setNotesPlayed }), (0, jsx_runtime_1.jsx)(Piano_roll_1.default, { soundDetails: soundDetails, time: time, midiLength: 1000 / (midiState.bpm / 60) * midiState.numMeasures * 4, sound: pianoState.sound, octave: pianoState.octave, numMeasures: midiState.numMeasures, subdiv: midiState.subdiv, onNotePlayed: pianoRollKeysPressed })] }));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
