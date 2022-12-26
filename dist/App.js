"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// import axios from 'axios';
require("./App.css");
// import Settings from './Settings'
// import Piano from './Piano';
// import PianoRoll from './Piano-roll';
const Midi_Recorder_1 = require("./Midi-Recorder");
function App() {
    // const [sound, setSound] = useState('GrandPiano');
    // const [octave, setOctave] = useState(3);
    // const [volume, setVolume] = useState('2mf');
    // const [numMeasures, setNumMeasures] = useState(4);
    // const [subdiv, setSubdiv] = useState('4');
    // const [notesPlayed, setNotesPlayed] = useState([]);
    // const [soundDetails, setSoundDetails] = useState({});
    // useEffect(() => {
    //   getSoundDetails();
    // }, [])
    // async function getSoundDetails() {
    //   const url = 'http://localhost:3001/api/sounds/';
    //   const options = {
    //     method: 'GET',
    //     mode: 'cors',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Access-Control-Allow-Origin': true,
    //     },
    //   }
    //   var soundDetails;
    //   const soundDeets = await axios.get(url, options)
    //     .then(res => {
    //       soundDetails = res.data;
    //     }).catch(err => console.error(err));
    //   setSoundDetails(soundDetails);
    //   return soundDetails;
    // }
    return ((0, jsx_runtime_1.jsx)("div", { className: "App", children: (0, jsx_runtime_1.jsx)(Midi_Recorder_1.default, {}) }));
}
exports.default = App;
