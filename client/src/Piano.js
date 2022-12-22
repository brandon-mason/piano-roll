import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './Piano.css';
import qwertyNote from './note-to-qwerty-key';

function KeyNoteInputField(props) {
  const ref = useRef(null);
  const [controller, setController] = useState({});

  // useEffect(() => {
  //   console.log(props.octave)
  // }, [props.octave])

  useEffect(() => {
    const onKeyDown = (e) => {
      if(e.repeat) {return}

      let keyCode = e.key.toLowerCase(); // toLowerCase() is for caps lock
      setController((controller) => ({...controller, [keyCode]: {octave: props.octave, pressed: true}}));
    }

    const onKeyUp = (e) => {
      let keyCode = e.key.toLowerCase();
      setController((controller) => ({...controller, [keyCode]: {octave: props.octave, pressed: false}}));
    }

    const element = ref.current;
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [props.octave]);

  useEffect(() => {
    const element = ref.current;
    element.focus();
    element.addEventListener('focusout', () => {element.focus();});
    return () => {
      element.removeEventListener('focusout', () => {element.focus();});
    };
  }, []);

  // const [time, setTime] = useState(Date.now());

  //THIS CAN POSSIBLY BE SIMPLIFIED!!!
  useEffect(() => {
    props.onNotePlayed(controller);
    // eslint-disable-next-line
  }, [controller]);

  return (
    <input type='text' ref={ref} id='key-note-input'></input>
  )
}

function Piano(props) {
  // const [fetchedOctaves, setFetchedOctaves] = useState([]);
  const [fetchedOctaves, setFetchedOctaves] = useState({});
  const [keysPressed, setKeysPressed] = useState({});
  const [currentOctave, setCurrentOctave] = useState({});
  const [prevNotes, setPrevNotes] = useState({});
  const [octaveMinMax, setOctaveMinMax] = useState([]);

  // useEffect(() => {
  //   console.log(props.octave)
  // }, [props.octave])

  useEffect(() => {
    function fetchSounds() {
      let octave0;
      let octave1;
      // console.log(octaveMinMax)
      // let octaveMin = octaveBounds()[0];
      // let octaveMax = octaveBounds()[1];
      let url0 = 'http://localhost:3001/sounds/' + props.sound + '/' + props.octave + '/' + props.volume;
      let url1 = 'http://localhost:3001/sounds/' + props.sound + '/' + (parseInt(props.octave) + 1) + '/' + props.volume;

      // if(Object.keys(fetchedOctaves).length !== 0) {
      if(fetchedOctaves[props.volume]) {
        Object.keys(fetchedOctaves[props.volume]).some((key) => {
          var octave = fetchedOctaves[props.volume][key];
          if(!octave) {
            return false;
          } else if(octave._src === url0 + '.webm' || octave._src === url0 + '.mp3') {
            octave0 = octave;
          } else if(octave._src === url1 || octave._src === url1 + '.webm') {
            octave1 = octave;
          } 
          return octave0 !== undefined && octave1 !== undefined;
        });
      } else {
        fetchedOctaves[props.volume] = {};
      }

      if(props.octave < octaveMinMax[0]) {
        octave0 = false;
      }
      if((parseInt(props.octave) + 1) > octaveMinMax[1]) {
        octave1 = false;
      }

      if(octave0 === undefined) {
        octave0 = new Howl({
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
        setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.volume]: {...fetchedOctaves[props.volume], [props.octave]: octave0}}));
      }
      if(octave1 === undefined) {
        octave1 = new Howl({
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
        setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.volume]: {...fetchedOctaves[props.volume], [props.octave + 1]: octave1}}));
      }
      
      return [octave0, octave1];
    }

    // console.log(fetchSounds())
    if(octaveMinMax.length === 2) {
      setCurrentOctave(fetchSounds());
    }
  }, [props.sound, props.octave, props.volume, octaveMinMax]);

  useEffect(() => {
    if(props.pianoRollNotes.length > 0) {
      var octave;
      var octaveFetched;
      var url = 'http://localhost:3001/sounds/' + props.sound + '/' + props.pianoRollNotes[1] + '/' + props.volume;

      if(fetchedOctaves[props.volume]) {
        Object.keys(fetchedOctaves[props.volume]).some((key) => {
          octave = fetchedOctaves[props.volume][key];
          octaveFetched = false;
          if(octave._src === url + '.webm' || octave._src === url + '.mp3') {
            octaveFetched = true;
          }
          return octaveFetched;
        });
      } else {
        fetchedOctaves[props.volume] = {};
      }

      if(octaveFetched === false) {
        octave = new Howl({
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
        setFetchedOctaves((fetchedOctaves) => ({...fetchedOctaves, [props.volume]: {...fetchedOctaves[props.volume], [props.pianoRollNotes[1]]: octave}}));
      }
      setKeysPressed((keysPressed) => ({...keysPressed, [props.pianoRollNotes[0]]: {octave: props.pianoRollNotes[1], pressed: props.pianoRollNotes[2]}}))
      // octave.play(props.pianoRollNotes[0]);
    }
  }, [props.pianoRollNotes])

  useEffect(() => {
  }, [fetchedOctaves])

  useEffect(() => {
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

          if(qwerty.key === key && fetchedOctaves[props.volume][keysPressed[key].octave + octave] && keysPressed[key].pressed && !prevNotes[note + octave]) {
            (note.includes('#')) ? noteName = note.replace('#', 'sharp') : noteName = note.replace('b', 'flat');
            id = fetchedOctaves[props.volume][keysPressed[key].octave + octave].play(note);
            prevNotesTemp[note + octave] = id;
            document.getElementById(noteName.toLowerCase() + (keysPressed[key].octave + octave) + '-label').classList.toggle('active');
            return true;
          } else if(qwerty.key === key && fetchedOctaves[props.volume][keysPressed[key].octave + octave] && !keysPressed[key].pressed && prevNotes[note + octave]) {
            (note.includes('#')) ? noteName = note.replace('#', 'sharp') : noteName = note.replace('b', 'flat');
            document.getElementById(noteName.toLowerCase() + (keysPressed[key].octave + octave) + '-label').classList.toggle('active');
            Object.keys(prevNotes).some((playedNote) => {
              if(playedNote === note + octave) {
                fetchedOctaves[props.volume][keysPressed[key].octave + octave].fade(1, 0, 300, prevNotes[note + octave]);
              }
            });
            prevNotesTemp[note + octave] = null;
            return true;
          }
        });
      })
      setPrevNotes(prevNotesTemp);
    }
    // console.log(keysPressed)
    if(Object.keys(keysPressed).length !== 0) {
      playNote();
      // setKeysPressed({});
    }

  }, [keysPressed])

  useEffect(() => {
    // console.log(Object.keys(props.soundDetails).length)
    if(Object.keys(props.soundDetails).length > 0) {
      let octavesArray = Object.keys(props.soundDetails[props.sound]);
      // console.log(Math.min(...octavesArray), Math.max(...octavesArray))
      setOctaveMinMax([Math.min(...octavesArray), Math.max(...octavesArray)]);
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

  return (
    <>
      <KeyNoteInputField key='KeyNoteInputField' octave={props.octave} keysPressed={keysPressed} onNotePlayed={setNoteProps} />
    </>
  );
}

export default Piano;