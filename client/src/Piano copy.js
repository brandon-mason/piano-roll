import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {Howl, Howler} from 'howler';
import axios from 'axios';
import qwertyNote from './note-to-qwerty-key';

function Key(props) {
  const ref = useRef(null);

  function handleClick() {
    let noteOctaves = {};
    noteOctaves[props.qwertyKey] = {note: convertToNote(props.qwertyKey), relativeOctave: convertToOctave(props.qwertyKey)};
    props.onNotePlayed(noteOctaves);
  }

  return (
    <button type='button' ref={ref} id={props.qwertyKey} onClick={() => handleClick()}>
      {props.note}
    </button>
  )
}

function KeyNoteInputField(props) {
  const ref = useRef(null);
  const [controller, setController] = useState({});
  const [keyDown, setKeyDown] = useState(false);

  useEffect(() => {

    // console.time('controller');

    const onKeyDown = (e) => {
      let keyCode = e.key;

      if(e.repeat) {return}
      else if(!controller[keyCode]) {
        setController(controller => ({...controller, [keyCode]: {pressed: true}}));

        // console.timeLog('controller');

      } else if(controller[keyCode]) {
        setController(controller => ({...controller, [keyCode]: {pressed: true}}));

        // console.timeLog('controller');

      }
      if(!keyDown) setKeyDown(true);

      // console.log(keyCode)

    }

    const onKeyUp = (e) => {
      let keyCode = e.key
      setController(controller => ({...controller, [keyCode]: {pressed: false}}));
      setKeyDown(false);

      // console.log(controller);

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

    // console.log('keyDown', props.notePlayed)

    setTimeout(() => {
      const timeSinceLastCall = Date.now() - time;

      // console.log(timeSinceLastCall);
      // console.log(keyDown)

      if(timeSinceLastCall > 50) {
        if(keyDown) {
          let keysPressed = [];
          const handlePress = (key) => {
            if(document.querySelector('#'+key)) {

              // console.log('heyyyyy')

              keysPressed.push(key); // SEND ARRAY OF NOTES FROM HERE ☺️

              // console.log(key)

              return true;
            }
          };

          // console.log(keyDown)

          Object.keys(controller).forEach(key => {
            if(controller[key].pressed) {

              // console.log('controller', controller);

              handlePress(key);
              controller[key].pressed = false;
            }

            // console.log(controller);

          });

          // console.log(keysPressed);

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
    <input ref={ref} id='key-note-input'></input>
  )
}

function PianoRoll(props) {
  const [usedNotes, setUsedNotes] = useState([]);
  const [noteSoundIndex, setNoteSoundIndex] = useState([]);
  const [keysPressed, setKeysPressed] = useState([]);
  const [keyPlayed, setKeyPlayed] = useState('');

  // console.log(playedNotes)

  useEffect(() => {
    function isDupeNote() {

      // console.warn('isDupeNote()')
      // console.log(keysPressed)
      var note;
      var octave;
      var volume = 'mf';
      let url;
      let isDupe;
      let promiseUrl = '';
      let usedNotesAdd = [];
      let indexes = [];
      
      if(!usedNotes[0]) {
        if(keysPressed.length === 1) {
          note = convertToNote(keysPressed[0]);
          octave = 3 + convertToOctave(keysPressed[0]);
          usedNotesAdd.push(playSound(note, octave));
          setKeyPlayed(keysPressed[0]);
        } else {
          keysPressed.forEach(key => {
            note = convertToNote[key];
            octave = 3 + convertToOctave(key);
            usedNotesAdd.push(playSound(note, octave));
            setKeyPlayed(key);
          });
        }

        setKeyPlayed(keysPressed[0]);

        // console.log('setNSI')
        // console.log('setNoteSoundIndex0', convertToNote(keysPressed[0]) + (3 + convertToOctave(keysPressed[0])))

        indexes.push(0);
      } else {
        for(var i = 0; i < keysPressed.length; i++) {
          isDupe = false;
          note = convertToNote(keysPressed[i]);
          octave = 3 + convertToOctave(keysPressed[i]);
          url = 'http://localhost:3001/api/sounds/' + getSound() + '/' + octave + '/' + volume + '/' + note;
          
          // console.log('keysPressed[i]', keysPressed[i], i)

          setKeyPlayed(keysPressed[i]);
          for(var j = 0; j < usedNotes.length; j++) {

            // console.log('usedNotes.length', usedNotes[j]._src)
            // console.log()
            
            if(j === usedNotes.length) return;
            if(usedNotes.length > 0) promiseUrl = usedNotes[j]._src;

            // console.log('usedNotes.length', usedNotes.length)
            // console.log('usedNotes.[j]._src', usedNotes[j]._src)
            console.log('promiseUrl, url', promiseUrl , url )
            // console.log('promiseUrl === url', promiseUrl === url[i] + '.webm' || promiseUrl === url[i] + '.mp3')

            if(promiseUrl === url + '.webm' || promiseUrl === url + '.mp3') {

              // console.log('j', j); 

              // console.log(noteSoundIndex)
              // console.log('setNoteSoundIndex1', j, usedNotesAdd.length, noteOctave);

              indexes.push(j + usedNotesAdd.length);
              isDupe = true;
              break;
            }
          }

          // console.log('isDupe', isDupe)
          
          if(!isDupe) {
            usedNotesAdd.push(playSound(note, octave));
            let soundIndex = usedNotes.length + usedNotesAdd.length - 1;
            indexes.push(soundIndex);

            // console.log(usedNotes);
            // console.log('setNoteSoundIndex2', soundIndex, noteOctave);
            
          }
        }
      }

      console.log(indexes);

      usedNotesAdd.forEach(note => setUsedNotes(usedNotes => [...usedNotes, note]));
      indexes.forEach(index => setNoteSoundIndex(nsi => [...nsi, index]));
    }

    function playSound(note, octave) {

      // console.warn('playeSound()')

      let volume = 'mf';
      let url = 'http://localhost:3001/api/sounds/' + getSound() + '/' + octave + '/' + volume + '/' + note;
      var noteSound = new Howl({src: [url + '.webm', url + '.mp3'], autoplay: false});
      
      console.log('playSound()', noteSound.play())

      return noteSound;
    }

    // console.log('isKeyDown', isKeyDown)

    if(keysPressed.length !== 0) {

      // console.log(isDupeNote())

      isDupeNote();
      setKeysPressed([]);
    }
    // eslint-disable-next-line
  }, [keysPressed]);

  useEffect(() => {
    if(noteSoundIndex.length !== 0) {

      console.log('usedNotes', usedNotes)
      console.log('noteSoundIndex', noteSoundIndex)

      noteSoundIndex.forEach(index => {

        console.log(usedNotes[index]._queue);
        console.log('index', index);

        usedNotes[index].fade(1.0, 0.0, 2000);
        usedNotes[index].play();

        console.log(usedNotes[index]._src)

      });
      setNoteSoundIndex([]);
    }
  }, [noteSoundIndex, usedNotes]);

  function setNoteProps(noteOctaves) {
    
    noteOctaves.forEach(key => {
      setKeysPressed(keysPressed => [...keysPressed, key]);
    })
  }

  let piano = qwertyNote.map(keyNote => {
    return <Key key={keyNote.key} qwertyKey={keyNote.key} note={keyNote.note} altNote={keyNote.altNote} octave={keyNote.octave} volume='mf' onNotePlayed={setNoteProps} />
  })
  piano.push(<KeyNoteInputField key='KeyNoteInputField' onNotePlayed={setNoteProps} notePlayed={keyPlayed} />);
  return piano;
}

function getSound() {
  // TODO
  // Will fetch the directory name of the current sound files being used
  return 'GrandPiano';
}

function convertToNote(qwertyKey) {

  // console.log(qwertyKey)

  let note;
  qwertyNote.forEach(keyNote => {
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

  // console.log(qwertyKey)

  return octave;
}

function renderSoundOptions() {
  // TODO
  // Get sounds list from mongodb
  return <option value='GrandPiano'>Grand Piano</option>;
}

function renderOctaves() {
  

  
}

function Piano(props) {
  const [sound, setSound] = useState('GrandPiano');

  function handleChangeSound(e) {
    setSound(e.target.value);
  }

  return (
    <div>
      <select name='sound' id='sound-selector' onChange={(e) => handleChangeSound(e)}>
        {renderSoundOptions()}
        {renderOctaves()}
      </select>
      <PianoRoll />
      {/* <KeyNoteInputField /> */}
    </div>
  );

}

export default Piano;