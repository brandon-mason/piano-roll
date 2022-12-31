"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
require("./MidiNotes.css");
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('./note-to-qwerty-key-obj');
function MidiNotes(props) {
    const [count, setCount] = (0, react_1.useState)(0);
    const [widths, setWidths] = (0, react_1.useState)({});
    const [midiNoteProps, setMidiNoteProps] = (0, react_1.useState)({});
    // const []
    (0, react_1.useEffect)(() => {
        Object.keys(props.keysPressed).forEach((noteOct) => {
            // setWidths()
            if (props.keysPressed[noteOct].start) {
                if (noteOct === 'E3')
                    console.log(noteOct, props.keysPressed[noteOct].start);
                if (props.keysPressed[noteOct].end === -1 && !widths[props.keysPressed[noteOct].start + noteOct]) {
                    console.error(props.keysPressed[noteOct].start);
                    if (noteOct === 'E3')
                        console.log('|||||||||||||||||||', noteOct, props.keysPressed[noteOct].start);
                    setWidths((widths) => ({ ...widths, [props.keysPressed[noteOct].start + noteOct]: { start: props.keysPressed[noteOct].start } }));
                }
                else {
                    setWidths((widths) => ({ ...widths, [props.keysPressed[noteOct].start + noteOct]: { start: props.keysPressed[noteOct].start, end: props.pulseNum } }));
                }
            }
        });
    }, [props.pulseNum, props.keysPressed]);
    (0, react_1.useEffect)(() => {
        console.warn(widths);
    }, [widths]);
    (0, react_1.useEffect)(() => {
        const addNoteBox = () => {
            let key;
            let octave;
            let countTemp = count;
            if (props.noteTracksRef.current) {
                Object.keys(props.keysPressed).forEach((noteOct) => {
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    // console.log(widths)
                    let noteStart = props.keysPressed[noteOct].start + noteOct;
                    // console.log(widths[noteStart].start)
                    if (props.keysPressed[noteOct].pressed && widths[noteStart].start !== undefined) {
                        // console.log(widths)
                        let width;
                        // console.error(widths)
                        if (widths[noteStart].end) {
                            width = widths[noteStart].end - widths[noteStart].start;
                        }
                        else {
                            width = props.pulseNum - widths[noteStart].start;
                            // console.log(props.pulseNum , widths[noteStart].start)
                        }
                        let noteTrackId = `${noteOct}-track`;
                        // console.error(width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current!.offsetWidth)
                        setMidiNoteProps((midiNoteProps) => ({ ...midiNoteProps, [props.keysPressed[noteOct].start + noteOct]: {
                                props: {
                                    key: noteTrackId + countTemp,
                                    className: 'midi-note',
                                    style: {
                                        height: `${props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 2}px`,
                                        left: `${.08 * window.innerWidth + (props.keysPressed[noteOct].start / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth}px`,
                                        width: `${width / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth}px`,
                                        // width: `10px`,
                                    }
                                },
                                keyPressed: props.keysPressed[noteOct],
                                noteTrackId: noteTrackId,
                                noteTracksRef: props.noteTracksRef,
                            } }));
                        countTemp++;
                    }
                });
            }
            setCount(countTemp);
        };
        // console.log(props.noteTracksRef.current?.children)
        if (props.noteTracksRef && props.midiState.mode === 'recording') {
            addNoteBox();
        }
        if (props.midiState.mode != 'recording') {
            // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
        }
        // console.warn(midiNotesArr, props.midiState.mode)
    }, [props.noteTracksRef, props.midiState.mode, widths]);
    // const items = midiNotesArr.map((items) => (<>{items}</>));
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: Object.keys(midiNoteProps).map((props) => {
            var elem = (0, react_1.createElement)('span', midiNoteProps[props].props);
            // console.log(elem)
            // console.log(midiNoteProps[props].noteTracksRef.current!.children.namedItem(midiNoteProps[props].noteTrackId))
            return (0, react_dom_1.createPortal)(elem, midiNoteProps[props].noteTracksRef.current.children.namedItem(midiNoteProps[props].noteTrackId));
        }) }));
}
exports.default = MidiNotes;
