"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
require("./MidiNotes.css");
// const myWorker = new Worker('./ToolComponents/midiNoteWorker')
const qwertyNote = require('./note-to-qwerty-key-obj');
function MidiNote(props) {
    const [midiNote, setMidiNote] = (0, react_1.useState)();
    const [date, setDate] = (0, react_1.useState)();
    const [style, setStyle] = (0, react_1.useState)({
        height: `${props.noteTracksRef.current.offsetHeight / props.noteTracksRef.current.children.length - 2}px`,
        left: `${(8 + 3 / props.noteTracksRef.current.offsetWidth * 100 + props.keyPressed.start / (props.midiLength * props.pulseRate) * 92)}%`,
        // width: `${(props.keyPressed.end! - props.keyPressed.start!) / props.noteTracksRef.current!.offsetWidth * props.midiLength / props.pulseRate}px`
    });
    const [width, setWidth] = (0, react_1.useState)(props.width);
    // if(window.Worker) {
    //   myWorker.onstart = () => {
    //   }
    // }
    (0, react_1.useEffect)(() => {
        console.log(props.pulseNum);
    }, [props.pulseNum]);
    // useLayoutEffect(() => {
    //   setStyle({
    //     height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
    //     left: `${(8 + 3 / props.noteTracksRef.current!.offsetWidth * 100 + props.keyPressed.start! / (props.midiLength / props.pulseRate) * 92)}%`,
    //     // width: `${(props.keyPressed.end! - props.keyPressed.start!) / props.noteTracksRef.current!.offsetWidth * props.midiLength / props.pulseRate}px`,
    //   })
    // }, [props.noteTracksRef.current!.offsetHeight, props.noteTracksRef.current!.offsetWidth, props.noteTracksRef.current!.children.length, props.keyPressed.end, props.midiLength, props.pulseRate])
    (0, react_1.useLayoutEffect)(() => {
        let count = width;
        // console.log(props.keyPressed.end === undefined)
        if (props.keyPressed.end !== undefined) {
            // console.log('hello')
            // console.log(style)
            // props.handleWidthInterval(date, width, props.noteTrackId + props.count, props.noteOct + props.keyPressed.start)
            // date.forEach((dat) => clearTimeout(dat))
            // props.handleWidthInterval(dete)
        }
        else {
            // console.log('hehe')
            let dete = setInterval(() => { });
            // console.warn('inter')
            console.log('width', width);
            count = width;
            // console.error(count)
            if (props.noteTracksRef.current)
                count += (props.pulseNum - props.keyPressed.start) / (props.midiLength * props.pulseRate) * props.noteTracksRef.current.offsetWidth;
            // console.log(`${count}px`)
            console.log('count', count);
            setStyle((style) => ({ ...style, ...{ width: `${count}px` } }));
            setWidth(count);
            // }, 1 / props.pulseRate)
            // console.log(!props.keyPressed.end);
            // console.error(dete);
            // props.handleWidthInterval(date)
            setDate(dete);
        }
        // }, [props.pulseNum, props.noteTracksRef.current!.offsetWidth, props.keyPressed.start, props.keyPressed.pressed === true, props.midiLength, props.pulseRate])
    }, [props.keyPressed.pressed, props.pulseNum]); //props.pulseNum
    (0, react_1.useEffect)(() => {
        props.handleWidthInterval(date, width, props.noteTrackId + props.count, props.noteOct + props.keyPressed.start);
    }, [props.keyPressed.pressed, width]);
    (0, react_1.useEffect)(() => {
        // let noteTrackId = `${qwertyNote['a'].note + 3}-track`;
        // console.error(props.keyPressed.end! , props.keyPressed.start! , (props.noteTracksRef.current!.offsetWidth , props.midiLength , props.pulseRate))
        // let noteStyle = {
        //   height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
        //   left: `${(8 + 3 / props.noteTracksRef.current!.offsetWidth * 100 + props.keyPressed.start! / (props.midiLength / props.pulseRate) * 92)}%`,
        //   width: `${(props.keyPressed.end! - props.keyPressed.start!) / props.noteTracksRef.current!.offsetWidth * props.midiLength / props.pulseRate}px`
        // };
        // let noteStyle = {
        //   height: `${props.noteTracksRef.current!.offsetHeight / props.noteTracksRef.current!.children.length - 2}px`,
        //   left: props.left,
        //   width: props.width,
        // };
        if (props.noteTracksRef.current) {
            // console.log(props.keyPressed)
            // console.log(props.noteTracksRef.current.children.namedItem(props.noteTrackId)!);
            // setMidiNote(createPortal(createElement('span', {className: 'midi-note', style: noteStyle}), props.noteTracksRef.current.children.namedItem(props.noteTrackId)!));
        }
    }, [props.keyPressed, props.pulseNum]);
    // console.log('ismaking');
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, react_dom_1.createPortal)((0, jsx_runtime_1.jsx)("span", { className: 'midi-note', style: style }), props.noteTracksRef.current.children.namedItem(props.noteTrackId)) }));
}
function MidiNotes(props) {
    const [midiNotes, setMidiNotes] = (0, react_1.useState)({});
    const [midiNotesArr, setMidiNotesArr] = (0, react_1.useState)([]);
    const [count, setCount] = (0, react_1.useState)(0);
    const [widths, setWidths] = (0, react_1.useState)({});
    // const []
    // useEffect(() => {
    //   console.log(props.pulseNum)
    // }, [props.pulseNum])
    (0, react_1.useLayoutEffect)(() => {
        let noteTrackId;
        let countTemp = count;
        let midiNotesArrTemp = midiNotesArr;
        let widthsTemp = structuredClone(widths);
        Object.keys(props.keysPressed).forEach((noteOct) => {
            noteTrackId = `${noteOct}-track`;
            // console.log(widths)
            if (props.keysPressed[noteOct].end && widths[noteOct + props.keysPressed[noteOct].start]) {
                // console.log(widths)
                midiNotesArr.forEach((midiNote) => {
                    if (midiNote.props.keyPressed.start === props.keysPressed[noteOct].start && midiNote.props.noteOct === noteOct) {
                        // console.log(widths)
                        midiNotesArrTemp[midiNotesArr.indexOf(midiNote)] = (0, jsx_runtime_1.jsx)(MidiNote, { count: countTemp, midiLength: props.midiLength, noteOct: noteOct, noteTrackId: noteTrackId, noteTracksRef: props.noteTracksRef, keyPressed: props.keysPressed[noteOct], pulseNum: props.pulseNum, pulseRate: props.pulseRate, width: widths[noteOct + props.keysPressed[noteOct].start].width, handleWidthInterval: clearWidthInterval }, noteTrackId + countTemp);
                        setMidiNotesArr(midiNotesArrTemp);
                        delete widthsTemp[noteOct + props.keysPressed[noteOct].start];
                        setWidths(widthsTemp);
                        // console.log('count',countTemp)
                        countTemp++;
                    }
                });
            }
        });
        setCount(countTemp);
    }, [props.keysPressed]);
    (0, react_1.useEffect)(() => {
        const addNoteBox = () => {
            let key;
            let octave;
            let countTemp = count;
            if (props.noteTracksRef.current) {
                Object.keys(props.keysPressed).forEach((noteOct) => {
                    // console.log(props.keysPressed[noteOct])
                    // key = noteOct.replace(/[0-9]/g, '');
                    octave = parseInt(noteOct.replace(/\D/g, ''));
                    // console.log('pressed', props.keysPressed[noteOct].pressed)
                    if (props.keysPressed[noteOct].pressed) { // i think i need a while loop for this condition but idk where
                        let noteTrackId = `${noteOct}-track`;
                        let width = `${(props.keysPressed[noteOct].end - props.keysPressed[noteOct].start) / props.noteTracksRef.current.offsetWidth * props.midiLength * props.pulseRate}px`;
                        let left = `${(8 + 3 / props.noteTracksRef.current.offsetWidth * 100 + props.keysPressed[noteOct].start / (props.midiLength * props.pulseRate) * 92)}%`;
                        // console.log(props.keysPressed)
                        // setMidiNotes((midiNotes) => ({...midiNotes, [noteTrackId + count]: <MidiNote key={noteTrackId + countTemp} midiLength={props.midiLength} noteTrackId={noteTrackId} noteTracksRef={props.noteTracksRef} keyPressed={props.keysPressed[noteOct]} pulseNum={props.pulseNum} pulseRate={props.pulseRate} handleWidthInterval={clearWidthInterval} />}))
                        // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
                        // console.log(props.keysPressed[noteOct])
                        setMidiNotesArr((midiNotesArr) => [...midiNotesArr, (0, jsx_runtime_1.jsx)(MidiNote, { count: countTemp, midiLength: props.midiLength, noteOct: noteOct, noteTrackId: noteTrackId, noteTracksRef: props.noteTracksRef, keyPressed: props.keysPressed[noteOct], pulseNum: props.pulseNum, pulseRate: props.pulseRate, width: 0, handleWidthInterval: clearWidthInterval }, noteTrackId + countTemp)]);
                        countTemp++;
                        // setMidiNotesArr(Object.keys(midiNotes).map((element) => midiNotes[element]));
                    }
                });
                // console.log(props.midiRecord)
                // noteTracks!.appendChild(note)
                // setMidiNotes(tempMidiNotes);
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
    }, [props.keysPressed, props.noteTracksRef, props.midiState.mode]);
    function clearWidthInterval(intervalId, width, noteTrackId, noteStart) {
        console.error(width);
        setWidths((widths) => ({ ...widths, [noteStart]: { noteTrackId: noteTrackId, width: width } }));
        clearInterval(intervalId);
    }
    // const items = midiNotesArr.map((items) => (<>{items}</>));
    return ((0, jsx_runtime_1.jsx)("div", { children: midiNotesArr }));
}
exports.default = MidiNotes;
