import axios from 'axios';
import React, { useState, useEffect, useRef, ReactPortal } from 'react';
import SavedTracks from './SavedTracks';
import { MidiNoteInfo, MidiSettingsProps } from '../Tools/Interfaces';
import Popup from 'reactjs-popup';
// import  {DraggableNumber} from './libs/draggable-number'
import './Settings.css';
import { createPortal } from 'react-dom';

interface SaveExportProps {
  midiNoteInfo: MidiNoteInfo[];
  midiNoteInfoLength: number;
  mode: string;
  selectorsRef: React.RefObject<HTMLDivElement>
  username: string;
  controlsDispatch: Function;
  setFocus: Function;
  setTrackName: Function
  setMidiNoteInfo: Function;
}

function SaveExport(props: SaveExportProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const [selectedTrack, setSelectedTrack] = useState('');
  const [trackNames, setTrackNames] = useState<string[]>([]);
  const [overwritePopup, setOverwritePopup] = useState<ReactPortal | null>();

  useEffect(() => {
    async function getSavedTracks() {
      const url = `${process.env.REACT_APP_API}/get-saved-tracks/${props.username}`
      const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': true,
        },
      }
      var trackNames: string[] = []
      const savedTracks = await axios.get(url, options)
      .then((res) => {
        trackNames = res.data;
        setTrackNames(trackNames);
        return res.data;
      }).catch((err) => console.error(err));
      return savedTracks;
    }
    if(props.username.length > 0) getSavedTracks();
    if(props.username.length === 0) {
      props.setMidiNoteInfo([]);
      setTrackNames([]);
    }

  }, [props.username]);

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

  async function changeSelected() {
    if(!trackNames.includes(selectedTrack)) return;
    const url = `${process.env.REACT_APP_API}/get-track/${props.username}/${selectedTrack}`
    const options = {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Origin-Allow': true
      },
    }

    var midiNoteInfo: MidiNoteInfo[] = [];
    const track = axios.get(url, options)
    .then((res) => {
      Object.entries(res.data).forEach((midiNote: any) => {
        midiNoteInfo.push(midiNote[1])
      })
      props.setMidiNoteInfo(midiNoteInfo);
    })
  }

  function submit(trackname: string, callback: Function) {
    console.log(trackNames.includes(trackname) && props.selectorsRef.current);
    if(trackNames.includes(trackname) && props.selectorsRef.current) {
      var over = 0;
      pickOverwrite();
      function pickOverwrite() {
        if(over === 0 && props.selectorsRef.current) {
          setOverwritePopup(createPortal(
            <div id='overwrite-modal' style={{
                top: `${props.selectorsRef.current.offsetHeight}px`,
                left: `${props.selectorsRef.current.offsetWidth / 2}px`,
              }}>
              <button className='overwrite-button' onClick={() => {over = 1; setOverwritePopup(null)}}>Overwrite {trackname}?</button>
              <button className='overwrite-button' onClick={() => {over = 2; setOverwritePopup(null)}}>Don't overwrite {trackname}</button>
            </div>, document.body))
            setTimeout(pickOverwrite, 0)
        } else {
          console.log('callback');
          if(over === 1) {
            callback();
          } else if(over === 2) {
            return;
          }
          
        }
      }
    } else {
      callback();
      setTrackNames((trackNames) => [trackname, ...trackNames])
    }
  }

  async function overwrite(trackname: string) {
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
      alert('savve')
    }).catch((err) => console.error(err));
    console.log(track)
  }

  return (
    <>
    {overwritePopup}
    <button onClick={() => {
        if(props.midiNoteInfoLength > 0) alert()
        props.setMidiNoteInfo([]);
        }}>New</button>
      {/* <select id='track-names' className='save-export' onChange={(e) => changeSelected(e.target.value)}>
        {trackNames.map((track) => {
          return <option key={track}>{track}</option>
        })}
      </select> */}
      <form
      id='save-track-form'
      className='save-export'
      method='post'
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          trackname: {value: string};
        };
        const trackname: string = target.trackname.value;
        submit(trackname, () => {
          overwrite(trackname)
        });
      }}>
        <input ref={nameRef} type='trackname' name='trackname' list='track-names' onChange={(e) => {props.setTrackName(e.target.value); setSelectedTrack(e.target.value)}}></input>
          <datalist id="track-names">
            {trackNames.map((track) => {
              return <option key={track}>{track}</option>
            })}
          </datalist>
        <button type='button' id='load' onClick={() => changeSelected()}>Load</button>
        <input type='submit' value='Save'></input>
        <button onClick={() => props.controlsDispatch({type: 'export', export: true})}>Export</button>
      </form>
    </>
    )
}

export default SaveExport;