import React, { useState, useEffect, useRef } from 'react';
import { FetchedSounds, PrevNotes, KeysPressed, OctavesInViewProps, PianoProps } from '../../Tools/Interfaces'
import {Howl, Howler} from 'howler';
import './Piano.css';
import { playNote, setView } from './PianoFunctions'
const qwertyNote = require('../../Tools/JSON/note-to-qwerty-key-obj');

function OctavesInView(props: OctavesInViewProps) { // Loads sounds as the page scrolls their keys into view.
  const [toFetch, setToFetch] = useState<number[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      let toFetchTemp: number[] = [];

      entries.forEach((entry) => {
        if(entry.isIntersecting) {
          toFetchTemp.push(parseInt(entry.target.getAttribute('id')!.substring(0, 1)));
        }
      });

      props.setFetchedSounds((fetchedSounds: FetchedSounds) => ({...fetchedSounds, ...setView(toFetchTemp, fetchedSounds, props.octaveMinMax, props.sound, props.volume)}));
      setToFetch(toFetchTemp);
    }
    const options = {root: null, rootMargin: '0px', threshold: 0}

    observer.current = new IntersectionObserver(callback, options)
  }, [props.octaveMinMax, toFetch, props.sound, props.volume]);

  useEffect(() => { 
    if(observer.current && props.labelsRef.current) {
      let children = props.labelsRef.current.children;
      
      for(let i = 0; i < children.length; i++) {
        observer.current.observe(children[i]);
      }
    }

    return (() => {
      if(observer.current) observer.current.disconnect();
    })
  }, [props.octaveMinMax, props.volume])

  useEffect(() => {
    props.setFetchedSounds((fetchedSounds: FetchedSounds) => ({...fetchedSounds, ...setView([props.octave, props.octave + 1], props.fetchedSounds, props.octaveMinMax, props.sound, props.volume)}));
  }, [props.octave])

  useEffect(() => {
    let octaveArr = Object.keys(props.fetchedSounds).reduce((accum: number[], curr: string) => { accum.push(parseInt(curr)); return accum; }, []);

    props.setFetchedSounds((fetchedSounds: FetchedSounds) => {
      let state = {...fetchedSounds};
      let newVol = setView(octaveArr, props.fetchedSounds, props.octaveMinMax, props.sound, props.volume);

      Object.keys(state).forEach((key) => {
        state[key] = {...fetchedSounds[key], ...newVol[key]}
      });
      return state
    });
  }, [props.volume])

  return null;
}

function Piano(props: PianoProps) {
  const [fetchedSounds, setFetchedSounds] = useState<FetchedSounds>({});
  const prevNotes = useRef<PrevNotes>({});
  const [playbackOff, setPlaybackOff] = useState<KeysPressed>({})

  // Handle window losing focus while piano is being played.
  // useEffect(() => {
  //   const focusOut = (e: Event) => {
  //     playNote(playbackOff, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
  //     setPlaybackOff({})
  //   }

  //   window.addEventListener('blur', focusOut)
  //   return(() => {
  //     window.removeEventListener('blur', focusOut)
  //   })
  // }, []);

  // Sets playback to all notes currently playing from playback, with their end
  // times set to the current time. playbackOff is used when props.mode = ''.
  useEffect(() => {
    setPlaybackOff((playbackOff) => {
      let state = {...playbackOff};

      if(props.playback[props.pulseNum]) {
        props.playback[props.pulseNum].forEach((value, noteOct) => {
          state = {...state, [noteOct]: {...props.playback[props.pulseNum].get(noteOct)!, pressed: false, end: props.pulseNum}}
        });
      }

      return state;
    })
  }, [props.pulseNum])

  // Uses the mute, pause, and play methods from Howler to make sounds respond to 
  // stop, pause, and play accordingly.
  useEffect(() => {
    if(Object.keys(prevNotes.current).length > 0) {
      if(props.mode === 'stop') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');

            Howler.stop(); 
            fetchedSounds[octave][props.volume].mute(true, prevNotes.current[noteOct]); 
          }
        })
      } else if(props.mode === 'keyboard') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].pause(); 
          }
        })
      } else if(props.mode === 'playing') {
        Object.keys(prevNotes.current).forEach((noteOct) => {
          if(prevNotes.current[noteOct] > 0) {
            let octave = noteOct.replace(/\D/g, '');
            fetchedSounds[octave][props.volume].play(prevNotes.current[noteOct]); 
          }
        })
      }
    }
  }, [props.mode])

  // Plays notes from keystrokes while recording, playing back, and doing neither
  // of those. Also plays notes from the playback variable. Uses playNote function 
  // from 'PianoFunctions.ts" to play notes.
  useEffect(() => {
    if(props.mode === 'playing' || props.mode === 'recording') {
      let pb: KeysPressed = {};

      if(props.playback[props.pulseNum]) {
        pb = Object.fromEntries(props.playback[props.pulseNum]);
        prevNotes.current = playNote(pb, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      }
      
      if(props.keysPressed.size > 0 && Object.keys(pb).length > 0) {
        prevNotes.current = playNote({...pb, ...Object.fromEntries(props.keysPressed)}, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
        prevNotes.current = playNote({...pb, ...Object.fromEntries(props.keysUnpressed)}, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      } else if(Object.keys(pb).length === 0) {
        if(props.keysPressed.size > 0)
          prevNotes.current = playNote(Object.fromEntries(props.keysPressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
        if(props.keysUnpressed.size > 0) 
          prevNotes.current = playNote(Object.fromEntries(props.keysUnpressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      }
    }

    if(props.mode === 'keyboard') {
      prevNotes.current = playNote(Object.fromEntries(props.keysPressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      prevNotes.current = playNote(Object.fromEntries(props.keysUnpressed), prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
    } else if(props.mode === 'stop') {
      prevNotes.current = playNote(playbackOff, prevNotes.current, qwertyNote, props.octaveMinMax, fetchedSounds, props.volume);
      
      setPlaybackOff({});
    }
  }, [props.mode, props.pulseNum, props.keysPressed, props.keysUnpressed, props.playback])

  

  return <OctavesInView fetchedSounds={fetchedSounds} labelsRef={props.labelsRef} octaveMinMax={props.octaveMinMax} octave={props.octave} sound={props.sound} volume={props.volume} setFetchedSounds={setFetchedSounds} />;
}

export default Piano;