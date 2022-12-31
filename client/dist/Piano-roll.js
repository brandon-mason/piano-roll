"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MidiNotes_1 = require("./MidiNotes");
const Grid_1 = require("./Grid");
require("./Piano-roll.css");
const qwertyNote = require('./note-to-qwerty-key');
// interface KeyProps {
//   key: string;
//   qwertyKey: string;
//   note: string;
//   altNote: string;
//   octave: number;
//   handleNotePlayed: Function;
// }
function Key(props) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const onPointerDown = (e) => {
            let input = document.getElementById('key-note-input');
            let keydownE = new KeyboardEvent('keydown', {
                key: props.qwertyKey,
                code: props.octave + ' ' + true,
            });
            if (input)
                input.dispatchEvent(keydownE);
            // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), true]);
        };
        const onPointerUp = (e) => {
            let input = document.getElementById('key-note-input');
            let keydownE = new KeyboardEvent('keyup', {
                key: props.qwertyKey,
                code: props.octave + ' ' + false,
            });
            if (input)
                input.dispatchEvent(keydownE);
            // props.handleNotePlayed([props.qwertyKey, parseInt(props.octave), false]);
        };
        const element = ref.current;
        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointerup', onPointerUp);
        return (() => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointerup', onPointerUp);
        });
    });
    let noteName;
    (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
    return ((0, jsx_runtime_1.jsxs)("button", { type: 'button', ref: ref, id: noteName.toLowerCase() + props.octave + '-label', className: (props.note.length > 1) ? 'note-label accidental' : 'note-label natural', children: [" ", props.note + props.octave] }));
}
// interface NoteLabelsProps {
//   octaveArray: string[];
//   octave: number;
//   labelsRef: React.RefObject<HTMLDivElement>;
//   handleNotePlayed: Function
// }
function NoteLabels(props) {
    const memoNoteLabels = (0, react_1.useMemo)(() => {
        let gridLabelOctaves = [];
        let gridLabels = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                gridLabelOctaves.push((0, jsx_runtime_1.jsx)(Key, { qwertyKey: qwertyNote[y].key, note: qwertyNote[y].note, altNote: qwertyNote[y].altNote, octave: parseInt(props.octaveArray[x]), handleNotePlayed: sendNoteProps }, qwertyNote[y].note + props.octaveArray[x]));
            }
            gridLabels.push((0, jsx_runtime_1.jsx)("div", { id: `${x}-octave`, className: 'note-label-octaves', children: gridLabelOctaves }, x));
            gridLabelOctaves = [];
        }
        if (gridLabels.length === props.octaveArray.length) {
            return gridLabels;
        }
        return [];
    }, [props.octaveArray]);
    (0, react_1.useEffect)(() => {
        var element = document.getElementById('g' + props.octave + '-label');
        if (element) {
            element.scrollIntoView({ block: 'center' });
        }
    }, [memoNoteLabels]);
    function sendNoteProps(keyPressed) {
        props.handleNotePlayed(keyPressed);
    }
    return (0, jsx_runtime_1.jsx)("div", { ref: props.labelsRef, id: 'midi-note-labels', children: memoNoteLabels });
}
// interface PianoRollProps {
//   soundDetails: Object;
//   time: number;
//   midiLength: number;
//   playback: KeysPressed;
//   sound: string
//   octave: number;
//   numMeasures: number;
//   subdiv: number;
//   labelsRef: React.RefObject<HTMLDivElement>;
//   handleNotePlayed: Function;
// }
function PianoRoll(props) {
    const gridRef = (0, react_1.useRef)(null);
    const [labels, setLabels] = (0, react_1.useState)([]);
    const [octaveArray, setOctaveArray] = (0, react_1.useState)(['']);
    const bgSizeTrack = 100 / props.numMeasures;
    (0, react_1.useLayoutEffect)(() => {
        getOctaveArray();
    }, [props.soundDetails, props.sound]);
    (0, react_1.useEffect)(() => {
    });
    function sendNoteProps(keyPressed) {
        props.handleNotePlayed(keyPressed);
    }
    function getOctaveArray() {
        Object.keys(props.soundDetails).some((key) => {
            if (key === props.sound) {
                setOctaveArray(Object.keys(props.soundDetails[key]));
                return Object.keys(props.soundDetails[key]);
            }
            else {
                return [];
            }
        });
    }
    function trackPosition() {
        const position = { left: `${8 + props.time / props.midiLength * 92}%` };
        return (0, jsx_runtime_1.jsx)("div", { id: 'track-position', className: 'keyboard', style: position });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)(NoteLabels, { octaveArray: octaveArray, octave: props.octave, labelsRef: props.labelsRef, handleNotePlayed: sendNoteProps }), trackPosition(), (0, jsx_runtime_1.jsxs)("div", { id: 'midi-track', ref: gridRef, style: { backgroundSize: bgSizeTrack + '%' }, children: [(0, jsx_runtime_1.jsx)(MidiNotes_1.default, { gridRef: gridRef }), (0, jsx_runtime_1.jsx)(Grid_1.default, { octaveArray: octaveArray, numMeasures: props.numMeasures, subdiv: props.subdiv })] })] }) }));
}
exports.default = PianoRoll;
