"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// interface IQwertyNote {
//   key: string;
//   note: string;
//   altNote?: string,
//   octave: number;
// }
// interface KeyNoteInputProps {
//   octave: number;
//   onNotePlayed: Function;
//   pianoRollKey: any[] | null;
// }
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [controller, setController] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                return;
            }
            let octave = props.octave;
            let pressed = true;
            if (parseInt(e.code)) {
                octave = parseInt(e.code);
            }
            // console.warn('KEY DOWN')
            let key = e.key.toLowerCase(); // toLowerCase() is for caps lock
            setController((controller) => ({ ...controller, [key]: { octave: octave, pressed: true, time: 0 } }));
        };
        const onKeyUp = (e) => {
            let octave = props.octave;
            let pressed = false;
            if (parseInt(e.code)) {
                octave = parseInt(e.code);
            }
            // console.warn('KEY UP')
            let key = e.key.toLowerCase();
            setController((controller) => ({ ...controller, [key]: { octave: octave, pressed: false, time: 0 } }));
        };
        const element = ref.current;
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [props.octave]);
    (0, react_1.useEffect)(() => {
        if (props.pianoRollKey) {
            if (props.pianoRollKey[2]) {
                console.warn('POINTER DOWN');
            }
            else if (props.pianoRollKey[2] === false) {
                console.warn('POINTER UP');
            }
            if (props.pianoRollKey.length > 0) {
                console.log(props.pianoRollKey);
                setController((controller) => ({ ...controller, [props.pianoRollKey[0]]: { octave: props.pianoRollKey[1], pressed: props.pianoRollKey[2], time: 0 } }));
            }
        }
    }, [props.pianoRollKey]);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        element.focus();
        element.addEventListener('focusout', () => { element.focus(); });
        return () => {
            element.removeEventListener('focusout', () => { element.focus(); });
        };
    }, []);
    (0, react_1.useEffect)(() => {
        props.onNotePlayed(controller);
        // console.log(controller)
        // eslint-disable-next-line
    }, [controller]);
    return ((0, jsx_runtime_1.jsx)("input", { type: 'text', ref: ref, id: 'key-note-input' }));
}
exports.default = KeyNoteInput;
