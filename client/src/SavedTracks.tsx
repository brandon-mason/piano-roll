import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SavedTracksProps {

}

function SavedTracks(props: SavedTracksProps) {
  const [savedTrackNames, setSavedTrackNames] = useState<string[]>()
  useEffect(() => {
    async function getSavedTracks() {
      const url = 'http://localhost:3001/api/get-saved-tracks/'
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
        return res.data;
      }).catch((err) => console.error(err));
      setSavedTrackNames(trackNames);
      return savedTracks;
    }
  }, []);
  

  function changeSelected(e: React.ChangeEvent<HTMLSelectElement>) {

  }

  return <select onChange={(e) => changeSelected(e)}>

  </select>
}

export default SavedTracks;