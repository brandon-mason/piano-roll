"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Piano-roll.css");
const note_to_qwerty_key_1 = require("./note-to-qwerty-key");
function BpmSlider() {
    const ref = (0, react_1.useRef)(null);
    var drag;
    // useEffect(() => {
    //   const changeBpm = (e) => {
    //     console.log(drag);
    //   }
    //   const element = ref.current;
    //   element.addEventListener('click', changeBpm);
    //   element.addEventListener('mousedown', () => drag = false);
    //   element.addEventListener('mousemove', () => drag = true);
    //   return() => {
    //     element.removeEventListener('click', changeBpm);
    //     element.removeEventListener('mousedown', () => drag = false);
    //     element.removeEventListener('mousemove', () => drag = true);
    //   }
    // });
    return (0, jsx_runtime_1.jsx)("div", { id: 'bpm-draggable', ref: ref });
    // return <input type='range' ref={ref} id='bpm-slider' name='bpm' min='1' max='300'/>
}
function Key(props) {
    const ref = (0, react_1.useRef)(null);
    let noteName;
    (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
    function handleClick() {
        props.onNotePlayed([props.qwertyKey]);
    }
    return ((0, jsx_runtime_1.jsx)("button", { type: 'button', ref: ref, id: noteName.toLowerCase() + props.octave + '-label', className: (props.note.length > 1) ? 'note-label accidental' : 'note-label natural', onClick: () => handleClick(), children: props.note }));
}
function Gridlet(props) {
    // const [active, setActive] = useState();
    const ref = (0, react_1.useRef)(null);
    // useEffect(() => {
    //   var element = ref.current;
    //   element.classList.toggle('note-' + props.subdiv);
    //   return () => {
    //     element.classList.toggle('note-' + props.subdiv)
    //   }
    // }, [props.subdiv]);
    function addNote() {
        var element = ref.current;
        element.classList.toggle('active');
        // setActive(active === true ? false : true);
    }
    return (
    // <button type='button' ref={ref} className={ 'midi-note ' + props.timeIndex + '-' + props.note } onClick={addNote}>
    (0, jsx_runtime_1.jsx)("button", { type: 'button', ref: ref, className: 'midi-note ' + props.note + props.octave + ' note-' + props.subdiv, onClick: addNote, children: props.note + props.timeIndex }));
}
function Grid(props) {
    const [midi, setMidi] = (0, react_1.useState)([]);
    const [labels, setLabels] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        let gridArr = [];
        let gridMidi = [];
        let gridLabels = [];
        for (var y = 11; y >= 0; y--) {
            gridLabels.push((0, jsx_runtime_1.jsx)(Key, { qwertyKey: note_to_qwerty_key_1.default[y].key, note: note_to_qwerty_key_1.default[y].note, altNote: note_to_qwerty_key_1.default[y].altNote, octave: props.octave, volume: 'mf', onNotePlayed: sendNoteProps }, note_to_qwerty_key_1.default[y].note));
            for (var x = 0; x < props.subdiv; x++) {
                gridMidi.push((0, jsx_runtime_1.jsx)(Gridlet, { timeIndex: x + 1, subdiv: props.subdiv, octave: props.octave, note: note_to_qwerty_key_1.default[y].note }, x + 1));
            }
            gridArr.push(gridMidi);
            gridMidi = [];
        }
        // console.log(gridArr)
        if (gridArr.length === 12) {
            setMidi(gridArr);
            setLabels(gridLabels);
            props.sendLabels((0, jsx_runtime_1.jsx)("div", { id: 'midi-grid-labels', children: gridLabels }));
        }
    }, [props.subdiv]);
    function sendNoteProps(qwertyKey) {
        props.onNotePlayed(qwertyKey);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)("div", { id: 'midi-note-labels', children: labels }), (0, jsx_runtime_1.jsxs)("div", { id: 'midi-grid', children: [(0, jsx_runtime_1.jsx)("div", { id: 'measure-1', className: 'midi-grid-measure', children: midi }), (0, jsx_runtime_1.jsx)("div", { id: 'measure-2', className: 'midi-grid-measure', children: midi }), (0, jsx_runtime_1.jsx)("div", { id: 'measure-3', className: 'midi-grid-measure', children: midi }), (0, jsx_runtime_1.jsx)("div", { id: 'measure-4', className: 'midi-grid-measure', children: midi })] })] }));
}
function PianoRoll(props) {
    const [subdiv, setSubdiv] = (0, react_1.useState)(8);
    const [labels, setLabels] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        console.log(props.subdiv);
    }, [props.subdiv]);
    const handleChangeSubdiv = (e) => {
        setSubdiv(parseInt(e.target.value));
    };
    function sendNoteProps(qwertyKey) {
        console.log(qwertyKey);
        props.onNotePlayed([qwertyKey]);
    }
    function renderLabels(noteLabels) {
        setLabels(noteLabels);
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(Grid, { subdiv: props.subdiv, octave: props.octave, onNotePlayed: sendNoteProps, sendLabels: renderLabels }) }));
}
exports.default = PianoRoll;
