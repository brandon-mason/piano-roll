"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function TimerButtons(props) {
    (0, react_1.useEffect)(() => {
        // console.log(props.metPlay)
    }, [props.metPlay]);
    const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
    const playingClassName = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
    const metronomeClassName = `metronome-button${props.metronome === 'on' ? ' active' : ''}`;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { type: 'button', className: 'stop-button', onClick: () => { props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard' }); setTimeout(() => props.midiDispatch({ type: 'mode', mode: 'keyboard' })); }, children: "\u25A0" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: recordingClassName, onClick: () => props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard' }), children: "\u25CF" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: playingClassName, onClick: () => props.midiDispatch({ type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard' }), children: "\u25B6" }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: metronomeClassName, onClick: () => { props.midiDispatch({ type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on' }); }, children: (props.metPlay) ? '○●' : '●○' })] }));
}
exports.default = TimerButtons;
