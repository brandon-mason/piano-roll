import axios from 'axios';
import React, { useState, useEffect, useRef, ReactPortal } from 'react';
// import SavedTracks from '../SavedTracks/SavedTracks';
import { MidiNoteInfo } from '../../Tools/Interfaces';
// import  {DraggableNumber} from './libs/draggable-number'
import { createPortal } from 'react-dom';

interface SaveExportProps {
  midiNoteInfo: MidiNoteInfo[];
  midiNoteInfoLength: number;
  mode: string;
  selectorsRef: React.RefObject<HTMLDivElement>
  trackName: string;
  username: string;
  controlsDispatch: Function;
  setFocus: Function;
  setTrackName: Function
  setMidiNoteInfo: Function;
}

function SaveExport(props: SaveExportProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [trackNames, setTrackNames] = useState<string[]>([]);
  const [modal, setModal] = useState<ReactPortal | null>();

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
      // props.setMidiNoteInfo([]);
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
        if(nameRef.current) {
          nameRef.current.removeEventListener('focusin', props.setFocus(true))
          nameRef.current.removeEventListener('focusout', props.setFocus(false))
        }
      })
    }
  },[]);

  async function changeSelected(selectedTrack: string) {
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
        midiNoteInfo.push(midiNote[1]);
      })
      props.setMidiNoteInfo(midiNoteInfo);
    })
  }

  function overwrite(trackname: string, callback: Function) {
    if(trackNames.includes(trackname) && props.selectorsRef.current) {
      var picked = 'none';
      pickOverwrite();
      function pickOverwrite() {
        if(picked === 'none' && props.selectorsRef.current) {
          setModal(createPortal(<>
            <div id='popup-bg'></div>
            <div id='popup-select' className='popup select' style={{
                marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
                left: `${props.selectorsRef.current.offsetWidth / 2}px`,
                zIndex: 6
              }}>
              <button type='button' className='popup-button settings button' 
                onClick={() => {
                  picked = 'overwrite'; 
                  document.getElementById('popup-bg')!.classList.toggle('lift-out');
                  document.getElementById('popup-select')!.classList.toggle('lift-out');
                  setTimeout(() => setModal(null), 500);
                }}
              >Overwrite {trackname}?</button>
              <button type='button' className='popup-button settings button' 
                onClick={() => {
                  picked = 'dont'; 
                  document.getElementById('popup-bg')!.classList.toggle('lift-out');
                  document.getElementById('popup-select')!.classList.toggle('lift-out');
                  setTimeout(() => setModal(null), 500);
                }}
              >Don't Overwrite {trackname}</button>
            </div></>, props.selectorsRef.current)
          )
          setTimeout(pickOverwrite, 0)
        } else {
          if(picked === 'overwrite') {
            callback();
          } else if(picked === 'dont') {
            return;
          }
        }
      }
    } else {
      callback();
      setTrackNames((trackNames) => [trackname, ...trackNames])
    }
  }

  async function overwriteCB(trackname: string) {
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
      // TODO: Add Save Message
    }).catch((err) => console.error(err));
  }

  function deleteTrack(trackname: string, callback: Function) {
    if(trackNames.includes(trackname) && props.selectorsRef.current) {
      var picked = 'none';

      pickDelete();
      function pickDelete() {
        if(picked === 'none' && props.selectorsRef.current) {
          setModal(createPortal(<div id='popup'>
            <div id='popup-bg'></div>
            <div id='popup-select' className='popup select' style={{
              marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
              left: `${props.selectorsRef.current.offsetWidth / 2}px`,
              zIndex: 6
            }}>
              <button type='button' className='popup-button settings button' 
                onClick={() => {
                  picked = 'delete'; 
                  document.getElementById('popup-bg')!.classList.toggle('lift-out');
                  document.getElementById('popup-select')!.classList.toggle('lift-out');
                  setTimeout(() => setModal(null), 500)
                }}
              >Delete</button>
              <button type='button' className='popup-button settings button' 
                onClick={() => {
                  picked = 'dont'; 
                  document.getElementById('popup-bg')!.classList.toggle('lift-out');
                  document.getElementById('popup-select')!.classList.toggle('lift-out');
                  setTimeout(() => setModal(null), 500)
                }}
              >Don't Delete</button>
            </div></div>, props.selectorsRef.current)
          );
          setTimeout(pickDelete, 0);
        } else {
          if(picked === 'delete') {
            callback();
          } else if(picked === 'dont') {
            return;
          }
        }
      }
    }
  }

  async function deleteCB() {
    const url = `${process.env.REACT_APP_API}/delete-track`
    const options = {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Origin-Allow': true
      },
      data: {
        username: props.username,
        trackname: props.trackName
      }
    }

    axios.delete(url, options)
    .catch((err) => console.error(err));
  }

  function newTrack() {
    var picked = 'none';

    pickNew();
    function pickNew() {
      if(picked === 'none' && props.selectorsRef.current) {
        setModal(createPortal(<div id='popup'>
          <div id='popup-bg'></div>
          <div id='popup-select' className='popup select' style={{
            marginTop: `${props.selectorsRef.current.offsetHeight / 3}px`,
            left: `${props.selectorsRef.current.offsetWidth / 2}px`,
            zIndex: 6
          }}>
            <button type='button' className='popup-button settings button' 
              onClick={() => {
                picked = 'new'; 
                document.getElementById('popup-bg')!.classList.toggle('lift-out');
                document.getElementById('popup-select')!.classList.toggle('lift-out');
                setTimeout(() => setModal(null), 500)
              }}
            >Start New Track</button>
            <button type='button' className='popup-button settings button' 
              onClick={() => {
                picked = 'dont'; 
                document.getElementById('popup-bg')!.classList.toggle('lift-out');
                document.getElementById('popup-select')!.classList.toggle('lift-out');
                setTimeout(() => setModal(null), 500)
              }}
            >Don't Start New Track</button>
          </div></div>, props.selectorsRef.current)
        );
        setTimeout(pickNew, 0);
      } else {
        if(picked === 'new') {
          props.setMidiNoteInfo([]);
        } else if(picked === 'dont') {
          return;
        }
      }
    }
  }

  return (
    <>
    {modal}
    
    <button type='button' className='settings button'
      onClick={() => {
        deleteTrack(props.trackName, () => deleteCB())}}>Delete</button>
    <button type='button' className='settings button' 
      onClick={() => {
        if(props.midiNoteInfoLength > 0) newTrack()
        else props.setMidiNoteInfo([]);
      }}>New</button>
      <form 
      ref={formRef}
      id='save-track-form'
      className='save-export'
      method='post'
      onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
          trackname: {value: string};
        };
        const trackname: string = target.trackname.value;
        overwrite(trackname, () => overwriteCB(trackname));
      }}>
        <input ref={nameRef} type='trackname' name='trackname' className='settings input' list='track-names' onChange={(e) => {props.setTrackName(e.target.value)}}></input>
          <datalist id="track-names">
            {trackNames.map((track) => {
              return <option key={track}>{track}</option>
            })}
          </datalist>
        <button type='button' className='settings button' onClick={() => changeSelected(props.trackName)}>Load</button>
        <input type='submit' className='settings button' value='Save'></input>
        <button type='button' className='settings button' onClick={() => props.controlsDispatch({type: 'export', export: true})}>Export</button>
      </form>
    </>
    )
}

export default SaveExport;