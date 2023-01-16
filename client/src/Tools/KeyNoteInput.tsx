import React, {useState, useEffect, useRef} from 'react';
import { KeysPressed, KeyNoteInputProps } from './Interfaces';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');

function KeyNoteInput(props: KeyNoteInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [controller, setController] = useState<KeysPressed>({});
  const [loginExists, setLoginExists] = useState<boolean>(props.loginRef.current !== undefined)

  useEffect(() => {
    console.log(props.loginRef.current)
  }, [props.loginRef.current])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if(e.repeat) {
        // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
        return;
      };
      const control = e.metaKey || e.ctrlKey;
      
      if(Object.keys(kbControls).includes(e.key)) {
        e.preventDefault();
        props.onControlsPressed([e.key, control]);
      }
      if(!Object.keys(qwertyNote).includes(e.key)) {
        return;
      }
      let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
      let pressed = true;

      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
        console.log(octave)
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
      if(parseInt(e.code) - parseInt(e.code) === 0) {
        octave = parseInt(e.code);
      }
      
      let note = qwertyNote[e.key.toLowerCase()].note;
      setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: false, end: props.pulseNum}}}));
    }

    const element = ref.current!;
    if(document && !props.focusOnLogin) {
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
      };
    } else {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }
  }, [props.octave, props.pulseNum, props.focusOnLogin]);

  useEffect(() => {
    const element = ref.current;
    // console.log(!element);
    // if(element) {
    //   console.log('huh');
    //   .focus();
    //   element.addEventListener('focusout', () => element.focus());
    
    //   return () => {
    //     element.removeEventListener('focusout', () => element.focus());
    //   };
    // }
  }, [props.focusOnLogin]);



  useEffect(() => {
    props.onNotePlayed(controller);
    // console.warn(controller)
    // eslint-disable-next-line
  }, [controller]);

  return (
    <>
      <input type='text' ref={ref} autoComplete='off' id='key-note-input'></input>
    </>
  )
}

export default KeyNoteInput;