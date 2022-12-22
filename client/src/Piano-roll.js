import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import axios from 'axios';
import './Piano-roll.css';
import qwertyNote from './note-to-qwerty-key';

function Key(props) {
  const ref = useRef(null);

  useEffect(() => {
    const onPointerDown = (e) => {
      if(e.repeat) {return;}
      props.onNotePlayed([props.qwertyKey, parseInt(props.octave), true]);
    }

    const onPointerUp = (e) => {
      props.onNotePlayed([props.qwertyKey, parseInt(props.octave), false]);
    }

    const element = ref.current;
    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointerup', onPointerUp);
    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointerup', onPointerUp);
    };
  });

  let noteName;

  (props.note.includes('#')) ? noteName = props.note.replace('#', 'sharp') : noteName = props.note.replace('b', 'flat');
  
  function handleClick() {
    props.onNotePlayed([props.note, props.octave]);
  }

  return (
    <button type='button' ref={ref} id={noteName.toLowerCase() + props.octave + '-label'} className={(props.note.length > 1) ? 'note-label accidental' : 'note-label natural'}> {/* onClick={() => handleClick()}> */}
      {props.note + props.octave}
    </button>
  );
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
    // <button type='button' ref={ref} className={'midi-note ' + props.note + props.octave + ' note-' + props.subdiv} onClick={addNote}>
    //     {props.note + props.octave}
    // </button>
    <div id={props.note+props.octave + '-measure '} className='note-measure' ></div>
  );
}

function NoteLabels(props) {
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    var element = document.getElementById('g' + props.octave + '-label');
    if(element) {
      element.scrollIntoView({block: 'center'});
    }
  }, [props.octave, labels]);

  useLayoutEffect(() => {
    // console.log(props.octave)
    let gridLabels = [];
    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // console.log(props.octaveArray[x]);
        gridLabels.push(<Key key={qwertyNote[y].note + props.octaveArray[x]} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={props.octaveArray[x]} volume={props.volume} onNotePlayed={sendNoteProps} />);
      }
    }
    // console.log(gridLabels)
    if(gridLabels.length === 12 * props.octaveArray.length) {
      setLabels(gridLabels);
      // props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
    }
  }, [props.octaveArray]);

  function sendNoteProps(qwertyKey) {
    props.onNotePlayed(qwertyKey);
  }

  return <div id='midi-note-labels'>{labels}</div>
}

function Grid(props) {
  const [grid, setMidi] = useState([]);
  // const [labels, setLabels] = useState([]);

  // useEffect(() => {
  //   var element = document.getElementById('g' + props.octave + '-label');
  //   if(element) {
  //     element.scrollIntoView({block: 'center'});
  //   }
  // }, [props.octave, labels]);

  useLayoutEffect(() => {
    // console.log(props.octave)
    let gridMidi = [];
    let gridSubdivisions = [];
    let gridMeasure = [];
    for(var x = props.octaveArray.length - 1; x >= 0; x--) {
      for(var y = 11; y >= 0; y--) {
        // console.log(props.octaveArray[x]);
        // gridLabels.push(<Key key={qwertyNote[y].note + props.octaveArray[x]} qwertyKey={qwertyNote[y].key} note={qwertyNote[y].note} altNote={qwertyNote[y].altNote} octave={props.octaveArray[x]} volume={props.volume} onNotePlayed={sendNoteProps} />)
        gridMeasure.push(<NoteTrack key={qwertyNote[y].note + props.octaveArray[x]} note={qwertyNote[y].note} octave={props.octaveArray[x]} subdiv={props.subdiv} />);
      }
    }
    for(var i = 0; i < props.subdiv * props.numMeasures; i++) {
      if(i % props.subdiv === 0) {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision' style={{borderLeft: 'solid 3px'}}></span>)
      } else {
        gridSubdivisions.push(<span key={i} id={'subdiv-' + (i + 1)} className='subdivision'></span>);
      }
    }
    // console.log(gridLabels)
    if(gridMeasure.length === 12 * props.octaveArray.length) {
      var i = 0;
      // for(var i = 0; i < props.numMeasures; i++) {
        // gridMidi.push(<div key={'measure-' + (i + 1)} id={'measure-' + (i + 1)} className='midi-grid-measure' style={{backgroundSize: bgSize + '% 1px'}}>{gridMeasure}</div>);
        gridMidi.push(<div key='subdivs' id='subdivs' style={{gridTemplateColumns: 'repeat(' + props.subdiv * props.numMeasures + ', auto)'}}>{gridSubdivisions}</div>)
        gridMidi.push(<div key='measures' id='measures' style={{/*backgroundSize: bgSizeTrack / props.subdiv + '%'*/}}>{gridMeasure}</div>);
      // }
      setMidi(gridMidi);
      // setLabels(gridLabels)
      // props.sendLabels(<div id='midi-grid-labels'>{gridLabels}</div>);
    }
  }, [props.subdiv, props.octaveArray, props.numMeasures]);

  // function sendNoteProps(qwertyKey) {
  //   props.onNotePlayed(qwertyKey);
  // }
  
  // const bgSizeMeasures = parseInt(100 / (props.numMeasures * props.subdiv));
  const bgSizeTrack = 100 / props.numMeasures;
  // const bgSizeMeasures = bgSizeTrack / props.subdiv;
  // const bgSize = (100);
  // const gridTemp = {gridTemplate: '100% / repeat(' + props.numMeasures + ', auto)'};

  return grid;
  // return (
    // <div id='midi'>
    //   <div id='midi-note-labels'>{labels}</div>
    //   {/* <div id='midi-grid' style={gridTemp}>{grid}</div> */}
    //   <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>{grid}</div>
    // </div>
    // <div id='midi'>
    //   <div id='midi-note-labels'>{labels}</div>
    //   {/* <div id='midi-grid' style={gridTemp}>{grid}</div> */}
      // <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>{grid}</div>
    // </div>
  // );
}

function TimeTracker() {

}

function PianoRoll(props) {
  const ref = useRef(null);
  const [labels, setLabels] = useState([]);
  const [octaveArray, setOctaveArray] = useState([]);
  const bgSizeTrack = 100 / props.numMeasures;

  // useEffect(() => {
  //   var element = document.getElementById('c' + props.octave + '-label');
  //   console.log(props.octave)
  //   if(element) {
  //     console.log(element, 'c' + props.octave + '-label');
  //     element.scrollIntoView(true);
  //   }
  // }, [props.octave]);

  useLayoutEffect(() => {
    // console.log(props.octave)
    // setOctaveCount(getOctaveCount());
    // getSoundDetails();
    // console.log(props.soundDetails)
    getOctaveArray();
  }, [props.soundDetails, props.sound])

  useEffect(() => {

  });

  function sendNoteProps(qwertyKey) {
    // console.log(qwertyKey)
    props.onNotePlayed(qwertyKey);
  }

  function renderLabels(noteLabels) {
    setLabels(noteLabels);
  }

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
  
  function trackPosition(time, midiLength) {
    const position = {left: `${8 + time / 6000 / midiLength}%`}
    return <div id='track-position' style={position}></div>
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
      <div id='midi'>
        <NoteLabels octaveArray={octaveArray} octave={props.octave} volume={props.volume} onNotePlayed={sendNoteProps} />
        {trackPosition(props.time, props.midiLength)}
        <div id='midi-track' style={{backgroundSize: bgSizeTrack + '%'}}>
          <Grid octaveArray={octaveArray} numMeasures={props.numMeasures} subdiv={props.subdiv} />
        </div>
      </div>
      {/* <Grid octaveArray={octaveArray} octave={props.octave} volume={props.volume} numMeasures={props.numMeasures} subdiv={props.subdiv} onNotePlayed={sendNoteProps} sendLabels={renderLabels} /> */}
    </>
  );
}

export default PianoRoll;