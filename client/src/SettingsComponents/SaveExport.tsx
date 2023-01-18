import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import SavedTracks from './SavedTracks';
import { MidiNoteInfo, MidiSettingsProps } from '../Tools/Interfaces';
// import  {DraggableNumber} from './libs/draggable-number'
import './Settings.css';

interface SaveExportProps {
  midiNoteInfo: MidiNoteInfo[];
  mode: string;
  username: string;
  controlsDispatch: Function;
  setFocus: Function;
  setTrackName: Function
}

function SaveExport(props: SaveExportProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [midiNoteString, setMidiNoteString] = useState<string[]>()

  useEffect(() => {
    if(nameRef.current)
    {
      nameRef.current.addEventListener('focusin', () => {
        props.setFocus(true)
      })
      nameRef.current.addEventListener('focusout', () => {
        props.setFocus(false)
      })
      return (() => {
        nameRef.current!.removeEventListener('focusin', props.setFocus(true))
        nameRef.current!.removeEventListener('focusout', props.setFocus(false))
      })
    }
  },[]);

  useEffect(() => {
    var midiNoteTemp: string[] = [];
    if(props.midiNoteInfo.length > 0) {
      // props.midiNoteInfo.map((midiNote) => {
      //   midiNoteTemp.push(JSON.stringify(midiNote))
      // })
      // console.log(props.midiNoteInfo)
    }
  }, [props.midiNoteInfo])

  return (
    <>
      <form 
      id='save-track-form'
      className='save-export'
      method='post'
      onSubmit={async (e: React.SyntheticEvent) => {
        console.log(JSON.stringify({...props.midiNoteInfo}));
        e.preventDefault();
        const target = e.target as typeof e.target & {
          trackname: {value: string};
        };
        const trackname: string = target.trackname.value;
        const url = `${process.env.REACT_APP_API}/save-track`
        const options = {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Origin-Allow': true,
          },
          username: props.username,
          trackname: trackname,
          midiNoteInfo: JSON.stringify({...props.midiNoteInfo}),
        };
        
        const track = await axios.post(url, options)
        .then((res) => {
          alert(`Successfully saved: \n   ${trackname}`)
        }).catch((err) => console.error(err));
        console.log(track)
      }}>
        <input ref={nameRef} type='trackname' name='trackname' onChange={(e) => props.setTrackName(e.target.value)}></input>
        <input type='submit' value='Save'></input>
        <button onClick={() => props.controlsDispatch({type: 'export', export: true})}>Export</button>
      </form>
    </>
    )
}

export default SaveExport;