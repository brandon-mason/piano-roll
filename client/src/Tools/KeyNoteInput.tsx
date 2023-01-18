import React, {useState, useEffect, useRef} from 'react';
import { KeysPressed, KeyNoteInputProps } from './Interfaces';
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');

function KeyNoteInput(props: KeyNoteInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [controller, setController] = useState<KeysPressed>({});
  // const [loginExists, setLoginExists] = useState<boolean>(props.loginRef.current !== undefined)

  // useEffect(() => { 
  //   console.log(props.loginRef.current)
  // }, [props.loginRef.current])

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
      if(!control) {
        let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
        setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1}}}));
      }
      
      
      // console.warn('KEY DOWN')
      // console.warn(qwertyNote[key])
      // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: props.pulseNum + 1}}}));
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

    // const element = ref.current!;
    if(document && !props.focus) {
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
  }, [props.octave, props.pulseNum, props.focus]);

  // useEffect(() => {
  //   const element = ref.current;
  //   if(element) {
  //     element.addEventListener('focusout', () => {
  //       let tempController = JSON.stringify(controller).replaceAll('true', 'false');
  //       tempController = JSON.stringify(controller).replaceAll('-1', '0');
  //       setController(JSON.parse(tempController))
  //     });
  //     return () => {
  //       element.removeEventListener('focusout', () => element.focus());
  //     };
  //   }
  //   // console.log(!element);
  //   // if(element) {
  //   //   console.log('huh');
  //   //   .focus();
    
  //   //   return () => {
  //   //     element.removeEventListener('focusout', () => element.focus());
  //   //   };
  //   // }
  // }, []);

  useEffect(() => {
    props.onNotePlayed(controller);
    // eslint-disable-next-line
  }, [controller]);

  return (
    <>
      {/* <input type='text' ref={ref} autoComplete='off' id='key-note-input'></input> */}
    </>
  )
}

export default KeyNoteInput;