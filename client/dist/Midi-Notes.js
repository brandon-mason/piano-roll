"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const qwertyNote = require('./note-to-qwerty-key');
function MidiNotes(props) {
    (0, react_1.useEffect)(() => {
        const mouseMove = (e) => {
            console.log(document.querySelectorAll(':hover'));
        };
        let grid = document.getElementById('midi-track');
        if (grid) {
            grid.addEventListener('mousemove', mouseMove);
        }
    }, [props.gridRef.current]);
    return (0, jsx_runtime_1.jsx)("span", { className: 'midi-note' });
}
exports.default = MidiNotes;
