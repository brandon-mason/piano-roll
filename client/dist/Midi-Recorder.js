"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Midi-Recorder.css");
const qwertyNote = require('./note-to-qwerty-key-obj');
// interface MidiRecord {
//   [time: number]: KeysPressed;
// }
// interface KeysPressed {
//   [key: string]: {
//     octave: number;
//     pressed: boolean;
//     time: number;
//   };
// };
// interface MidiRecorderProps {
//   soundDetails: {
//     [key: string]: {
//       fileName: string;
//       displayName: string;
//     }
//   }
//   soundState: {
//     sound: any;
//     octave: number;
//     volume: string;
//   };
//   midiState: {
//     numMeasures: any;
//     subdiv: number;
//     bpm: number;
//     mode: string;
//   }
//   keysPressed: KeysPressed;
//   time: number;
//   handlePlayback: Function;
//   soundDispatch: React.Dispatch<any>;
//   midiDispatch: React.Dispatch<any>;
// }
// interface obj {
//   [time: number]: KeysPressed;
// }
function MidiRecorder(props) {
    const [pianoRollKey, setPianoRollKey] = (0, react_1.useState)([]);
    const [midiRecord, setMidiRecord] = (0, react_1.useState)([]);
    const calledOnce = react_1.default.useRef(false);
    const labelsRef = react_1.default.useRef(null);
    const pianoRollKeyRef = react_1.default.useRef(null);
    (0, react_1.useEffect)(() => {
        console.log(midiRecord);
    }, [midiRecord]);
    (0, react_1.useLayoutEffect)(() => {
    }, [props.midiState.mode]);
    // Send first keyboard event to Piano component
    // useEffect(() => {
    //   if(calledOnce.current) return;
    //   if(!toggle) {
    //     let input = document.getElementById('key-note-input');
    //     let keydownE = new KeyboardEvent('keydown', {
    //       key: pianoRollKey[0],
    //       code: pianoRollKey[1]
    //     });
    //     if(input) input.dispatchEvent(keydownE);
    //     calledOnce.current = true;
    //   }
    // }, [toggle])
    (0, react_1.useLayoutEffect)(() => {
        const recording = () => {
            let obj = [];
            let kpKeys = Object.keys(props.keysPressed);
            setMidiRecord((midiRecord) => ({ ...midiRecord, [props.time]: props.keysPressed }));
        };
        const playing = () => {
            console.log('midiRecord', midiRecord);
            Object.keys(midiRecord).forEach((timeKey) => {
                console.log(props.time === parseInt(timeKey), props.midiState.mode);
                if (props.time === parseInt(timeKey)) {
                    props.handlePlayback(midiRecord[parseInt(timeKey)]);
                }
            });
        };
        let pulseRate = 60 / props.midiState.bpm / 24 * 1000;
        let midiLength = 1000 / (props.midiState.bpm / 60) * props.midiState.numMeasures * 4;
        if (props.time >= midiLength / pulseRate)
            props.midiDispatch({ type: 'mode', mode: 'keyboard' });
        if (props.midiState.mode === 'stop') {
            props.midiDispatch({ type: 'mode', mode: 'keyboard' });
        }
        else if (props.midiState.mode === 'recording' && props.keysPressed) {
            recording();
        }
        else if (props.midiState.mode === 'playing' && props.keysPressed) {
            playing();
        }
        // while(midiState.mode === 'recording') {
        //   setLastPulse(performance.now());
        // }
        // console.log(pianoState)
        // console.log(midiState)
    }, [props.keysPressed, props.midiState.mode]);
    (0, react_1.useLayoutEffect)(() => {
        const playing = () => {
            console.log('midiRecord', midiRecord);
            Object.keys(midiRecord).forEach((timeKey) => {
                console.log(props.time === parseInt(timeKey), props.midiState.mode);
                if (props.time === parseInt(timeKey)) {
                    props.handlePlayback(midiRecord[parseInt(timeKey)]);
                }
            });
        };
        if (props.midiState.mode === 'playing' && props.keysPressed) {
            playing();
        }
    }, [props.time, props.midiState.mode]);
    function initMidiRecord(keysPressed1) {
        // console.log(keysPressed1)
        // keysPressed.current = keysPressed1
    }
    function pianoRollKeysPressed(keyPressed) {
        console.log();
        // setToggle(false);
        pianoRollKeyRef.current = keyPressed;
    }
    function recordNote() {
    }
    // function setTimer(time) {
    //   setTime(time);
    // }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
