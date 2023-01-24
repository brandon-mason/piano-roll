"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const qwertyNote = require('../Tools/note-to-qwerty-key-obj');
const kbControls = require('../Tools/keyboard-controls');
function KeyNoteInput(props) {
    const ref = (0, react_1.useRef)(null);
    const [keysPressed, setKeysPressed] = (0, react_1.useState)({});
    const [keysUnpressed, setKeysUnpressed] = (0, react_1.useState)({});
    // const [loginExists, setLoginExists] = useState<boolean>(props.loginRef.current !== undefined)
    // useEffect(() => { 
    //   console.log(props.loginRef.current)
    // }, [props.loginRef.current])
    (0, react_1.useEffect)(() => {
        const onKeyDown = (e) => {
            if (e.repeat) {
                // setController((controller) => ({...controller, [note + octave]: {...controller[note + octave], ...{end: props.pulseNum}}}));
                return;
            }
            ;
            const control = e.metaKey || e.ctrlKey;
            if (Object.keys(kbControls).includes(e.key)) {
                e.preventDefault();
                props.onControlsPressed([e.key, control]);
            }
            if (!Object.keys(qwertyNote).includes(e.key)) {
                return;
            }
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = true;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
                console.log(octave);
            }
            if (!control) {
                let note = qwertyNote[e.key.toLowerCase()].note; // toLowerCase() is for caps lock
                setKeysPressed((keysPressed) => ({ ...keysPressed, [note + octave]: { ...keysPressed[note + octave], ...{ key: e.key.toLowerCase(), pressed: true, start: props.pulseNum, end: -1 } } }));
                if (keysUnpressed[note + octave]) {
                    setKeysUnpressed((keysPressed) => {
                        let state = { ...keysPressed };
                        delete state[note + octave];
                        return state;
                    });
                }
            }
        };
        const onKeyUp = (e) => {
            if (!Object.keys(qwertyNote).includes(e.key))
                return;
            let octave = props.octave + qwertyNote[e.key.toLowerCase()].octave;
            let pressed = false;
            if (parseInt(e.code) - parseInt(e.code) === 0) {
                octave = parseInt(e.code);
            }
            let note = qwertyNote[e.key.toLowerCase()].note;
            setKeysUnpressed((keysUnpressed) => ({ ...keysUnpressed, [note + octave]: { ...keysPressed[note + octave], ...{ key: e.key.toLowerCase(), pressed: false, end: props.pulseNum } } }));
            if (keysPressed[note + octave]) {
                setKeysPressed((keysPressed) => {
                    let state = { ...keysPressed };
                    delete state[note + octave];
                    return state;
                });
            }
        };
        if (document && !props.focus) {
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);
            return () => {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            };
        }
        else {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        }
    }, [props.octave, props.pulseNum, props.focus, keysPressed, keysUnpressed]);
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
    (0, react_1.useEffect)(() => {
        props.setKeysPressed(keysPressed);
        // eslint-disable-next-line
    }, [keysPressed]);
    (0, react_1.useEffect)(() => {
        props.setKeysUnpressed(keysUnpressed);
        // eslint-disable-next-line
    }, [keysUnpressed]);
    // return (
    //   <>
    //     {/* <input type='text' ref={ref} autoComplete='off' id='key-note-input'></input> */}
    //   </>
    // )
    return null;
}
exports.default = KeyNoteInput;
