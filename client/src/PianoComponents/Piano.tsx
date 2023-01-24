import React, { useState, useReducer, useEffect, useLayoutEffect, useRef } from 'react';
import { QwertyNote, FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps, KeyPressed } from '../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './Piano.css';
import { pbkdf2 } from 'crypto';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');

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
  }, [props.labelsRef, props.octaveMax])

  useEffect(() => {
    props.handleViewChange([props.octave, props.octave + 1])
    // console.log(props.octave);
  }, [props.octave])

  return null;
}

function Piano(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const [prevNotes, setPrevNotes] = useState<PrevNotes>({});
  const [keysRecorded, setKeysRecorded] = useState<string[]>([])
  const [playbackOff, setPlaybackOff] = useState<Map<string, KeyPressed>>(new Map())
  const [playbackOn, setPlaybackOn] = useState<KeysPressed>({})
  const [startPulse, setStartPulse] = useState<number>(0)

  useEffect(() => {
    // if(Object.keys(playbackOff).length > 0) console.log(playbackOff);
  }, [playbackOff]);
  useEffect(() => {
    // if(Object.keys(playbackOn).length > 0) console.log(playbackOn);
  }, [playbackOn]);
  //
  useEffect(() => {
    // console.log('piano playback', props.playback);
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
    function playNote(output: KeysPressed) {
      let qwertyOctave: number;
      let noteName: string;
      let prevNotesTemp: PrevNotes = prevNotes;
      Object.keys(output).forEach((keyPressed, noteOct) => {
        // console.log(keyPressed)
        let key = keyPressed.key!;
        let note = noteOct.replace(/[0-9]/g, '');
        let octave = parseInt(noteOct.replace(/\D/g,''));
        console.log(qwertyNote[key]);
        if(qwertyNote[key]) {
          qwertyOctave = qwertyNote[key].octave;
          console.log(octave < props.octaveMinMax[1])
          if(octave < props.octaveMinMax[1]) {
            console.log(fetchedSounds[octave][props.volume]);
            if(fetchedSounds[octave][props.volume]) {
              (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
              let labelElem = document.getElementById(noteName.toLowerCase() + '-label')!;
              console.log(keyPressed.pressed , prevNotes[noteName] > 0);
              if(keyPressed.pressed && (!prevNotes[noteName] || prevNotes[noteName] === 0)) {
                let sound = fetchedSounds[octave][props.volume];
                let soundId = sound.play(note);
                prevNotesTemp[noteName] = soundId;
                labelElem.classList.toggle('active');
              } else if(!keyPressed.pressed && prevNotes[noteName] > 0) {
                labelElem.classList.toggle('active');
                Object.keys(prevNotes).some((playedNote) => {
                  if(playedNote === noteName) {
                    fetchedSounds[octave][props.volume].fade(1, 0, 300, prevNotes[noteName]);
                  }
                });
                prevNotesTemp[noteName] = 0;
              }
            }
          }
        }
      })
      setPrevNotes(prevNotesTemp);
    }
    // console.log(props.keysUnpressed)
    // (Object.keys(props.playback).includes(props.pulseNum.toString())) ? console.warn(props.pulseNum) : console.log(props.pulseNum)
    if(props.mode === 'playing' || props.mode === 'recording') { // || (props.midiState.mode === 'recording' && Object.keys(midiRecorded).length > 0) && props.keysPressed) {
      console.log(props.playback.get('keysPressed'), props.playback.get('keysUnpressed'))
      let pbkp = props.playback.get('keysPressed')

      if(props.keysPressed.size > 0) {
        console.log('keybn');
        setStartPulse(props.pulseNum)
        console.log(props.keysPressed);
        playNote(pbkp);
      } else if(props.keysUnpressed.size > 0) {
        console.log('keyb');
        setStartPulse(props.pulseNum)
        playNote(props.keysUnpressed);
        props.setKeysUnpressed({});
      }
    } else if(props.mode === 'keyboard' && props.keysPressed.size > 0) {
      console.log('keybn');
      setStartPulse(props.pulseNum)
      console.log(props.keysPressed);
      playNote(props.keysPressed);
    } else if(props.mode === 'keyboard' && props.keysUnpressed.size > 0) {
      console.log('keyb');
      setStartPulse(props.pulseNum)
      playNote(props.keysUnpressed);
      props.setKeysUnpressed({});
    } else if(props.mode === 'stop') {
      setStartPulse(0);
      // console.log('stop');
      playNote(playbackOff);
      setPlaybackOff(new Map())
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

  useEffect(() => {
    // if(props.pulseNum === unpausePulse) setPlaybackOn({})
  }, [props.pulseNum]);

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
        volume: .75,
      });
      return octaveSound;
  }

  function setView(toFetch: number[]) {
    let notFetched: number[] = [];
    // console.log(toFetch)
    for(let i = 0; i < toFetch.length; i++) {
      let url = `${process.env.REACT_APP_SERVER}/sounds/Instruments/${props.sound}/${toFetch[i]}/${props.volume}`;
      if(!fetchedSounds[toFetch[i]] || fetchedSounds[toFetch[i]][props.volume]._src != url + '.webm' || fetchedSounds[toFetch[i]][props.volume]._src != url + '.mp3') {
        notFetched.push(toFetch[i]);
      }
      
      if(notFetched.length > 0) {
        console.log('hehe');
        setFetchedSounds((fetchedSounds) => ({...fetchedSounds, [toFetch[i]]: {[props.volume]: loadSound(url)}}))
      }
    }
  }

  return (
    <>
      {/* <KeyNoteInput key='KeyNoteInput' octave={props.octave} pianoRollKey={props.pianoRollKey} onNotePlayed={setNoteProps} /> */}
      <OctavesInView octaveMax={props.octaveMinMax[1]} labelsRef={props.labelsRef} octave={props.octave} handleViewChange={setView} />
    </>
  );
}

export default Piano;