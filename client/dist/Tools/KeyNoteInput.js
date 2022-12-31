"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [controller, setController] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        // console.error(props.pulseNum)
    }, [props.pulseNum]);
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
                return;
            }
            ;
            const control = e.metaKey || e.ctrlKey;
            // console.log(e.key)
            if (Object.keys(kbControls).includes(e.key)) {
                e.preventDefault();
                props.onControlsPressed([e.key, control]);
            }
            if (!Object.keys(qwertyNote).includes(e.key)) {
                return;
            }
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = true;
            console.log(e.code);
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
                console.log(octave);
            }
            let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
            // console.warn('KEY DOWN')
            // console.warn(qwertyNote[key])
            // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: props.pulseNum + 1}}}));
            setController((controller) => ({ ...controller, [note + octave]: { ...controller[note + octave], ...{ key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1 } } }));
        };
        const onKeyUp = (e) => {
            if (!Object.keys(qwertyNote).includes(e.key))
                return;
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = false;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
            }
            // console.warn('KEY UP')
            let note = qwertyNote[e.key.toLowerCase()].note;
            if (props.pulseNum === 0) {
                setController((controller) => ({ ...controller, [note + octave]: { ...controller[note + octave], ...{ key: e.key.toLowerCase(), pressed: false, end: props.pulseNum } } }));
            }
            else {
                setController((controller) => ({ ...controller, [note + octave]: { ...controller[note + octave], ...{ key: e.key.toLowerCase(), pressed: false, end: props.pulseNum } } }));
            }
        };
        const element = ref.current;
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [props.octave, props.pulseNum]);
    // useEffect(() => {
    // if(props.pianoRollKey) {
    //   if(props.pianoRollKey[2]) {
    //     console.warn('POINTER DOWN')
    //   } else if (props.pianoRollKey[2] === false) {
    //     console.warn('POINTER UP')
    //   }
    //   if(props.pianoRollKey.length > 0) {
    //     console.log(props.pianoRollKey)
    //     setController((controller) => ({...controller, [props.pianoRollKey![0]]: {octave: props.pianoRollKey![1], pressed: props.pianoRollKey![2], start: props.pulseNum, end: -1}}));
    //   }
    // }
    // }, [props.pianoRollKey]);
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
        // console.warn(controllers)
        // eslint-disable-next-line
    }, [controller]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("input", { type: 'text', ref: ref, autoComplete: 'off', id: 'key-note-input' }) }));
}
exports.default = KeyNoteInput;
