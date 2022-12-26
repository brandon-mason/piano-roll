"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import  {DraggableNumber} from './libs/draggable-number'
require("./settings.css");
function BpmSlider(props) {
    const [rendered, setRendered] = (0, react_1.useState)(0);
    const ref = (0, react_1.useRef)(null);
    // useEffect(() => { 
    //   const el = ref.current;
    //   if(el && rendered === 0) {
    //     console.log('h', rendered, el)
    //     new DraggableNumber(el, {
    //         min: 1,
    //         max: 999,
    //         changeCallback: function(val) {console.log("on change: " + val);},
    //         endCallback: function(val) {console.log("on end: " + val);}
    //     });
    //     setRendered(1);
    //   }
    // }, [ref.current]);
    return (0, jsx_runtime_1.jsx)("input", { ref: ref, className: "bpm-input", defaultValue: props.bpm, onChange: (e) => props.midiDispatch({ type: 'bpm', bpm: parseInt(e.target.value) }) });
}
function MidiSettings(props) {
    function renderNumMeasures() {
        var measureOpts = [];
        for (var i = 1; i < 9; i++) {
            measureOpts.push((0, jsx_runtime_1.jsx)("option", { value: i, children: i }, i));
        }
        return measureOpts;
    }
    const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(BpmSlider, { bpm: props.bpm, midiDispatch: props.midiDispatch }), (0, jsx_runtime_1.jsx)("select", { name: 'num-measures', id: 'measure-amt-selector', value: props.numMeasures, onChange: (e) => { props.midiDispatch({ type: 'numMeasures', numMeasures: e.target.value }); }, children: renderNumMeasures() }), (0, jsx_runtime_1.jsxs)("select", { name: 'subdiv', id: 'subdiv-selector', value: props.subdiv, onChange: (e) => { props.midiDispatch({ type: 'subdiv', subdiv: parseInt(e.target.value) }); }, children: [(0, jsx_runtime_1.jsx)("option", { value: '1', children: "1" }), (0, jsx_runtime_1.jsx)("option", { value: '2', children: "1/2" }), (0, jsx_runtime_1.jsx)("option", { value: '4', children: "1/4" }), (0, jsx_runtime_1.jsx)("option", { value: '8', children: "1/8" }), (0, jsx_runtime_1.jsx)("option", { value: '16', children: "1/16" }), (0, jsx_runtime_1.jsx)("option", { value: '32', children: "1/32" })] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: recordingClassName, onClick: () => { props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard' }); }, children: "O" })] }));
}
exports.default = MidiSettings;
