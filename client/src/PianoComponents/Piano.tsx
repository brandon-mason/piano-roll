import React, { useState, useReducer, useEffect, useLayoutEffect, useRef } from 'react';
import { QwertyNote, FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './Piano.css';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

function OctavesInView(props: OctavesInViewProps) {
  const [toFetch, setToFetch] = useState<number[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      let toFetchTemp: number[] = [];
      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          toFetchTemp.push(parseInt(entry.target.getAttribute('id')!.substring(0, 1)));
          // console.log(toFetchTemp)
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
  }, [props.octaveMax, props.volume])

  useEffect(() => {
    props.handleViewChange([props.octave, props.octave + 1])
    // console.log(props.octave);
  }, [props.octave, props.volume])

  return null;
}

function Piano(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const [prevNotes, setPrevNotes] = useState<PrevNotes>({});
  const [keysRecorded, setKeysRecorded] = useState<string[]>([])
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})
  const [playbackOn, setPlaybackOn] = useState<KeysPressed>({})
  const [startPulse, setStartPulse] = useState(0)

  useEffect(() => {
    // console.log('piano playback', props.playback);
    setPlaybackOff((playbackOff) => {
      let state = {...playbackOff};
      if(props.playback[props.pulseNum]) {
        props.playback[props.pulseNum].forEach((value, noteOct) => {
          state = {...state, [noteOct]: {...props.playback[props.pulseNum].get(noteOct)!, pressed: false, end: props.pulseNum}}
        });
      }
      // console.log(state)
      return state;
    })
    // setPlaybackOn((playbackOn) => {
    //   let state = {};
    //   if(props.playback[props.pulseNum]) {
    //     Object.keys(props.playback[props.pulseNum]).forEach((noteOct) => {
    //       state = {...state, [noteOct]: {...props.playback[props.pulseNum][noteOct], pressed: true, end: -1}}
    //     });
    //   }
    //   // console.log(state)
    //   return state;
    // })
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
    // console.log(fetchedSounds);
  }, [fetchedSounds]);

  useEffect(() => {
    if(props.playback[props.pulseNum]) {
      props.setKeysUnpressed((keysUnpressed: typeof props.keysUnpressed) => {
        let state = new Map(keysUnpressed)
        Object.keys(Object.fromEntries(props.playback[props.pulseNum])).forEach((noteOct) => {
          if(props.keysUnpressed.get(noteOct)) {
            console.log(noteOct)
            keysUnpressed.delete(noteOct);
            console.log(keysUnpressed)
          }
        });
        return state;
      })
    }
  }, [props.pulseNum]);

  useEffect(() => {
    function playNote(output: KeysPressed) {
      // console.log('output')
      let qwertyOctave: number;
      let noteName: string;
      let prevNotesTemp: PrevNotes = prevNotes;
      // console.log(output);
      Object.keys(output).forEach((noteOct) => {
        // console.log(noteOct)
        let key = output[noteOct].key;
        let note = noteOct.replace(/[0-9]/g, '');
        let octave = parseInt(noteOct.replace(/\D/g,''));
        // console.log(octave);
        if(Object.keys(qwertyNote).includes(key!)) {
          // console.log(octave, note, key)
          if(octave < props.octaveMinMax[1]) {
            // console.log(note)
            if(fetchedSounds[octave][props.volume]) {
              (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
              let labelElem = document.getElementById(noteName.toLowerCase() + '-label')!;
              // console.log(output[noteOct].pressed, !prevNotes[noteName] , prevNotes[noteName] === 0)
              if(output[noteOct].pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                let sound = fetchedSounds[octave][props.volume];
                let soundId = sound.play(note);
                // console.log(note)
                prevNotesTemp[noteName] = soundId;
                labelElem.classList.toggle('active');
              } else if(!output[noteOct].pressed && prevNotes[noteName as keyof typeof prevNotes] > 0) {
                labelElem.classList.toggle('active');
                Object.keys(prevNotes).some((playedNote) => {
                  // if(playedNote === noteName) console.log(playedNote , noteName)
                  if(playedNote === noteName) {
                    fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                    // console.log('soundoff')
                  }
                });
                prevNotesTemp[noteName] = 0;
                // console.log(prevNotesTemp)
              }
            }
          }
        }
      })
      setPrevNotes(prevNotesTemp);
    }
    // console.log(props.pulseNum)s
    if(props.mode === 'playing' || props.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
      let pb: KeysPressed = {};
      let keysUnpressed = new Map(props.keysUnpressed)

      if(props.playback[props.pulseNum]) {
        pb = Object.fromEntries(props.playback[props.pulseNum]);
        console.log('keysUnpressed')
        
      }
      if(props.playback.length > 0 && props.playback[props.pulseNum]) {
        // console.log(props.pulseNum);
        // console.log('pb', pb);
          playNote(pb);
        // }
      }
      if(props.keysPressed.size > 0 && pb) {
        // console.log('pre', {...pb, ...Object.fromEntries(props.keysPressed)});
        playNote({...pb, ...Object.fromEntries(props.keysPressed)})
        // console.log('unp', {...pb, ...Object.fromEntries(keysUnpressed)});
        playNote({...pb, ...Object.fromEntries(props.keysUnpressed)})
      }
      else {
        playNote(Object.fromEntries(props.keysPressed));
        playNote(Object.fromEntries(props.keysUnpressed));
      }
    }
    if(props.mode === 'keyboard') {
      // console.log('keyb's);
      setStartPulse(props.pulseNum)
      playNote(Object.fromEntries(props.keysPressed));
      playNote(Object.fromEntries(props.keysUnpressed));
    }
    if(props.mode === 'keyboard') {
      // console.log('keyb's);
      setStartPulse(props.pulseNum)
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
  }, [props.mode, props.pulseNum, props.keysPressed, props.keysUnpressed, props.playback])

  function loadSound(url: string) {
    console.error(url);
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
        volume: .75,
      });
      return octaveSound;
  }

  function setView(toFetch: number[]) {
    let notFetched: number[] = [];
    if(props.octaveMinMax[0] !== props.octaveMinMax[1])
    for(let i = 0; i < toFetch.length; i++) {
      console.log(toFetch[i])
      let url = `${process.env.REACT_APP_SERVER}/sounds/Instruments/${props.sound}/${toFetch[i]}/${props.volume}`;
      console.log(!fetchedSounds[toFetch[i]] === undefined)
      // console.log(fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3');
      if(!(toFetch[i] in fetchedSounds)) {
        notFetched.push(toFetch[i]);
      } else if(!(props.volume in fetchedSounds[toFetch[i]])) {
        notFetched.push(toFetch[i]);
      }
      console.log(notFetched)
      if(notFetched.length > 0) {
        console.log('hehe');
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(url)}}))
      }
    }
    console.log('hoho');
  }

  return (
    <>
      {/* <KeyNoteInput key='KeyNoteInput' octave={props.octave} pianoRollKey={props.pianoRollKey} onNotePlayed={setNoteProps} /> */}
      <OctavesInView octaveMax={props.octaveMinMax[1]} labelsRef={props.labelsRef} octave={props.octave} volume={props.volume} handleViewChange={setView} />
    </>
  );
}

export default Piano;