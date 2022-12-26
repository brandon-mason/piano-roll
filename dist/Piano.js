"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const howler_1 = require("howler");
require("./Piano.css");
const qwertyNote = require('./note-to-qwerty-key');
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [controller, setController] = (0, react_1.useState)({});
    // useEffect(() => {
    //   console.log(props.octave)
    // }, [props.octave])
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                return;
            }
            let keyCode = e.key.toLowerCase(); // toLowerCase() is for caps lock
            setController((controller) => ({ ...controller, [keyCode]: { octave: props.octave, pressed: true } }));
        };
        const onKeyUp = (e) => {
            let keyCode = e.key.toLowerCase();
            setController((controller) => ({ ...controller, [keyCode]: { octave: props.octave, pressed: false } }));
        };
        const element = ref.current;
        element.addEventListener('keydown', onKeyDown);
        element.addEventListener('keyup', onKeyUp);
        return () => {
            element.removeEventListener('keydown', onKeyDown);
            element.removeEventListener('keyup', onKeyUp);
        };
    }, [props.octave]);
    (0, react_1.useEffect)(() => {
        const element = ref.current;
        element.focus();
        element.addEventListener('focusout', () => { element.focus(); });
        return () => {
            element.removeEventListener('focusout', () => { element.focus(); });
        };
    }, []);
    // const [time, setTime] = useState(Date.now());
    //THIS CAN POSSIBLY BE SIMPLIFIED!!!
    (0, react_1.useEffect)(() => {
        props.onNotePlayed(controller);
        // eslint-disable-next-line
    }, [controller]);
    return ((0, jsx_runtime_1.jsx)("input", { type: 'text', ref: ref, id: 'key-note-input' }));
}
function Piano(props) {
    // const [fetchedOctaves, setFetchedOctaves] = useState([]);
    const [fetchedOctaves, setFetchedOctaves] = (0, react_1.useState)({});
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [currentOctave, setCurrentOctave] = (0, react_1.useState)({});
    const [prevNotes, setPrevNotes] = (0, react_1.useState)({});
    const [octaveMinMax, setOctaveMinMax] = (0, react_1.useState)([0, 0]);
    // useEffect(() => {
    //   console.log(props.octave)
    // }, [props.octave])
    (0, react_1.useEffect)(() => {
        function fetchSounds() {
            let octave0;
            let octave1;
            let octaveExists0 = true;
            let octaveExists1 = true;
            // console.log(octaveMinMax)
            // let octaveMin = octaveBounds()[0];
            // let octaveMax = octaveBounds()[1];
            let url0 = 'http://localhost:3001/sounds/' + props.sound + '/' + props.octave + '/' + props.volume;
            let url1 = 'http://localhost:3001/sounds/' + props.sound + '/' + (props.octave + 1) + '/' + props.volume;
            if (props.octave < octaveMinMax[0]) {
                octaveExists0 = false;
                octave0 = new howler_1.Howl({ src: '' });
            }
            if (props.octave + 1 > octaveMinMax[1]) {
                octaveExists1 = false;
                octave1 = new howler_1.Howl({ src: '' });
            }
            if (octaveExists0 || octaveExists1) {
                if (fetchedOctaves[props.volume]) {
                    Object.keys(fetchedOctaves[props.volume]).some((key) => {
                        var octave = fetchedOctaves[props.volume][key];
                        if (!octave) {
                            return false;
                        }
                        else if (octave._src === url0 + '.webm' || octave._src === url0 + '.mp3') {
                            octave0 = octave;
                        }
                        else if (octave._src === url1 || octave._src === url1 + '.webm') {
                            octave1 = octave;
                        }
                        return octave0 !== undefined && octave1 !== undefined;
                    });
                }
                // else {
                //   // fetchedOctaves[props.volume] = {};
                //   setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave]: {}}));
                // }
                if (octaveExists0) {
                    octave0 = new howler_1.Howl({
                        src: [url0 + '.webm', url0 + '.mp3'],
                        sprite: {
                            C: [0, 4999],
                            'C#': [5000, 4999],
                            D: [10000, 4999],
                            Eb: [15000, 4999],
                            E: [20000, 4999],
                            F: [25000, 4999],
                            'F#': [30000, 4999],
                            G: [35000, 4999],
                            'G#': [40000, 4999],
                            A: [45000, 4999],
                            Bb: [50000, 4999],
                            B: [55000, 5000],
                        },
                    });
                    // fetchedOctavesTemp[props.volume] = [];
                    // fetchedOctavesTemp[props.volume][props.octave] = octave0;
                    // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave]: {[props.volume]: octave0}}));
                }
                if (octaveExists1) {
                    octave1 = new howler_1.Howl({
                        src: [url1 + '.webm', url1 + '.mp3'],
                        sprite: {
                            C: [0, 4999],
                            'C#': [5000, 4999],
                            D: [10000, 4999],
                            Eb: [15000, 4999],
                            E: [20000, 4999],
                            F: [25000, 4999],
                            'F#': [30000, 4999],
                            G: [35000, 4999],
                            'G#': [40000, 4999],
                            A: [45000, 4999],
                            Bb: [50000, 4999],
                            B: [55000, 5000],
                        },
                    });
                    // fetchedOctavesTemp[props.volume][props.octave + 1] = octave1;
                    // console.log(fetchedOctavesTemp);
                    // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.octave + 1]: {[props.volume]: octave1}}));
                }
            }
            setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.octave]: { [props.volume]: octave0 } }));
            setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.octave + 1]: { [props.volume]: octave1 } }));
            // return [octave0, octave1];
        }
        // console.log(fetchSounds())
        if (octaveMinMax.length === 2) {
            fetchSounds();
            setCurrentOctave(fetchedOctaves);
        }
    }, [props.sound, props.octave, props.volume, octaveMinMax]);
    (0, react_1.useEffect)(() => {
        if (props.pianoRollNotes.length > 0) {
            let octave;
            let octaveFetched = false;
            let url = 'http://localhost:3001/sounds/' + props.sound + '/' + props.pianoRollNotes[1] + '/' + props.volume;
            if (fetchedOctaves[props.volume]) {
                Object.keys(fetchedOctaves[props.pianoRollNotes[1]]).some((key) => {
                    octave = fetchedOctaves[props.pianoRollNotes[1]][key];
                    if (octave._src === url + '.webm' || octave._src === url + '.mp3') {
                        octaveFetched = true;
                    }
                    return octaveFetched;
                });
            }
            // else {
            //   fetchedOctaves[props.volume as keyof typeof fetchedOctaves] = {};
            // }
            if (!octaveFetched) {
                octave = new howler_1.Howl({
                    src: [url + '.webm', url + 'mp3'],
                    sprite: {
                        C: [0, 4999],
                        'C#': [5000, 4999],
                        D: [10000, 4999],
                        Eb: [15000, 4999],
                        E: [20000, 4999],
                        F: [25000, 4999],
                        'F#': [30000, 4999],
                        G: [35000, 4999],
                        'G#': [40000, 4999],
                        A: [45000, 4999],
                        Bb: [50000, 4999],
                        B: [55000, 5000],
                    },
                });
                // setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.volume]: {...fetchedOctaves[props.volume], [props.pianoRollNotes[1]]: octave}}));
            }
            setFetchedOctaves((fetchedOctaves) => ({ ...fetchedOctaves, [props.pianoRollNotes[1]]: { [props.volume]: octave } }));
            setKeysPressed((keysPressed) => ({ ...keysPressed, [props.pianoRollNotes[0]]: { octave: props.pianoRollNotes[1], pressed: props.pianoRollNotes[2] } }));
            // octave.play(props.pianoRollNotes[0]);
        }
    }, [props.pianoRollNotes]);
    (0, react_1.useEffect)(() => {
    }, [fetchedOctaves]);
    (0, react_1.useEffect)(() => {
        // function playNote() {
        //   keysPressed.forEach((key) => {
        //     currentOctave[key].play();
        //   })
        // }
        function playNote() {
            // console.log(props.octave)
            let note;
            let octave;
            let noteName;
            let id;
            const prevNotesTemp = prevNotes;
            // const currOctave = currentOctave;
            // console.log(keysPressed)
            // let notes = ['a', 'd', 'g'];
            // console.log(prevNotes);
            Object.keys(keysPressed).forEach((key) => {
                // notes.forEach((key) => {
                qwertyNote.forEach((qwerty) => {
                    note = qwerty.note;
                    octave = qwerty.octave;
                    // if(qwerty.key === key && currentOctave[octave] && keysPressed[key].pressed && !prevNotes[note + octave]) {
                    //   id = currentOctave[octave].play(note);
                    //   prevNotesTemp[note + octave] = id;
                    //   return true;
                    // } else if(qwerty.key === key && currentOctave[octave] && !keysPressed[key].pressed && prevNotes[note + octave]) {
                    //   Object.keys(prevNotes).some((playedNote) => {
                    //     if(playedNote === note + octave) {
                    //       currentOctave[octave].fade(1, 0, 300, prevNotes[note + octave]);
                    //     }
                    //   });
                    //   prevNotesTemp[note + octave] = null;
                    //   return true;
                    // }
                    if (qwerty.key === key) {
                        let labelElem = document.getElementById(noteName.toLowerCase() + (keysPressed[key].octave + octave) + '-label');
                        if (fetchedOctaves[keysPressed[key].octave][props.volume] && keysPressed[key].pressed && !prevNotes[note + octave]) {
                            (note.includes('#')) ? noteName = note.replace('#', 'sharp') : noteName = note.replace('b', 'flat');
                            id = fetchedOctaves[keysPressed[key].octave][props.volume].play(note);
                            // prevNotesTemp[note + octave] = id;
                            setPrevNotes((prevNotes) => ({ ...prevNotes, [note + octave]: id }));
                            labelElem.classList.toggle('active');
                            return true;
                        }
                        else if (fetchedOctaves[keysPressed[key].octave][props.volume] && !keysPressed[key].pressed && prevNotes[note + octave]) {
                            (note.includes('#')) ? noteName = note.replace('#', 'sharp') : noteName = note.replace('b', 'flat');
                            labelElem.classList.toggle('active');
                            Object.keys(prevNotes).some((playedNote) => {
                                if (playedNote === note + octave) {
                                    fetchedOctaves[keysPressed[key].octave][props.volume].fade(1, 0, 300, prevNotes[note + octave]);
                                }
                            });
                            // prevNotesTemp[note + octave] = {};
                            setPrevNotes((prevNotes) => ({ ...prevNotes, [note + octave]: 0 }));
                            return true;
                        }
                    }
                });
            });
            setPrevNotes(prevNotesTemp);
        }
        // console.log(keysPressed)
        if (Object.keys(keysPressed).length !== 0) {
            playNote();
            // setKeysPressed({});
        }
    }, [keysPressed]);
    (0, react_1.useEffect)(() => {
        // console.log(Object.keys(props.soundDetails).length)
        if (Object.keys(props.soundDetails).length > 0) {
            let octavesArray = Object.keys(props.soundDetails[props.sound]);
            let octaveNums = [];
            octavesArray.forEach((octave) => {
                octaveNums.push(parseInt(octave));
            });
            // console.log(Math.min(...octaveNums), Math.max(...octaveNums))
            let result = [Math.min(...octaveNums), Math.max(...octaveNums)];
            setOctaveMinMax(result);
        }
    }, [props.soundDetails]);
    function setNoteProps(controller) {
        // console.log('noteOctaves', controller)
        // noteOctaves.forEach((key) => {
        //   setKeysPressed((keysPressed) => [...keysPressed, key]);
        // });
        setKeysPressed(controller);
    }
    // let piano = qwertyNote.map((keyNote) => {
    //   return <Key key={keyNote.key} qwertyKey={keyNote.key} note={keyNote.note} altNote={keyNote.altNote} octave={keyNote.octave} volume='mf' onNotePlayed={setNoteProps} />
    // });
    // piano.push(<KeyNoteInputField key='KeyNoteInputField' onNotePlayed={setNoteProps} />);
    // return piano;
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(KeyNoteInput, { octave: props.octave, keysPressed: keysPressed, onNotePlayed: setNoteProps }, 'KeyNoteInput') }));
}
exports.default = Piano;
