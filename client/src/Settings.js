import {React, useRef} from 'react';
import './Settings.css'
import transparent from './tranparency.png';

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

  // return <input type='range' ref={ref} id='bpm-slider' name='bpm' min='1' max='300'/>
  return (
    <div>
      <img src={transparent} id='bpm-spacer' ref={ref} />
      <div>
        <img src={transparent} id='bpm-draggable' />
      </div>
    </div>
  )
}

function Settings(props) {
  function renderSounds() {
    var sounds = [];
    Object.keys(props.soundDetails).forEach((sound) => {
      sounds.push(<option key={sound} value={sound}>{sound}</option>);
    });
    return sounds;
  }
  
  function renderOctaves() {
    if(Object.keys(props.soundDetails).length > 0) {
      var octaves = [];
      var soundObj = props.soundDetails[props.sound];
      Object.keys(soundObj).forEach((octave) => {
        octaves.push(<option key={octave} value={octave}>{octave}</option>);
      });
    }
    return octaves;
  }
  
  function renderVolumes() {
    if(Object.keys(props.soundDetails).length > 0) {
      var volumes = [];
      var octavesObj = props.soundDetails[props.sound][props.octave];
      console.log(octavesObj)
      octavesObj.forEach((volume) => {
        volumes.push(<option key={volume} value={volume}>{volume.replace(/[0-9]/g, '')}</option>);
      });
    }
    return volumes;
  }

  return (
    <div id='selectors'>
      <select name='sound' id='sound-selector' value={props.sound} onChange={(e) => props.handleChangeSound(e.target.value)}>
        {renderSounds()}
      </select>
      <select name='octave' id='octave-selector' value={props.octave} onChange={(e) => props.handleChangeOctave(e.target.value)}>
        {renderOctaves()}
      </select>
      <select name='volume' id='volume-selector' value={props.volume} onChange={(e) => props.handleChangeVolume(e.target.value)}>
        {renderVolumes()}
      </select>
      <BpmSlider />
      <select name='subdiv' id='subdiv-selector' defaultValue={'8'} onChange={(e) => props.handleChangeSubdiv(e.target.value)}>
        <option value='1'>1</option>
        <option value='2'>1/2</option>
        <option value='4'>1/4</option>
        <option value='8'>1/8</option>
        <option value='16'>1/16</option>
        <option value='32'>1/32</option>
      </select>
    </div>
    )
}

export default Settings;