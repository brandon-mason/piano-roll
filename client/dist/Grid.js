"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Grid.css");
const qwertyNote = require('./note-to-qwerty-key');
// interface NoteTrackProps {
//   key: string;
//   note: string;
//   octave: number;
//   subdiv: number;
// }
function NoteTrack(props) {
    return ((0, jsx_runtime_1.jsx)("div", { id: props.note + props.octave + '-measure ', className: 'note-measure' }));
}
// interface GridProps {
//   octaveArray: string[];
//   numMeasures: number;
//   subdiv: number;
// }
function Grid(props) {
    const [grid, setGrid] = (0, react_1.useState)();
    (0, react_1.useLayoutEffect)(() => {
        let gridMidi = [];
        let gridSubdivisions = [];
        let gridMeasure = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
                gridMeasure.push((0, jsx_runtime_1.jsx)("span", { id: `${qwertyNote[y].note}-track `, className: 'note-track' }, qwertyNote[y].note + props.octaveArray[x]));
            }
        }
        for (var i = 0; i < props.subdiv * props.numMeasures; i++) {
            if (i % props.subdiv === 0) {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision', style: { borderLeft: 'solid 3px rgb(114, 114, 114)' } }, i));
            }
            else {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision' }, i));
            }
        }
        if (gridMeasure.length === 12 * props.octaveArray.length) {
            var i = 0;
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { id: 'subdivs', style: { gridTemplateColumns: 'repeat(' + props.subdiv * props.numMeasures + ', auto)' }, children: gridSubdivisions }, 'subdivs'));
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { id: 'measures', style: { /*backgroundSize: bgSizeTrack / props.subdiv + '%'*/}, children: gridMeasure }, 'measures'));
            setGrid(gridMidi);
        }
    }, [props.subdiv, props.octaveArray, props.numMeasures]);
    const bgSizeTrack = 100 / props.numMeasures;
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: grid });
}
exports.default = Grid;
