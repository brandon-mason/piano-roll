"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import  {DraggableNumber} from './libs/draggable-number'
require("./settings.css");
function BpmSlider(props) {
    const [rendered, setRendered] = (0, react_1.useState)(0);
    const ref = (0, react_1.useRef)(null);
    return (0, jsx_runtime_1.jsx)("input", { ref: ref, className: "bpm-input", defaultValue: props.bpm, onChange: (e) => props.midiDispatch({ type: 'bpm', bpm: parseInt(e.target.value) }) });
}
// interface MidiSettingsProps {
//   soundDetails: Object;
//   numMeasures: number;
//   subdiv: number;
//   bpm: number;
//   mode: string;
//   midiDispatch: Function;
// }
function MidiSettings(props) {
    function renderNumMeasures() {
        var measureOpts = [];
        for (var i = 1; i < 9; i++) {
            measureOpts.push((0, jsx_runtime_1.jsx)("option", { value: i, children: i }, i));
        }
        return measureOpts;
    }
    const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
    const playingClassName = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(BpmSlider, { bpm: props.bpm, midiDispatch: props.midiDispatch }), (0, jsx_runtime_1.jsx)("select", { name: 'num-measures', id: 'measure-amt-selector', value: props.numMeasures, onChange: (e) => { props.midiDispatch({ type: 'numMeasures', numMeasures: e.target.value }); }, children: renderNumMeasures() }), (0, jsx_runtime_1.jsxs)("select", { name: 'subdiv', id: 'subdiv-selector', value: props.subdiv, onChange: (e) => { props.midiDispatch({ type: 'subdiv', subdiv: parseInt(e.target.value) }); }, children: [(0, jsx_runtime_1.jsx)("option", { value: '1', children: "1" }), (0, jsx_runtime_1.jsx)("option", { value: '2', children: "1/2" }), (0, jsx_runtime_1.jsx)("option", { value: '4', children: "1/4" }), (0, jsx_runtime_1.jsx)("option", { value: '8', children: "1/8" }), (0, jsx_runtime_1.jsx)("option", { value: '16', children: "1/16" }), (0, jsx_runtime_1.jsx)("option", { value: '32', children: "1/32" })] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'stop-button', onClick: () => { props.midiDispatch({ type: 'mode', mode: 'stop' }); }, children: "\u25A0" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: recordingClassName, onClick: () => { props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard' }); }, children: "\u25CF" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: playingClassName, onClick: () => { props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard' }); }, children: "\u25B6" })] }));
}
exports.default = MidiSettings;
