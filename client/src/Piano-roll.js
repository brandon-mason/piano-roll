import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import axios from 'axios';
import './Piano-roll.css';
import qwertyNote from './note-to-qwerty-key';

function BpmSlider() {
  const ref = useRef(null);
  var drag;



  // useEffect(() => {
  //   const changeBpm = (e) => {
  //     console.log(drag);
  //   }
  
  //   const element = ref.current;
  //   element.addEventListener('click', changeBpm);
  //   element.addEventListener('mousedown', () => drag = false);
  //   element.addEventListener('mousemove', () => drag = true);
  //   return() => {
  //     element.removeEventListener('click', changeBpm);
  //     element.removeEventListener('mousedown', () => drag = false);
  //     element.removeEventListener('mousemove', () => drag = true);
  //   }
  // });
  return <div id='bpm-draggable' ref={ref}></div>
  // return <input type='range' ref={ref} id='bpm-slider' name='bpm' min='1' max='300'/>
}

function Key(props) {
  const ref = useRef(null);

  let noteName;
  (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
  
  function handleClick() {
    props.onNotePlayed([props.note, props.octave]);
  }

  return (
    <button type='button' ref={ref} id={noteName.toLowerCase() + props.octave + '-label'} className={(props.note.length > 1) ? 'note-label accidental' : 'note-label natural'} onClick={() => handleClick()}>
      {props.note + props.octave}
    </button>
  )
}

function NoteTrack(props) {
  // const [active, setActive] = useState();
  const ref = useRef(null);

  // useEffect(() => {
  //   var element = ref.current;
  //   element.classList.toggle('note-' + props.subdiv);
  //   return () => {
  //     element.classList.toggle('note-' + props.subdiv)
  //   }
  // }, [props.subdiv]);

  function addNote() {
    var element = ref.current;
    element.classList.toggle('active');
    // setActive(active === true ? false : true);
  }

  return (
    // <button type='button' ref={ref} className={ 'midi-note ' + props.timeIndex + '-' + props.note } onClick={addNote}>
    <button type='button' ref={ref} className={'midi-note ' + props.note + props.octave + ' note-' + props.subdiv} onClick={addNote}>
        {props.note + props.octave}
    </button>
  )
}

function Grid(props) {
  const [midi, setMidi] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // console.log(props.octave)
    let gridArr = [];
    let gridMidi = [];
    let gridLabels = [];
    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // console.log(props.octaveArray[x]);
        gridLabels.push(<Key key={qwertyNote[y].note + props.octaveArray[x]} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={props.octaveArray[x]} volume={props.volume} onNotePlayed={sendNoteProps} />)
        gridMidi.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={props.octaveArray[x]} />);
      }
    }
    // console.log(gridLabels)
    if(gridLabels.length === 12 * props.octaveArray.length) {
      setMidi(gridMidi);
      setLabels(gridLabels)
      props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
    }
  }, [props.subdiv, props.octaveArray]);

  function sendNoteProps(qwertyKey) {
    props.onNotePlayed(qwertyKey);
  }

  return (
    <div id='midi'>
      <div id='midi-note-labels'>{labels}</div>
      <div id='midi-grid'>
        <div id='measure-1' className='midi-grid-measure'>{midi}</div>
      </div>
    </div>
  );
}

function PianoRoll(props) {
  const [subdiv, setSubdiv] = useState(8);
  const [labels, setLabels] = useState([]);
  const [octaveArray, setOctaveArray] = useState([]);

  useLayoutEffect(() => {
    // console.log(props.octave)
    // setOctaveCount(getOctaveCount());
    // getSoundDetails();
    // console.log(props.soundDetails)
    getOctaveArray();
  }, [props.soundDetails, props.sound])

  const handleChangeSubdiv = (e) => {
    setSubdiv(parseInt(e.target.value));
  };

  function sendNoteProps(qwertyKey) {
    // console.log(qwertyKey)
    props.onNotePlayed(qwertyKey);
  }

  function renderLabels(noteLabels) {
    setLabels(noteLabels);
  }

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
  //   console.log(soundDetails);
  //   return soundDetails;
  // }

  function getOctaveArray() {
    Object.keys(props.soundDetails).some((key) => {
      if(key === props.sound) {
        // console.log(Object.keys(props.soundDetails[key]))
        setOctaveArray(Object.keys(props.soundDetails[key]));
        return Object.keys(props.soundDetails[key]);
      } else {
        return [];
      }
    })
  }

  return (
    <>
      {/* <BpmSlider /> */}
      {/* <select name='subdiv' id='subdiv-selector' defaultValue={subdiv} onChange={(e) => handleChangeSubdiv(e)}>
        <option value='1'>1</option>
        <option value='2'>1/2</option>
        <option value='4'>1/4</option>
        <option value='8'>1/8</option>
        <option value='16'>1/16</option>
        <option value='32'>1/32</option>
      </select> */}
      <Grid subdiv={props.subdiv} octaveArray={octaveArray} octave={props.octave} volume={props.volume} onNotePlayed={sendNoteProps} sendLabels={renderLabels} />
    </>
  );
}

export default PianoRoll;