import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Settings.css';
import { MidiNoteInfo } from '../Tools/Interfaces';

interface SavedTracksProps {
  midiNoteInfoLength: number;
  username: string;
  setMidiNoteInfo: Function;
}

function SavedTracks(props: SavedTracksProps) {
  const [trackNames, setTrackNames] = useState<string[]>([])
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

  async function changeSelected(selectedTrack: string) {
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
      console.log(res.data);
      Object.entries(res.data).forEach((midiNote: any) => {
        midiNoteInfo.push(midiNote[1])
      })
      props.setMidiNoteInfo(midiNoteInfo);
    })
  }

  return (
    <>
      <button onClick={() => {
        if(props.midiNoteInfoLength > 0) alert()
        props.setMidiNoteInfo([]);
        }}>New</button>
      <select id='track-names' className='save-export' onChange={(e) => changeSelected(e.target.value)}>
        {trackNames.map((track) => {
          return <option key={track}>{track}</option>
        })}
      </select>
    </>
  )
}

export default SavedTracks;