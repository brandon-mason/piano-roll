import React, {useState, useEffect, useRef} from 'react';
import { KeysPressed, KeyNoteInputProps } from './Interfaces';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');

function KeyNoteInput(props: KeyNoteInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [controller, setController] = useState<KeysPressed>({});

  useEffect(() => {
    // console.error(props.pulseNum)
  }, [props.pulseNum])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.repeat) {
        // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
        return;
      };
      const control = e.metaKey || e.ctrlKey;
      // console.log(e.key)
      if(Object.keys(kbControls).includes(e.key)) {
        e.preventDefault();
        props.onControlsPressed([e.key, control]);
      }
      if(!Object.keys(qwertyNote).includes(e.key)) {
        return;
      }
      let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
      let pressed = true;
      if(parseInt(e.code)) {
        octave = parseInt(e.code);
      }
      let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
      
      // console.warn('KEY DOWN')
      // console.warn(qwertyNote[key])
      // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: props.pulseNum + 1}}}));
      setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1}}}));
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if(!Object.keys(qwertyNote).includes(e.key)) return;
      let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
      let pressed = false
      if(parseInt(e.code)) {
        octave = parseInt(e.code);
      }
      // console.warn('KEY UP')
      let note = qwertyNote[e.key.toLowerCase()].note;
      setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: false, end: props.pulseNum}}}));
    }

    const element = ref.current!;
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [props.octave, props.pulseNum]);

  // useEffect(() => {
  // if(props.pianoRollKey) {
  //   if(props.pianoRollKey[2]) {
  //     console.warn('POINTER DOWN')
  //   } else if (props.pianoRollKey[2] === false) {
  //     console.warn('POINTER UP')
  //   }
  //   if(props.pianoRollKey.length > 0) {
  //     console.log(props.pianoRollKey)
  //     setController((controller) => ({...controller, [props.pianoRollKey![0]]: {octave: props.pianoRollKey![1], pressed: props.pianoRollKey![2], start: props.pulseNum, end: -1}}));
  //   }
  // }
  // }, [props.pianoRollKey]);

  useEffect(() => {
    const element = ref.current!;
    element.focus();
    element.addEventListener('focusout', () => {element.focus();});
    return () => {
      element.removeEventListener('focusout', () => {element.focus();});
    };
  }, []);

  useEffect(() => {
    props.onNotePlayed(controller);
    // console.warn(controllers)
    // eslint-disable-next-line
  }, [controller]);

  return (
    <>
      <input type='text' ref={ref} autoComplete='off' id='key-note-input'></input>
    </>
  )
}

export default KeyNoteInput;