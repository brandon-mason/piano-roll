"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Grid.css");
const qwertyNote = require('../Tools/note-to-qwerty-key');
function Grid(props) {
    const [grid, setGrid] = (0, react_1.useState)();
    const gridMeasure = (0, react_1.useMemo)(() => {
        let gridMeasure = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
                gridMeasure.push((0, jsx_runtime_1.jsx)("div", { id: `${qwertyNote[y].note + props.octaveArray[x]}-track`, className: 'note-track' }, qwertyNote[y].note + props.octaveArray[x]));
            }
        }
        return gridMeasure;
    }, [props.subdiv, props.octaveArray]);
    const gridSubdivisions = (0, react_1.useMemo)(() => {
        let gridSubdivisions = [];
        for (var i = 0; i < props.subdiv * props.numMeasures; i++) {
            if (i % props.subdiv === 0) {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision', style: { borderLeft: 'solid 3px rgb(114, 114, 114)' } }, i));
            }
            else {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision' }, i));
            }
        }
        return gridSubdivisions;
    }, [props.subdiv, props.octaveArray, props.numMeasures]);
    (0, react_1.useLayoutEffect)(() => {
        let gridMidi = [];
        // let gridSubdivisions = [];
        // let gridMeasure = [];
        // for(var x = props.octaveArray.length - 1; x >= 0; x--) {
        //   for(var y = 11; y >= 0; y--) {
        //     // gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={parseInt(props.octaveArray[x])} subdiv={props.subdiv} />);
        //     gridMeasure.push(<div key={qwertyNote[y].note + props.octaveArray[x]} id={`${qwertyNote[y].note + props.octaveArray[x]}-track`} className='note-track'></div>);
        //   }
        // }
        // for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
        //   if(i % props.subdiv === 0) {
        //     gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px rgb(114, 114, 114)'}}></span>)
        //   } else {
        //     gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
        //   }
        // }
        if (gridMeasure.length === 12 * props.octaveArray.length) {
            var i = 0;
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { id: 'subdivs', style: { gridTemplateColumns: `repeat(${props.subdiv * props.numMeasures}, ${1000 / (props.numMeasures * props.subdiv) + props.gridSize[0]}px)` }, children: gridSubdivisions }, 'subdivs'));
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { ref: props.noteTracksRef, id: 'note-tracks', children: gridMeasure }, 'note-tracks'));
            setGrid(gridMidi);
        }
    }, [props.subdiv, props.octaveArray, props.numMeasures]);
    function trackPosition() {
        let position = {};
        if (props.noteTracksRef.current) {
            position = { left: `${(props.pulseNum / (props.midiLength * props.pulseRate)) * props.noteTracksRef.current.offsetWidth}px` };
        }
        else {
            position = { left: `${(6 + props.pulseNum / (props.midiLength * props.pulseRate) * 94)}%` };
        }
        return (0, jsx_runtime_1.jsx)("div", { id: 'track-position', className: 'keyboard', style: position });
    }
    const bgSizeTrack = 100 / props.numMeasures;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [trackPosition(), grid] }));
}
exports.default = Grid;
