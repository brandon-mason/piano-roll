import React, {useState, useEffect, useRef} from 'react';
import { KeyNoteInputProps } from '../Interfaces';
import PianoRoll from '../Piano-roll';


// interface IQwertyNote {
//   key: string;
//   note: string;
//   altNote?: string,
//   octave: number;
  
// }

// interface KeyNoteInputProps {
//   octave: number;
//   onNotePlayed: Function;
//   pianoRollKey: any[] | null;
// }

function KeyNoteInput(props: KeyNoteInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [controller, setController] = useState({});

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.repeat) {return}

      let octave = props.octave;
      let pressed = true;
      if(parseInt(e.code)) {
        octave = parseInt(e.code);
      }
      // console.warn('KEY DOWN')
      let key = e.key.toLowerCase(); // toLowerCase() is for caps lock
      setController((controller) => ({...controller, [key]: {octave: octave, pressed: true, time: 0}}));
    }

    const onKeyUp = (e: KeyboardEvent) => {
      let octave = props.octave;
      let pressed = false
      if(parseInt(e.code)) {
        octave = parseInt(e.code);
      }
      // console.warn('KEY UP')
      let key = e.key.toLowerCase();
      setController((controller) => ({...controller, [key]: {octave: octave, pressed: false, time: 0}}));
    }

    const element = ref.current!;
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);
    return () => {
      element.removeEventListener('keydown', onKeyDown);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [props.octave]);

  useEffect(() => {
  if(props.pianoRollKey) {
    if(props.pianoRollKey[2]) {
      console.warn('POINTER DOWN')
    } else if (props.pianoRollKey[2] === false) {
      console.warn('POINTER UP')
    }
    if(props.pianoRollKey.length > 0) {
      console.log(props.pianoRollKey)
      setController((controller) => ({...controller, [props.pianoRollKey![0]]: {octave: props.pianoRollKey![1], pressed: props.pianoRollKey![2], time: 0}}));
    }
  }
  }, [props.pianoRollKey]);

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
    // console.log(controller)
    // eslint-disable-next-line
  }, [controller]);

  return (
    <input type='text' ref={ref} id='key-note-input'></input>
  )
}

export default KeyNoteInput;