import {useState, useEffect} from 'react'
import axios from 'axios';
import './App.css';
import Settings from './Settings'
import Piano from './Piano';
import PianoRoll from './Piano-roll';

function App() {
  const [sound, setSound] = useState('GrandPiano');
  const [octave, setOctave] = useState(3);
  const [volume, setVolume] = useState('2mf');
  const [subdiv, setSubdiv] = useState('8');
  const [notesPlayed, setNotesPlayed] = useState([]);
  const [soundDetails, setSoundDetails] = useState({});

  useEffect(() => {
    getSoundDetails();
  }, [])

  async function getSoundDetails() {
    const url = 'http://localhost:3001/api/sounds/';
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': true,
      },
    }
    var soundDetails;
    const soundDeets = await axios.get(url, options)
      .then(res => {
        soundDetails = res.data;
      }).catch(err => console.error(err));
      console.log(soundDetails)
    setSoundDetails(soundDetails);
    return soundDetails;
  }
  console.log(soundDetails)
  return (
    <div className="App">
      <Settings soundDetails={soundDetails} sound={sound} octave={parseInt(octave)} volume={volume} handleChangeSound={setSound} handleChangeOctave={setOctave} handleChangeVolume={setVolume} handleChangeSubdiv={setSubdiv} />
      <Piano soundDetails={soundDetails} sound={sound} octave={parseInt(octave)} volume={volume} pianoRollNotes={notesPlayed} />
      <PianoRoll soundDetails={soundDetails} sound={sound} octave={parseInt(octave)} subdiv={parseInt(subdiv)} onNotePlayed={setNotesPlayed} />
    </div>
  );
}

export default App;
