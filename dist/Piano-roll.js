"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./Piano-roll.css");
const qwertyNote = require('./note-to-qwerty-key');
function Key(props) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const onPointerDown = (e) => {
            // if(e.repeat) {return;}
            props.onNotePlayed([props.qwertyKey, props.octave, true]);
        };
        const onPointerUp = (e) => {
            props.onNotePlayed([props.qwertyKey, props.octave, false]);
        };
        const element = ref.current;
        element.addEventListener('pointerdown', onPointerDown);
        element.addEventListener('pointerup', onPointerUp);
        return () => {
            element.removeEventListener('pointerdown', onPointerDown);
            element.removeEventListener('pointerup', onPointerUp);
        };
    });
    let noteName;
    (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
    function handleClick() {
        props.onNotePlayed([props.note, props.octave]);
    }
    return ((0, jsx_runtime_1.jsxs)("button", { type: 'button', ref: ref, id: noteName.toLowerCase() + props.octave + '-label', className: (props.note.length > 1) ? 'note-label accidental' : 'note-label natural', children: [" ", props.note + props.octave] }));
}
function NoteTrack(props) {
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
        const element = ref.current;
        element.classList.toggle('active');
        // setActive(active === true ? false : true);
    }
    return (
    // <button type='button' ref={ref} className={ 'midi-note ' + props.timeIndex + '-' + props.note } onClick={addNote}>
    // <button type='button' ref={ref} className={'midi-note ' + props.note + props.octave + ' note-' + props.subdiv} onClick={addNote}>
    //     {props.note + props.octave}
    // </button>
    (0, jsx_runtime_1.jsx)("div", { id: props.note + props.octave + '-measure ', className: 'note-measure' }));
}
function NoteLabels(props) {
    const [labels, setLabels] = (0, react_1.useState)();
    (0, react_1.useEffect)(() => {
        var element = document.getElementById('g' + props.octave + '-label');
        if (element) {
            element.scrollIntoView({ block: 'center' });
        }
    }, [props.octave, labels]);
    (0, react_1.useLayoutEffect)(() => {
        // console.log(props.octave)
        let gridLabels = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                // console.log(props.octaveArray[x]);
                gridLabels.push((0, jsx_runtime_1.jsx)(Key, { qwertyKey: qwertyNote[y].key, note: qwertyNote[y].note, altNote: qwertyNote[y].altNote, octave: props.octaveArray[x], onNotePlayed: sendNoteProps }, qwertyNote[y].note + props.octaveArray[x]));
            }
        }
        // console.log(gridLabels)
        if (gridLabels.length === 12 * props.octaveArray.length) {
            setLabels(gridLabels);
            // props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
        }
    }, [props.octaveArray]);
    function sendNoteProps(qwertyKey) {
        props.onNotePlayed(qwertyKey);
    }
    return (0, jsx_runtime_1.jsx)("div", { id: 'midi-note-labels', children: labels });
}
function Grid(props) {
    const [grid, setGrid] = (0, react_1.useState)();
    // const [labels, setLabels] = useState([]);
    // useEffect(() => {
    //   var element = document.getElementById('g' + props.octave + '-label');
    //   if(element) {
    //     element.scrollIntoView({block: 'center'});
    //   }
    // }, [props.octave, labels]);
    (0, react_1.useLayoutEffect)(() => {
        // console.log(props.octave)
        let gridMidi = [];
        let gridSubdivisions = [];
        let gridMeasure = [];
        for (var x = props.octaveArray.length - 1; x >= 0; x--) {
            for (var y = 11; y >= 0; y--) {
                // console.log(props.octaveArray[x]);
                // gridLabels.push(<Key key={qwertyNote[y].note + props.octaveArray[x]} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={props.octaveArray[x]} volume={props.volume} onNotePlayed={sendNoteProps} />)
                gridMeasure.push((0, jsx_runtime_1.jsx)(NoteTrack, { note: qwertyNote[y].note, octave: props.octaveArray[x], subdiv: props.subdiv }, qwertyNote[y].note + props.octaveArray[x]));
            }
        }
        for (var i = 0; i < props.subdiv * props.numMeasures; i++) {
            if (i % props.subdiv === 0) {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision', style: { borderLeft: 'solid 3px' } }, i));
            }
            else {
                gridSubdivisions.push((0, jsx_runtime_1.jsx)("span", { id: 'subdiv-' + (i + 1), className: 'subdivision' }, i));
            }
        }
        // console.log(gridLabels)
        if (gridMeasure.length === 12 * props.octaveArray.length) {
            var i = 0;
            // for(var i = 0; i < props.numMeasures; i++) {
            // gridMidi.push(<div key={'measure-' + (i + 1)} id={'measure-' + (i + 1)} className='midi-grid-measure' style={{backgroundSize: bgSize + '% 1px'}}>{gridMeasure}</div>);
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { id: 'subdivs', style: { gridTemplateColumns: 'repeat(' + props.subdiv * props.numMeasures + ', auto)' }, children: gridSubdivisions }, 'subdivs'));
            gridMidi.push((0, jsx_runtime_1.jsx)("div", { id: 'measures', style: { /*backgroundSize: bgSizeTrack / props.subdiv + '%'*/}, children: gridMeasure }, 'measures'));
            // }
            setGrid(gridMidi);
            // setLabels(gridLabels)
            // props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
        }
    }, [props.subdiv, props.octaveArray, props.numMeasures]);
    // function sendNoteProps(qwertyKey) {
    //   props.onNotePlayed(qwertyKey);
    // }
    // const bgSizeMeasures = parseInt(100 / (props.numMeasures * props.subdiv));
    const bgSizeTrack = 100 / props.numMeasures;
    // const bgSizeMeasures = bgSizeTrack / props.subdiv;
    // const bgSize = (100);
    // const gridTemp = {gridTemplate: '100% / repeat(' + props.numMeasures + ', auto)'};
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: grid });
    // return (
    // <div id='midi'>
    //   <div id='midi-note-labels'>{labels}</div>
    //   {/* <div id='midi-grid' style={gridTemp}>{grid}</div> */}
    //   <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>{grid}</div>
    // </div>
    // <div id='midi'>
    //   <div id='midi-note-labels'>{labels}</div>
    //   {/* <div id='midi-grid' style={gridTemp}>{grid}</div> */}
    // <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>{grid}</div>
    // </div>
    // );
}
function TimeTracker() {
}
function PianoRoll(props) {
    const ref = (0, react_1.useRef)(null);
    const [labels, setLabels] = (0, react_1.useState)([]);
    const [octaveArray, setOctaveArray] = (0, react_1.useState)(['']);
    const bgSizeTrack = 100 / props.numMeasures;
    // useEffect(() => {
    //   var element = document.getElementById('c' + props.octave + '-label');
    //   console.log(props.octave)
    //   if(element) {
    //     console.log(element, 'c' + props.octave + '-label');
    //     element.scrollIntoView(true);
    //   }
    // }, [props.octave]);
    (0, react_1.useLayoutEffect)(() => {
        // console.log(props.octave)
        // setOctaveCount(getOctaveCount());
        // getSoundDetails();
        // console.log(props.soundDetails)
        getOctaveArray();
    }, [props.soundDetails, props.sound]);
    (0, react_1.useEffect)(() => {
    });
    function sendNoteProps(qwertyKey) {
        // console.log(qwertyKey)
        props.onNotePlayed(qwertyKey);
    }
    // function renderLabels(noteLabels) {
    //   setLabels(noteLabels);
    // }
    function getOctaveArray() {
        Object.keys(props.soundDetails).some((key) => {
            if (key === props.sound) {
                // console.log(Object.keys(props.soundDetails[key]))
                setOctaveArray(Object.keys(props.soundDetails[key]));
                return Object.keys(props.soundDetails[key]);
            }
            else {
                return [];
            }
        });
    }
    function trackPosition() {
        const position = { left: `${8 + props.time / props.midiLength * 100}%` };
        return (0, jsx_runtime_1.jsx)("div", { id: 'track-position', style: position });
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { id: 'midi', children: [(0, jsx_runtime_1.jsx)(NoteLabels, { octaveArray: octaveArray, octave: props.octave, onNotePlayed: sendNoteProps }), trackPosition(), (0, jsx_runtime_1.jsx)("div", { id: 'midi-track', style: { backgroundSize: bgSizeTrack + '%' }, children: (0, jsx_runtime_1.jsx)(Grid, { octaveArray: octaveArray, numMeasures: props.numMeasures, subdiv: props.subdiv }) })] }) }));
}
exports.default = PianoRoll;
