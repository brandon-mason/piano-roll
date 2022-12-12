import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {Howl, Howler} from 'howler';
import axios from 'axios';
import './Piano.css';
import qwertyNote from './note-to-qwerty-key';

function KeyNoteInputField(props) {
  const ref = useRef(null);
  const [controller, setController] = useState({});
  const [keyDown, setKeyDown] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      let keyCode = e.key.toLowerCase(); // toLowerCase() is for caps lock

      if(e.repeat) {return}
      else if(!controller[keyCode]) {
        setController((controller) => ({...controller, [keyCode]: {pressed: true}}));
      } else if(controller[keyCode]) {
        setController((controller) => ({...controller, [keyCode]: {pressed: true}}));
      }
      if(!keyDown) setKeyDown(true);
    }

    const onKeyUp = (e) => {
      let keyCode = e.key.toLowerCase()
      setController((controller) => ({...controller, [keyCode]: {pressed: false}}));
      setKeyDown(false);
    }

    const element = ref.current;
    element.focus();
    element.addEventListener('focusout', () => {element.focus();});
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('focusout', () => {element.focus();});
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  });

  const [time, setTime] = useState(Date.now())

  //THIS CAN POSSIBLY BE SIMPLIFIED!!!
  useEffect(() => {
    setTimeout(() => {
      const timeSinceLastCall = Date.now() - time;
      if(timeSinceLastCall > 50) {
        if(keyDown) {
          let keysPressed = [];
          const handlePress = (key) => {
            qwertyNote.forEach((keyNote) => {
              if(keyNote.key === key) {
                keysPressed.push(key); // SEND ARRAY OF NOTES FROM HERE ☺️
                return true;
              }
            });
            return false;
          };
          Object.keys(controller).forEach((key) => {
            if(controller[key].pressed) {
              handlePress(key);
              controller[key].pressed = false;
            }
          });
          props.onNotePlayed(keysPressed);
        } else {
          props.onNotePlayed([])
        }
      } else {
        props.onNotePlayed()
      }
      setTime(Date.now());
    }, 50);
    // eslint-disable-next-line
  }, [controller]);

  return (
    <input type='text' ref={ref} id='key-note-input'></input>
  )
}

// function PianoRoll(props) {
  
// }

function getSound() {
  // TODO
  // Will fetch the directory name of the current sound files being used
  return 'GrandPiano';
}

function convertToNote(qwertyKey) {
  let note;
  qwertyNote.forEach((keyNote) => {
    return (keyNote.key === qwertyKey) ? note = keyNote.note : '';
  });
  if(note.includes('#')) note = note.replace('#', '%23');
  return note;
}

function convertToOctave(qwertyKey) {
  let octave;
  qwertyNote.forEach(keyNote => {
    return (keyNote.key === qwertyKey) ? octave = keyNote.octave : '';
  });
  return octave;
}

// function renderSounds() {
//   // TODO
//   // Get sounds list from mongodb
//   return <option value='GrandPiano'>Grand Piano</option>;
// }

// function renderOctaves() {
//   return (<>
//     <option value='3'>3</option>
//     <option value='4'>4</option>
//   </>)
// }

// function renderVolumes() {
//   return (<>
//     <option value='mf'>mf</option>
//   </>)
// }

function Piano(props) {
  const [fetchedOctaves, setFetchedOctaves] = useState([]);
  const [keysPressed, setKeysPressed] = useState([]);
  const [currentOctave, setCurrentOctave] = useState({});
  const [octaveMinMax, setOctaveMinMax] = useState([])

  // useEffect(() => {
  //   function fetchSounds() {
  //     let notes = {};
  //     let note;
  //     let url;
  //     qwertyNote.forEach((key) => {
  //       url = 'http://localhost:3001/sounds/' + props.sound + '/' + (convertToOctave(key.key) + props.octave) + '/' + props.volume + '/' + convertToNote(key.key);
  //       note = new Howl({src: [url + '.webm', url + 'mp3']});
  //       notes = {...notes, [key.key]: note};
  //     });
  //     return notes;
  //   }

  //   setCurrentOctave(fetchSounds());
  // }, [props.sound, props.octave, props.volume]);
  useEffect(() => {
    function fetchSounds() {
      let octave0;
      let octave1;
      // console.log(octaveMinMax)
      // let octaveMin = octaveBounds()[0];
      // let octaveMax = octaveBounds()[1];
      let url0 = 'http://localhost:3001/sounds/' + props.sound + '/' + props.octave + '/' + props.volume;
      let url1 = 'http://localhost:3001/sounds/' + props.sound + '/' + (parseInt(props.octave) + 1) + '/' + props.volume;

      fetchedOctaves.some((octave) => {
        if(octave._src === url0) {
        octave0 = octave;
        } else if(octave === url1) {
          octave1 = octave;
        } 
        return octave0 !== undefined && octave1 !== undefined;
      });

      if(props.octave < octaveMinMax[0]) {
        octave0 = false;
      }
      if((parseInt(props.octave) + 1) > octaveMinMax[1]) {
        octave1 = false;
      }

      if(octave0 == undefined) {
        octave0 = new Howl({
          src: [url0 + '.webm', url0 + 'mp3'],
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
        setFetchedOctaves((fetchedOctaves) => [...fetchedOctaves, octave0]);
      }
      if(octave1 === undefined) {
        octave1 = new Howl({
          src: [url1 + '.webm', url1 + 'mp3'],
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
        setFetchedOctaves((fetchedOctaves) => [...fetchedOctaves, octave1]);
      }
      
      return [octave0, octave1];
    }

    // console.log(fetchSounds())
    if(octaveMinMax.length === 2) {
      setCurrentOctave(fetchSounds());
    }
  }, [props.sound, props.octave, props.volume, octaveMinMax]);

  useEffect(() => {
    var octaveFetched;
    var url = 'http://localhost:3001/sounds/' + props.sound + '/' + props.pianoRollNotes[1] + '/' + props.volume;

    fetchedOctaves.some((octave) => {
      octaveFetched = false;
      if(octave._src === url) {
      octaveFetched = true;
      } 
      return octaveFetched;
    });

    if(octaveFetched === false) {
      var octave = new Howl({
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
      setFetchedOctaves((fetchedOctaves) => [...fetchedOctaves, octave]);
    }

    if(props.pianoRollNotes.length > 0) {
      octave.play(props.pianoRollNotes[0])
    }
  }, [props.pianoRollNotes])

  useEffect(() => {
    // function playNote() {
    //   keysPressed.forEach((key) => {
    //     currentOctave[key].play();
    //   })
    // }
    function playNote() {
      let note;
      console.log(keysPressed)
      keysPressed.forEach((key) => {
        qwertyNote.forEach((qwerty) => {
          // console.log(currentOctave[qwerty.octave]);
          if(qwerty.key === key && currentOctave[qwerty.octave]) {
            note = qwerty.note;
            // console.log(currentOctave[qwerty.octave])
            currentOctave[qwerty.octave].play(note);
          }
        });
      })
    }
    // console.log(keysPressed)
    if(keysPressed.length !== 0) {
      playNote();
      setKeysPressed([]);
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

  // const handleChangeSound = (e) => {
  //   setSound(e.target.value);
  // }

  // const handleChangeOctave = (e) => {
  //   setOctave(e.target.value);
  // }
  
  // const handleChangeVolume = (e) => {
  //   setVolume(e.target.value);
  // }

  function setNoteProps(noteOctaves) {
    noteOctaves.forEach((key) => {
      setKeysPressed((keysPressed) => [...keysPressed, key]);
    });
  }

  // let piano = qwertyNote.map((keyNote) => {
  //   return <Key key={keyNote.key} qwertyKey={keyNote.key} note={keyNote.note} altNote={keyNote.altNote} octave={keyNote.octave} volume='mf' onNotePlayed={setNoteProps} />
  // });
  // piano.push(<KeyNoteInputField key='KeyNoteInputField' onNotePlayed={setNoteProps} />);
  // return piano;

  return (
    // <div id='selectors'>
    //   <select name='sound' id='sound-selector' onChange={(e) => handleChangeSound(e)}>
    //     {renderSounds()}
    //   </select>
    //   <select name='octave' id='octave-selector' onChange={(e) => handleChangeOctave(e)}>
    //     {renderOctaves()}
    //   </select>
    //   <select name='volume' id='volume-selector' onChange={(e) => handleChangeVolume(e)}>
    //     {renderVolumes()}
    //   </select>
    <>
      {/* <PianoRoll /> */}
      {/* <Settings handleChangeSound={setSound} handleChangeOctave={setOctave} handleChangeVolume={setVolume} /> */}

      <KeyNoteInputField key='KeyNoteInputField' onNotePlayed={setNoteProps} />
      {/* <PianoRoll onNotePlayed={setNoteProps} octave={octave} /> */}
      
      {/* <KeyNoteInputField /> */}
      </>
    // </div>
  );
}

export default Piano;