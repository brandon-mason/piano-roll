import React, { useState, useReducer, useEffect, useLayoutEffect, useRef } from 'react';
import { QwertyNote, FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './Piano.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

<<<<<<< HEAD
=======
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

>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
function OctavesInView(props: OctavesInViewProps) {
  const [toFetch, setToFetch] = useState<number[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let octavesInView: number[] = [];

    const buildThresholdArr = () => {
      let arr: number[] = [0];

      for(let i = 1; i < props.octaveMax + 1; i++) {
        let num = i / props.octaveMax;
        arr.push(Math[num < 0 ? 'ceil' : 'floor'](num * 100) / 100);
      }

      return arr;
    }

    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      let toFetchTemp: number[] = [];
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
<<<<<<< HEAD
          toFetchTemp.push(parseInt(entry.target.getAttribute('id')!.substring(0, 1)));
          // console.log(toFetchTemp)
=======
          // console.log(entry.target)
          toFetchTemp.push(parseInt(entry.target.getAttribute('id')!.substring(0, 1)));

>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
        }
      });

      setToFetch(toFetchTemp);
    }
    props.handleViewChange(toFetch);
    const options = {root: null, rootMargin: '0px', threshold: 0}
    observer.current = new IntersectionObserver(callback, options)
  }, [props.octaveMax, toFetch]);

  useEffect(() => { 
    let element = document.getElementById('midi');
    if(observer.current && props.labelsRef.current && props.labelsRef.current.children.length === props.octaveMax) {
      let children = props.labelsRef.current.children;
      for(let i = 0; i < children.length; i++) {
        observer.current.observe(children[i]);
      }
    }
    return (() => {
      if(observer.current) observer.current.disconnect();
    })
  }, [props.labelsRef, props.octaveMax])

  useEffect(() => {
    props.handleViewChange([props.octave])
  }, [props.octave])

  return null;
}

function Piano(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
<<<<<<< HEAD
  const [prevNotes, setPrevNotes] = useState<PrevNotes>({});
  const [keysRecorded, setKeysRecorded] = useState<string[]>([])
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})
  const [playbackOn, setPlaybackOn] = useState<KeysPressed>({})
  const [startPulse, setStartPulse] = useState<number>(0)

  useEffect(() => {
    // console.log('piano playback', props.playback);
    setPlaybackOff((playbackOff) => {
      let state = {...playbackOff};
      if(props.playback[props.pulseNum]) {
        Object.keys(props.playback[props.pulseNum]).forEach((noteOct) => {
          state = {...state, [noteOct]: {...props.playback[props.pulseNum][noteOct], pressed: false, end: props.pulseNum}}
        });
      }
      // console.log(state)
      return state;
    })
    setPlaybackOn((playbackOn) => {
      let state = {};
      if(props.playback[props.pulseNum]) {
        Object.keys(props.playback[props.pulseNum]).forEach((noteOct) => {
          state = {...state, [noteOct]: {...props.playback[props.pulseNum][noteOct], pressed: true, end: -1}}
        });
      }
      // console.log(state)
      return state;
    })
  }, [props.pulseNum])

  useEffect(() => {
    if(Object.keys(prevNotes).length > 0) {
      if(props.mode === 'stop') {
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');

            Howler.stop(); 
            fetchedSounds[octave][props.volume].mute(true, prevNotes[noteOct]); 
          }
        })
      } else if(props.mode === 'keyboard') {
        // Object.keys(prevNotes).forEach((noteOct) => {
        //   if(prevNotes[noteOct] > 0) {
        //     let octave = noteOct.replace(/\D/g, '');

        //     Howler.stop(); 
        //     fetchedSounds[octave][props.volume].mute(true, prevNotes[noteOct]); 
        //   }
        // })
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].pause(); 
          }
        })
      } else if(props.mode === 'playing') {
        Object.keys(prevNotes).forEach((noteOct) => {
          if(prevNotes[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].play(prevNotes[noteOct]); 
          }
        })
      }
    }
  }, [props.mode])

  useEffect(() => {
    // console.log(props.pulseNum);
  }, [props.pulseNum]);

  useEffect(() => {
    function playNote(output: KeysPressed) {
      // console.log(output)
      let qwertyOctave: number;
      let noteName: string;
      let prevNotesTemp: PrevNotes = prevNotes;
      Object.keys(output).forEach((noteOct) => {
        // console.log(output)
        let key = output[noteOct].key;
        let note = noteOct.replace(/[0-9]/g, '');
        let octave = parseInt(noteOct.replace(/\D/g,''));
        console.log(octave);
        Object.keys(qwertyNote).forEach((qwertyKey) => {
          qwertyOctave = qwertyNote[qwertyKey].octave;
          if(octave < props.octaveMinMax[1]) {
            if(qwertyKey === key && fetchedSounds[octave][props.volume]) {
=======
  // const [keysPressed, setKeysPressed] = useState<KeysPressed>({});
  const [octavesInView, setOctavesInView] = useState([]);
  const [prevNotes, setPrevNotes] = useState({});
  const [output, setOutput] = useState<KeysPressed>({...props.playback, ...props.keysPressed})

  useEffect(() => {
    setOutput(() => ({...props.keysPressed, ...props.playback}))
  }, [props.keysPressed, props.playback])
  
  useEffect(() => {
    // setOutput((output) => ({...output, ...props.playback}))
  }, [props.playback])

  // useEffect(() => console.log(prevNotes), [prevNotes])

  //old way to get octaves using sound prop changes
  useEffect(() => {
    function fetchSounds() {
      let octaveExists0 = true;
      let octaveExists1 = true;
      let url0 = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + props.octave + '/' + props.volume;
      let url1 = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + (props.octave + 1) + '/' + props.volume;


      if(props.octave < props.octaveMinMax[0] - 1) {
        octaveExists0 = false;
      }
      if(props.octave + 1 > props.octaveMinMax[1] - 1) {
        octaveExists1 = false;
      }

      if(octaveExists0 || octaveExists1) {
        if(fetchedSounds[props.octave as keyof typeof fetchedSounds]) {
          Object.keys(fetchedSounds[props.octave as keyof typeof fetchedSounds]).some((key) => {
            var octave: any = fetchedSounds[props.octave as keyof typeof fetchedSounds][key];
            if(!octave) {
              return false;
            } else if(octave._src === url0 + '.webm' || octave._src === url0 + '.mp3') {
              var octave0 = octave;
            } else if(octave._src === url1 || octave._src === url1 + '.webm') {
              var octave1 = octave;
            } 
            return octave0 !== undefined && octave1 !== undefined;
          });
        }
        if(octaveExists0) {
          var octave0 = new Howl({
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
            onplayerror: function() {
              octave0.once('unlock', function() {
                octave0.play();
              });
            }
          });
          setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [props.octave]: {[props.volume]: octave0}}));
        }
        if(octaveExists1) {
          var octave1 = new Howl({
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
          setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [props.octave + 1]: {[props.volume]: octave1}}));
        }
      }
    }
    if(props.octaveMinMax.length === 2) {
      // fetchSounds();
    }
  }, [props.sound, props.octave, props.volume]);

  const [domLoaded, setDomLoaded] = useState(false);
  const listenerCreated = React.useRef(false);

  //attempt to make sounds load on scroll
  useEffect(() => {
    // const fetchedSoundsCopy = JSON.parse(JSON.stringify(fetchedSounds));
    const fetchedSoundsCopy = fetchedSounds;
    let element = document.getElementById('midi-note-labels');
    let octaveNotFetched = false;
    const inView = (rect: DOMRect) => {
      return (
        rect.top + rect.height >= 0 &&
        rect.bottom - rect.height <= (window.innerHeight || document.documentElement.clientHeight)
      );
    }
    const fetchOnScroll = (e: Event) => {
      console.log(e)
      if(element?.childElementCount === props.octaveMinMax[1]) {
        let children = element.children;
        for(let i = 0; i < children.length; i++) {
          let child = children[i];
          let rect = child.getBoundingClientRect();
          if(inView(rect)) {
            let octave = parseInt(children[i].getAttribute('id')!.substring(0, 1));
            let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + octave + '/' + props.volume;
            let fsKeys = Object.keys(fetchedSounds);
            if(fsKeys.length > 0) {
              fsKeys.some((key: any) => {
                if(key[props.volume as keyof typeof key]._src !== url + '.webm' || key[props.volume as keyof typeof key]._src !== url + '.mp3') {
                  octaveNotFetched = true;
                }
                if(octaveNotFetched) {
                  fetchedSoundsCopy[octave] = {[props.volume]: loadSound(url)};
                  console.log("loaded sound: ", fetchedSoundsCopy[octave]);
                }
              });
            } else {
              fetchedSoundsCopy[octave] = {[props.volume]: loadSound(url)}
              console.log("loaded sound: ", fetchedSoundsCopy[octave]);
            };
          }
        }
        setFetchedSounds(fetchedSoundsCopy);
      }
    }
    // if(element) window.addEventListener('scroll', fetchOnScroll);
    return (() => {
      // if(element) window.removeEventListener('scroll', fetchOnScroll);
    })
  }, [props.octaveMinMax[1]])

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

  useEffect(() => {
    // console.log(props.keysPressed, prevNotes)
    function playNote() {
      let key: string;
      let octave: number;
      // let key: string;
      let qwertyOctave: number;
      let noteName: string;
      const prevNotesTemp: PrevNotes = prevNotes;
      Object.keys(output).forEach((noteOct) => {
        // console.error(output)
        let key = output[noteOct].key;
        let note = noteOct.replace(/[0-9]/g, '');
        let octave = parseInt(noteOct.replace(/\D/g,''));
        Object.keys(qwertyNote).forEach((qwertyKey) => {
          qwertyOctave = qwertyNote[qwertyKey].octave;
          // console.log(octave)
          if(octave < props.octaveMinMax[1]) {
            if(qwertyKey === key && fetchedSounds[octave][props.volume]) {
              // console.log(key, noteOct, octave, qwertyOctave);
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
              (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
              let labelElem = document.getElementById(noteName.toLowerCase() + '-label')!;
              if(output[noteOct].pressed && (!prevNotes[noteName as keyof typeof prevNotes] || prevNotes[noteName as keyof typeof prevNotes] === 0)) {
                let sound = fetchedSounds[octave][props.volume];
                let soundId = sound.play(note);
                prevNotesTemp[noteName] = soundId;
                labelElem.classList.toggle('active');
              } else if(!output[noteOct].pressed && prevNotes[noteName as keyof typeof prevNotes] > 0) {
                labelElem.classList.toggle('active');
                Object.keys(prevNotes).some((playedNote) => {
                  if(playedNote === noteName) {
                    fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName as keyof typeof prevNotes]);
                  }
                });
<<<<<<< HEAD
                prevNotesTemp[noteName] = 0;
=======
                prevNotesTemp[noteName as keyof typeof prevNotesTemp] = 0;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
              }
            }
          }
        });
      })
      setPrevNotes(prevNotesTemp);
<<<<<<< HEAD

      // setPlaybackOff({})
    }

    if(props.mode === 'playing' || props.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
      // console.log(props.pulseNum);
      let pbKp: KeysPressed = {...props.playback[props.pulseNum]}
      let state: string[] = [];
      if(startPulse === 0) {
        // console.log('pbkp');
        playNote(pbKp);
      } else if(Object.keys(props.playback).includes(props.pulseNum + ''))
      {
        Object.keys(props.keysPressed).forEach((noteOct) => {
          if(props.keysPressed[noteOct].pressed) {
            pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
            state.push(noteOct)
          } else if(keysRecorded.find((key) => key === noteOct)) {
            pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
          }
        })
          console.log(props.pulseNum)
          
          setPlaybackOn((playbackOn) => {
            let state = {...playbackOn};
            Object.keys(pbKp).forEach((noteOct) => {
              if(pbKp[noteOct].end !== -1 && state[noteOct]) {
                console.log('playbackOn', noteOct);
                delete state[noteOct];
              }
            })
            // console.log(state);
            return state;
          })
          // console.log('not pbkp');
          playNote({...pbKp, ...playbackOn});
          setPlaybackOn({})
      }
      setKeysRecorded(state);
    } else if(props.mode === 'keyboard') {
      console.log('keyb');
      setStartPulse(props.pulseNum)
      playNote(props.keysPressed);
    } else if(props.mode === 'stop') {
      setStartPulse(0);
      // console.log('stop');
      playNote(playbackOff);
      setPlaybackOff({})
    }

    // if(props.mode === 'recording' || props.mode === 'playing'){
    //   let pbKp: KeysPressed = {...props.playback}
    //   let state: string[] = [];

    //   Object.keys(props.keysPressed).forEach((noteOct) => {
    //     if(props.keysPressed[noteOct].pressed) {
    //       pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
    //       state.push(noteOct)
    //     } else if(keysRecorded.find((key) => key === noteOct)) {
    //       pbKp = {...pbKp, [noteOct]: props.keysPressed[noteOct]}
    //     }
    //   })
    //   if(props.pulseNum > 0) {
    //     // setUnpausePulse(props.pulseNum)
        
    //     setPlaybackOn((playbackOn) => {
    //       let state = {...playbackOn}
    //       Object.keys(pbKp).forEach((noteOct) => {
    //         if(pbKp[noteOct].end > -1 && state[noteOct]) delete state[noteOct];
    //       })
    //       console.log(state);
    //       return state;
    //     })

    //     playNote({...pbKp, ...playbackOn});
    //   } else {
    //     playNote(pbKp);
    //   }
    //   setKeysRecorded(state);
    // } else if(props.mode === 'keyboard') {
    //   playNote(props.keysPressed);
    // } else if(props.mode === 'stop') {
    //   playNote(playbackOff);
    // }
  }, [props.mode, props.pulseNum, props.keysPressed, props.playback])

  useEffect(() => {
    // if(props.pulseNum === unpausePulse) setPlaybackOn({})
  }, [props.pulseNum]);
=======
    }
    if(Object.keys(output).length !== 0) {
      playNote();
    }
  }, [output])

  

  useEffect(() => {

  }, [props.sound, props.octave, props.volume]);
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)

  function loadSound(url: string) {
    let octaveSound: any;
      octaveSound = new Howl({
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
<<<<<<< HEAD
        volume: .75,
=======
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
      });
      return octaveSound;
  }

  function setView(toFetch: number[]) {
<<<<<<< HEAD
    let notFetched: number[] = [];
    // console.log(toFetch)
    for(let i = 0; i < toFetch.length; i++) {
      let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + toFetch[i] + '/' + props.volume;
      if(!fetchedSounds[toFetch[i]] || fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3') {
        notFetched.push(toFetch[i]);
      }
      
      if(notFetched.length > 0) {
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(url)}}))
      }
    }
=======
    // console.log(toFetch)
    let notFetched: number[] = [];
    // let fsCopy = fetchedSounds;
    // console.log("current sounds", fetchedSounds)
    for(let i = 0; i < toFetch.length; i++) {
      let url = 'http://localhost:3001/sounds/Instruments/' + props.sound + '/' + toFetch[i] + '/' + props.volume;
      // console.log(!fetchedSounds[toFetch[i]])
      if(!fetchedSounds[toFetch[i]] || fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3') {
        // console.log(toFetch[i])
        notFetched.push(toFetch[i]);
      }
      
      // console.log(notFetched, toFetch)
      if(notFetched.length > 0) {
        // console.error('before', fetchedSounds)
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(url)}}))
        // console.error('after', fetchedSounds)
      }
    }
    // if(toFetch.length > 0) setFetchedSounds(fetchedSounds)
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  }

  return (
    <>
      {/* <KeyNoteInput key='KeyNoteInput' octave={props.octave} pianoRollKey={props.pianoRollKey} onNotePlayed={setNoteProps} /> */}
      <OctavesInView octaveMax={props.octaveMinMax[1]} labelsRef={props.labelsRef} octave={props.octave} handleViewChange={setView} />
    </>
  );
}

export default Piano;