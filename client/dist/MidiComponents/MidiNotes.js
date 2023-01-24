"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
require("./MidiNotes.css");
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
function MidiNotes(props) {
    const [widths, setWidths] = (0, react_1.useState)({});
    const [midiNotes, setMidiNotes] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // console.warn(widths)
    }, [widths]);
    (0, react_1.useEffect)(() => {
        // console.log(props.midiNoteInfo)
    }, [props.midiNoteInfo]);
    (0, react_1.useLayoutEffect)(() => {
        setWidths((widths) => {
            let state = {};
            // Object.keys(state).forEach((key) => {
            //   if(!props.midiNoteInfo.find((exists) => Object.keys(exists)[0] === key)) {
            //     delete state[key];
            //   }
            // });
            props.midiNoteInfo.forEach((midiNote) => {
                let noteStart = Object.keys(midiNote)[0];
                let start = midiNote[noteStart].keyPressed.start;
                let end = midiNote[noteStart].keyPressed.end;
                if (midiNote[noteStart].keyPressed.start >= 0) {
                    // console.log({start: start, end: end})
                    state[noteStart] = { start: start, end: end };
                    // console.log(noteStart, state[noteStart])
                }
            });
            return state;
        });
    }, [props.pulseNum, props.midiNoteInfo, props.gridSize]);
    (0, react_1.useLayoutEffect)(() => {
        setMidiNotes([]);
        function renderPortals() {
            const noteTrackChilds = {};
            const midiNotesArr = [];
            props.midiNoteInfo.forEach((noteStart) => {
                let key = Object.keys(noteStart)[0];
                if (Object.keys(widths).includes(key)) {
                    let left = widths[key].start / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth + 1;
                    let width = (widths[key].end - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth;
                    if (widths[key].end === -1) {
                        width = (props.pulseNum - widths[key].start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth;
                    }
                    var elem = (0, react_1.createElement)('span', { ...noteStart[key].props, key: noteStart[key].key, style: {
                            height: '23.5px',
                            left: `${left}px`,
                            width: `${width}px`,
                        } });
                    if (!noteTrackChilds[noteStart[key].noteTrackId]) {
                        noteTrackChilds[noteStart[key].noteTrackId] = [];
                    }
                    noteTrackChilds[noteStart[key].noteTrackId].push(elem);
                }
            });
            Object.keys(noteTrackChilds).forEach((noteTrackId) => {
                midiNotesArr.push((0, react_dom_1.createPortal)(noteTrackChilds[noteTrackId], props.noteTracksRef.current.children.namedItem(noteTrackId)));
            });
            return midiNotesArr;
        }
        if (Object.keys(widths).length > 0) {
            // console.log(renderPortals())
            setMidiNotes(renderPortals());
        }
    }, [widths, props.pulseNum, props.gridSize]);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: midiNotes }));
}
exports.default = MidiNotes;
