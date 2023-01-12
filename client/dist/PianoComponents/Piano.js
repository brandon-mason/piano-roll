"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const howler_1 = require("howler");
require("./Piano.css");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
// interface IQwertyNote {
//   key: string;
//   note: string;
//   altNote?: string,
//   octave: number;
// }
// interface OctavesInViewProps {
//   octaveMax: number;
//   labelsRef: React.RefObject<HTMLDivElement>;
//   octave: number;
//   handleViewChange: Function;
// }
function OctavesInView(props) {
    const [toFetch, setToFetch] = (0, react_1.useState)([]);
    const observer = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        let octavesInView = [];
        const buildThresholdArr = () => {
            let arr = [0];
            for (let i = 1; i < props.octaveMax + 1; i++) {
                let num = i / props.octaveMax;
                arr.push(Math[num < 0 ? 'ceil' : 'floor'](num * 100) / 100);
            }
            return arr;
        };
        const callback = (entries, observer) => {
            let toFetchTemp = [];
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // console.log(entry.target)
                    toFetchTemp.push(parseInt(entry.target.getAttribute('id').substring(0, 1)));
                }
            });
            setToFetch(toFetchTemp);
        };
        props.handleViewChange(toFetch);
        const options = { root: null, rootMargin: '0px', threshold: 0 };
        observer.current = new IntersectionObserver(callback, options);
    }, [props.octaveMax, toFetch]);
    (0, react_1.useEffect)(() => {
        let element = document.getElementById('midi');
        if (observer.current && props.labelsRef.current && props.labelsRef.current.children.length === props.octaveMax) {
            let children = props.labelsRef.current.children;
            for (let i = 0; i < children.length; i++) {
                observer.current.observe(children[i]);
            }
        }
        return (() => {
            if (observer.current)
                observer.current.disconnect();
        });
    }, [props.labelsRef, props.octaveMax]);
    (0, react_1.useEffect)(() => {
        props.handleViewChange([props.octave]);
    }, [props.octave]);
    return null;
}
function Piano(props) {
    const [fetchedSounds, setFetchedSounds] = (0, react_1.useState)({});
    const [prevNotes, setPrevNotes] = (0, react_1.useState)({});
    const [keysRecorded, setKeysRecorded] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        // setOutput(() => ({...props.keysPressed, ...props.playback}))
    }, [props.keysPressed, props.playback]);
    // useEffect(() => {
    //   setOutput((output) => ({...output, ...props.playback}))
    //   console.log(output)
    // }, [output])
    // useEffect(() => console.log(prevNotes), [prevNotes])
    // useEffect(() => {
    //   if(props.mode === 'stop' || props.mode === 'keyboard') {
    //     Object.keys(fetchedSounds).forEach((oct) => {
    //       Object.keys(fetchedSounds[oct]).forEach((vol) => {
    //         fetchedSounds[oct][vol].pause();
    //         // setTimeout(() => fetchedSounds[oct][vol].pause());
    //       })
    //     })
    //   }
    // }, [props.mode])
    //old way to get octaves using sound prop changes
    // useEffect(() => {
    //   function fetchSounds() {
    //     let octaveExists0 = true;
    //     let octaveExists1 = true;
    //     let url0 = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + props.octave + '/' + props.volume;
    //     let url1 = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + (props.octave + 1) + '/' + props.volume;
    //     if(props.octave < props.octaveMinMax[0] - 1) {
    //       octaveExists0 = false;
    //     }
    //     if(props.octave + 1 > props.octaveMinMax[1] - 1) {
    //       octaveExists1 = false;
    //     }
    //     if(octaveExists0 || octaveExists1) {
    //       if(fetchedSounds[props.octave as keyof typeof fetchedSounds]) {
    //         Object.keys(fetchedSounds[props.octave as keyof typeof fetchedSounds]).some((key) => {
    //           var octave: any = fetchedSounds[props.octave][key];
    //           if(!octave) {
    //             return false;
    //           } else if(octave._src === url0 + '.webm' || octave._src === url0 + '.mp3') {
    //             var octave0 = octave;
    //           } else if(octave._src === url1 || octave._src === url1 + '.webm') {
    //             var octave1 = octave;
    //           } 
    //           return octave0 !== undefined && octave1 !== undefined;
    //         });
    //       }
    //       if(octaveExists0) {
    //         var octave0 = new Howl({
    //           src: [url0 + '.webm', url0 + '.mp3'],
    //           sprite: {
    //             C: [0, 4999],
    //             'C#': [5000, 4999],
    //             D: [10000, 4999],
    //             Eb: [15000, 4999],
    //             E: [20000, 4999],
    //             F: [25000, 4999],
    //             'F#': [30000, 4999],
    //             G: [35000, 4999],
    //             'G#': [40000, 4999],
    //             A: [45000, 4999],
    //             Bb: [50000, 4999],
    //             B: [55000, 5000],
    //           },
    //           onplayerror: function() {
    //             octave0.once('unlock', function() {
    //               octave0.play();
    //             });
    //           }
    //         });
    //         setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [props.octave]: {[props.volume]: octave0}}));
    //       }
    //       if(octaveExists1) {
    //         var octave1 = new Howl({
    //           src: [url1 + '.webm', url1 + '.mp3'],
    //           sprite: {
    //             C: [0, 4999],
    //             'C#': [5000, 4999],
    //             D: [10000, 4999],
    //             Eb: [15000, 4999],
    //             E: [20000, 4999],
    //             F: [25000, 4999],
    //             'F#': [30000, 4999],
    //             G: [35000, 4999],
    //             'G#': [40000, 4999],
    //             A: [45000, 4999],
    //             Bb: [50000, 4999],
    //             B: [55000, 5000],
    //           },
    //         });
    //         setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [props.octave + 1]: {[props.volume]: octave1}}));
    //       }
    //     }
    //   }
    //   if(props.octaveMinMax.length === 2) {
    //     // fetchSounds();
    //   }
    // }, [props.sound, props.octave, props.volume]);
    // const [domLoaded, setDomLoaded] = useState(false);
    // const listenerCreated = React.useRef(false);
    //attempt to make sounds load on scroll
    // useEffect(() => {
    //   // const fetchedSoundsCopy = JSON.parse(JSON.stringify(fetchedSounds));
    //   const fetchedSoundsCopy = fetchedSounds;
    //   let element = document.getElementById('midi-note-labels');
    //   let octaveNotFetched = false;
    //   const inView = (rect: DOMRect) => {
    //     return (
    //       rect.top + rect.height >= 0 &&
    //       rect.bottom - rect.height <= (window.innerHeight || document.documentElement.clientHeight)
    //     );
    //   }
    //   const fetchOnScroll = (e: Event) => {
    //     console.log(e)
    //     if(element?.childElementCount === props.octaveMinMax[1]) {
    //       let children = element.children;
    //       for(let i = 0; i < children.length; i++) {
    //         let child = children[i];
    //         let rect = child.getBoundingClientRect();
    //         if(inView(rect)) {
    //           let octave = parseInt(children[i].getAttribute('id')!.substring(0, 1));
    //           let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + octave + '/' + props.volume;
    //           let fsKeys = Object.keys(fetchedSounds);
    //           if(fsKeys.length > 0) {
    //             fsKeys.some((key: any) => {
    //               if(key[props.volume as keyof typeof key]._src !== url + '.webm' || key[props.volume as keyof typeof key]._src !== url + '.mp3') {
    //                 octaveNotFetched = true;
    //               }
    //               if(octaveNotFetched) {
    //                 fetchedSoundsCopy[octave] = {[props.volume]: loadSound(url)};
    //                 console.log("loaded sound: ", fetchedSoundsCopy[octave]);
    //               }
    //             });
    //           } else {
    //             fetchedSoundsCopy[octave] = {[props.volume]: loadSound(url)}
    //             console.log("loaded sound: ", fetchedSoundsCopy[octave]);
    //           };
    //         }
    //       }
    //       setFetchedSounds(fetchedSoundsCopy);
    //     }
    //   }
    //   // if(element) window.addEventListener('scroll', fetchOnScroll);
    //   return (() => {
    //     // if(element) window.removeEventListener('scroll', fetchOnScroll);
    //   })
    // }, [props.octaveMinMax[1]])
    //old load sounds on click
    // useEffect(() => {
    //   if(props.pianoRollKey.length > 0) {
    //     let octaveSound: any;
    //     let octaveFetched = false;
    //     let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + props.pianoRollKey[1] + '/' + props.volume;
    //     if(fetchedSounds[props.pianoRollKey[1] as keyof typeof fetchedSounds]) {
    //       Object.keys(fetchedSounds[props.pianoRollKey[1] as keyof typeof fetchedSounds]).some((key) => {
    //         octaveSound = fetchedSounds[props.pianoRollKey[1] as keyof typeof fetchedSounds][key];
    //         if(octaveSound._src === url + '.webm' || octaveSound._src === url + '.mp3') {
    //           octaveFetched = true;
    //         }
    //         return octaveFetched;
    //       });
    //     }
    //     if(!octaveFetched) {
    //       octaveSound = new Howl({
    //         src: [url + '.webm', url + 'mp3'],
    //         sprite: {
    //           C: [0, 4999],
    //           'C#': [5000, 4999],
    //           D: [10000, 4999],
    //           Eb: [15000, 4999],
    //           E: [20000, 4999],
    //           F: [25000, 4999],
    //           'F#': [30000, 4999],
    //           G: [35000, 4999],
    //           'G#': [40000, 4999],
    //           A: [45000, 4999],
    //           Bb: [50000, 4999],
    //           B: [55000, 5000],
    //         },
    //       });
    //       // setFetchedOctaves((fetchedSounds) => ({...fetchedSounds, [props.pianoRollKey[1]]: {[props.volume]: octaveSound}}));
    //     }
    //   }
    // }, /*[props.pianoRollKey]*/);
    // attempt at getting rid of lag before button clicks
    // useEffect(() => {
    //   if(Object.keys(fetchedSounds).length > 0) {
    //     let sound1 = fetchedSounds[props.octave][props.volume];
    //     let id = sound1.play('C');
    //     sound1.stop(id);
    //   }
    // }, [fetchedSounds])
    (0, react_1.useEffect)(() => {
        // console.log(props.keysPressed, prevNotes)
        function playNote(output) {
            // console.log(output)
            // let key: string;
            let qwertyOctave;
            let noteName;
            const prevNotesTemp = prevNotes;
            Object.keys(output).forEach((noteOct) => {
                // console.error(output)
                let key = output[noteOct].key;
                let note = noteOct.replace(/[0-9]/g, '');
                let octave = parseInt(noteOct.replace(/\D/g, ''));
                Object.keys(qwertyNote).forEach((qwertyKey) => {
                    qwertyOctave = qwertyNote[qwertyKey].octave;
                    // console.log(octave)
                    if (octave < props.octaveMinMax[1]) {
                        if (qwertyKey === key && fetchedSounds[octave][props.volume]) {
                            // console.log(key, noteOct, octave, qwertyOctave);
                            (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
                            let labelElem = document.getElementById(noteName.toLowerCase() + '-label');
                            if (output[noteOct].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                                // console.log(noteOct, output[noteOct].pressed, output)
                                let sound = fetchedSounds[octave][props.volume];
                                let soundId = sound.play(note);
                                prevNotesTemp[noteName] = soundId;
                                labelElem.classList.toggle('active');
                            }
                            else if (!output[noteOct].pressed && prevNotes[noteName] > 0) {
                                // console.log(noteOct, output[noteOct].pressed, output)
                                labelElem.classList.toggle('active');
                                Object.keys(prevNotes).some((playedNote) => {
                                    if (playedNote === noteName) {
                                        fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                                    }
                                });
                                prevNotesTemp[noteName] = 0;
                            }
                        }
                    }
                });
            });
            setPrevNotes(prevNotesTemp);
        }
        // console.log(props.playback)
        if (props.mode === 'recording' || props.mode === 'playing') {
            let pbKp = { ...props.playback };
            // console.log(props.playback, keysRecorded)
            let state = [];
            Object.keys(props.keysPressed).forEach((noteOct) => {
                if (props.keysPressed[noteOct].pressed) {
                    // console.log("if")
                    pbKp = { ...pbKp, [noteOct]: props.keysPressed[noteOct] };
                    state.push(noteOct);
                }
                else if (keysRecorded.find((key) => key === noteOct)) {
                    // console.log('else if', [noteOct], props.keysPressed[noteOct])
                    pbKp = { ...pbKp, [noteOct]: props.keysPressed[noteOct] };
                    // console.log({...pbKp, [noteOct]: props.keysPressed[noteOct]})
                }
            });
            // console.log('pbKp', pbKp)
            playNote(pbKp);
            setKeysRecorded(state);
        }
        else if (props.mode === 'keyboard') {
            // console.error('KeysPressed', props.keysPressed)
            playNote(props.keysPressed);
        }
        // if(Object.keys(props.playback).length > 0) {
        //   // console.warn('Playback', props.playback)
        //   playNote(props.playback);
        // }
        // if(Object.keys(props.keysPressed).length > 0) {
        //   console.error('KeysPressed', props.keysPressed)
        //   playNote(props.keysPressed);
        // }
    }, [props.pulseNum, props.keysPressed, props.playback]);
    (0, react_1.useEffect)(() => {
    }, [props.sound, props.octave, props.volume]);
    function loadSound(url) {
        let octaveSound;
        octaveSound = new howler_1.Howl({
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
        return octaveSound;
    }
    function playNote(output) {
        // console.log(output)
        // let key: string;
        let qwertyOctave;
        let noteName;
        const prevNotesTemp = prevNotes;
        Object.keys(output).forEach((noteOct) => {
            // console.error(output)
            let key = output[noteOct].key;
            let note = noteOct.replace(/[0-9]/g, '');
            let octave = parseInt(noteOct.replace(/\D/g, ''));
            Object.keys(qwertyNote).forEach((qwertyKey) => {
                qwertyOctave = qwertyNote[qwertyKey].octave;
                // console.log(octave)
                if (octave < props.octaveMinMax[1]) {
                    if (qwertyKey === key && fetchedSounds[octave][props.volume]) {
                        // console.log(key, noteOct, octave, qwertyOctave);
                        (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
                        let labelElem = document.getElementById(noteName.toLowerCase() + '-label');
                        if (output[noteOct].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                            // console.log(noteOct, output[noteOct].pressed, output)
                            let sound = fetchedSounds[octave][props.volume];
                            let soundId = sound.play(note);
                            prevNotesTemp[noteName] = soundId;
                            labelElem.classList.toggle('active');
                        }
                        else if (!output[noteOct].pressed && prevNotes[noteName] > 0) {
                            // console.log(noteOct, output[noteOct].pressed, output)
                            labelElem.classList.toggle('active');
                            Object.keys(prevNotes).some((playedNote) => {
                                if (playedNote === noteName) {
                                    fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                                }
                            });
                            prevNotesTemp[noteName] = 0;
                        }
                    }
                }
            });
        });
        setPrevNotes(prevNotesTemp);
    }
    function setView(toFetch) {
        // console.log(toFetch)
        let notFetched = [];
        // let fsCopy = fetchedSounds;
        // console.log("current sounds", fetchedSounds)
        for (let i = 0; i < toFetch.length; i++) {
            let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + toFetch[i] + '/' + props.volume;
            // console.log(!fetchedSounds[toFetch[i]])
            if (!fetchedSounds[toFetch[i]] || fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3') {
                // console.log(toFetch[i])
                notFetched.push(toFetch[i]);
            }
            // console.log(notFetched, toFetch)
            if (notFetched.length > 0) {
                // console.error('before', fetchedSounds)
                setFetchedSounds((fetchedSounds) => ({ ...fetchedSounds, [toFetch[i]]: { [props.volume]: loadSound(url) } }));
                // console.error('after', fetchedSounds)
            }
        }
        // if(toFetch.length > 0) setFetchedSounds(fetchedSounds)
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(OctavesInView, { octaveMax: props.octaveMinMax[1], labelsRef: props.labelsRef, octave: props.octave, handleViewChange: setView }) }));
}
exports.default = Piano;
