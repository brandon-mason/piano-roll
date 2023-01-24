"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import  {DraggableNumber} from './libs/draggable-number'
require("./Settings.css");
// interface BpmSliderProps {
//   bpm: number;
//   midiDispatch: Function;
// }
// interface SoundSettingsProps {
//   soundDetails: {
//     [sound: string]: {
//       [octave: string]: string[]
//     }
//   };
//   sound: string;
//   octave: number;
//   volume: string;
//   pianoDispatch: Function;
// }
function Settings(props) {
    (0, react_1.useEffect)(() => {
        const selectors = document.getElementById('selectors');
        const keyNoteInput = document.getElementById('key-note-input');
        // console.log(selectors, keyNoteInput)
        if (selectors && keyNoteInput) {
            selectors.appendChild(keyNoteInput);
        }
    }, []);
    function renderSounds() {
        let sounds = [];
        Object.keys(props.soundDetails).forEach((sound) => {
            sounds.push((0, jsx_runtime_1.jsx)("option", { value: sound, children: sound }, sound));
        });
        return sounds;
    }
    // no clue why this doesnt work
    // function renderOctavesFor() {
    //   let octaves: JSX.Element[] = [];
    //   let soundObj = props.soundDetails[props.sound as keyof typeof props.soundDetails];
    //   console.log(soundObj)
    //   let octaveKeys = Object.keys(props.soundDetails[props.sound as keyof typeof props.soundDetails]);
    //   if(octaveKeys.length > 0) {
    //     for(let i = octaveKeys.length; i > 0; i--) {
    //       octaves.push(<option key={octaveKeys[i]} value={octaveKeys[i]}>{octaveKeys[i]}</option>);
    //     };
    //   }
    //   console.log(Object.keys(props.soundDetails))
    //   return octaves;
    // }
    function renderOctaves() {
        let octaves = [];
        if (Object.keys(props.soundDetails).length > 0) {
            let soundObj = props.soundDetails[props.sound];
            Object.keys(soundObj).slice().reverse().forEach((octave) => {
                octaves.push((0, jsx_runtime_1.jsx)("option", { value: octave, children: octave }, octave));
            });
        }
        return octaves;
    }
    // interface IOctavesObj {
    //   [octave: number]: string[];
    // }
    function renderVolumes() {
        let volumes = [];
        let octavesObj;
        let volumesArr = [];
        if (Object.keys(props.soundDetails).length > 0) {
            octavesObj = props.soundDetails[props.sound];
            // console.log(octavesObj)
            volumesArr = octavesObj[props.octave];
            octavesObj[props.octave].forEach((volume) => {
                volumes.push((0, jsx_runtime_1.jsx)("option", { value: volume, children: volume.replace(/[0-9]/g, '') }, volume));
            });
        }
        return volumes;
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("select", { name: 'sound', id: 'sound-selector', value: props.sound, onChange: (e) => { props.pianoDispatch({ type: 'sound', sound: e.target.value }); }, children: renderSounds() }), (0, jsx_runtime_1.jsx)("select", { name: 'octave', id: 'octave-selector', value: props.octave, onChange: (e) => { props.pianoDispatch({ type: 'octave', octave: parseInt(e.target.value) }); }, children: renderOctaves() }), (0, jsx_runtime_1.jsx)("select", { name: 'volume', id: 'volume-selector', value: props.volume, onChange: (e) => { props.pianoDispatch({ type: 'volume', volume: e.target.value }); }, children: renderVolumes() })] }));
}
exports.default = Settings;
