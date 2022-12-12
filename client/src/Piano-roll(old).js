import React, {useState, useEffect, useRef} from 'react';
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
    props.onNotePlayed([props.qwertyKey]);
  }

  return (
    <button type='button' ref={ref} id={noteName.toLowerCase() + props.octave + '-label'} className={(props.note.length > 1) ? 'note-label accidental' : 'note-label natural'} onClick={() => handleClick()}>
      {props.note}
    </button>
  )
}

function Gridlet(props) {
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
        {props.note + props.timeIndex}
    </button>
  )
}

function Grid(props) {
  const [midi, setMidi] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let gridArr = [];
    let gridMidi = [];
    let gridLabels = [];
    for(var y = 11; y >= 0; y--) {
      gridLabels.push(<Key key={qwertyNote[y].note} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={props.octave} volume='mf' onNotePlayed={sendNoteProps} />)
      for(var x = 0; x < props.subdiv; x++) {
        gridMidi.push(<Gridlet key={x + 1} timeIndex={x + 1} subdiv={props.subdiv} octave={props.octave} note={qwertyNote[y].note} />);
      }
      gridArr.push(gridMidi)
      gridMidi = [];
    }
    // console.log(gridArr)
    if(gridArr.length === 12) {
      setMidi(gridArr);
      setLabels(gridLabels)
      props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
    }
  }, [props.subdiv]);

  function sendNoteProps(qwertyKey) {
    props.onNotePlayed(qwertyKey);
  }

  return (
    <div id='midi'>
      <div id='midi-note-labels'>{labels}</div>
      <div id='midi-grid'>
        <div id='measure-1' className='midi-grid-measure'>{midi}</div>
        <div id='measure-2' className='midi-grid-measure'>{midi}</div>
        <div id='measure-3' className='midi-grid-measure'>{midi}</div>
        <div id='measure-4' className='midi-grid-measure'>{midi}</div>
      </div>
    </div>
  );
}

function PianoRoll(props) {
  const [subdiv, setSubdiv] = useState(8);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    console.log(props.subdiv)
  }, [props.subdiv])

  const handleChangeSubdiv = (e) => {
    setSubdiv(parseInt(e.target.value));
  };

  function sendNoteProps(qwertyKey) {
    console.log(qwertyKey)
    props.onNotePlayed([qwertyKey]);
  }

  function renderLabels(noteLabels) {
    setLabels(noteLabels);
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
      <Grid subdiv={props.subdiv} octave={props.octave} onNotePlayed={sendNoteProps} sendLabels={renderLabels} />
    </>
  );
}

export default PianoRoll;