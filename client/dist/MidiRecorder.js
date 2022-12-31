"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import MidiNotes from './MidiNotes';
const MidiNotesCopy_1 = require("./MidiNotesCopy");
require("./MidiRecorder.css");
const ErrorBoundary_1 = require("./ErrorBoundary");
const qwertyNote = require('./note-to-qwerty-key-obj');
// replace midistate prop with mode prop
function MidiRecorder(props) {
    const [pianoRollKey, setPianoRollKey] = (0, react_1.useState)([]);
    const [midiRecord, setMidiRecord] = (0, react_1.useState)([]);
    const calledOnce = react_1.default.useRef(false);
    const labelsRef = react_1.default.useRef(null);
    const pianoRollKeyRef = react_1.default.useRef(null);
    (0, react_1.useEffect)(() => {
        console.warn(midiRecord);
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
            setMidiRecord((midiRecord) => ({ ...midiRecord, [props.pulseNum]: props.keysPressed }));
        };
        const playing = () => {
            // console.log('midiRecord', midiRecord)
            Object.keys(midiRecord).forEach((timeKey) => {
                // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
                if (props.pulseNum === parseInt(timeKey)) {
                    props.setPlayback(midiRecord[parseInt(timeKey)]);
                }
            });
        };
        if (props.pulseNum >= props.midiLength * props.pulseRate)
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
    }, [props.keysPressed, props.midiState.mode]);
    (0, react_1.useLayoutEffect)(() => {
        const playing = () => {
            // console.log('midiRecord', midiRecord)
            Object.keys(midiRecord).forEach((timeKey) => {
                // console.log(props.pulseNum === parseInt(timeKey), props.midiState.mode)
                if (props.pulseNum === parseInt(timeKey)) {
                    props.setPlayback(midiRecord[parseInt(timeKey)]);
                }
            });
        };
        if (props.midiState.mode === 'playing' && props.keysPressed) {
            playing();
        }
    }, [props.pulseNum, props.midiState.mode]);
    function setNoteClicked(noteOct, noteStartProps, noteEndProps) {
        // console.log(noteOct, midiRecord[noteEndProps.end!]);
        setMidiRecord((midiRecord) => ({
            ...midiRecord, [noteStartProps.start]: {
                ...midiRecord[noteStartProps.start],
                ...{ [noteOct]: noteStartProps }
            },
            [noteEndProps.end]: {
                ...midiRecord[noteEndProps.end],
                ...{ [noteOct]: noteEndProps }
            }
        }));
    }
    function setNoteRemoved(noteOct, start, end) {
        // console.log(noteOct, midiRecord[noteEndProps.end!]);
        setMidiRecord((midiRecord) => {
            const state = { ...midiRecord };
            delete state[start];
            delete state[end];
            return state;
        });
    }
    return ((0, jsx_runtime_1.jsx)(ErrorBoundary_1.ErrorBoundary, { children: (0, jsx_runtime_1.jsx)(MidiNotesCopy_1.default, { keysPressed: props.keysPressed, midiLength: props.midiLength, midiRecord: midiRecord, midiState: props.midiState, pulseNum: props.pulseNum, pulseRate: props.pulseRate, noteTracksRef: props.noteTracksRef, subdiv: props.midiState.subdiv, onNoteClicked: setNoteClicked, onNoteRemoved: setNoteRemoved }) }));
}
// 1000 / (120 / 60) * 4 * 4
exports.default = MidiRecorder;
