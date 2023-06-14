import { FetchedSounds, KeysPressed, PrevNotes } from "../../Tools/Interfaces";
import { Howl, Howler } from 'howler';

// Plays notes from keystrokes and playback. 
export const playNote = (output: KeysPressed, prevNotes: PrevNotes, qwertyNote: any, octaveMinMax: number[], fetchedSounds: FetchedSounds, volume: string) => {
  let prevNotesTemp: PrevNotes = {...prevNotes};

  console.log(prevNotes)
  Object.keys(output).forEach((noteOct) => {
    let noteName: string;
    let key = output[noteOct].key;
    let note = noteOct.replace(/[0-9]/g, ''); // Replaces all numbers 0-9 in noteOct with an empty string.
    let octave = parseInt(noteOct.replace(/\D/g,'')); // Replaces all letters Aa-Zz in noteOct with an empty string.
    
    if(Object.keys(qwertyNote).includes(key) && octave < octaveMinMax[1] && fetchedSounds[octave][volume]) {
      let labelElem: HTMLElement | null = null;
      (note.includes('#')) ? noteName = note.replace('#', 'sharp') + (octave) : noteName = note.replace('b', 'flat') + (octave);
      (document.getElementById(noteName.toLowerCase() + '-label')) ? labelElem = document.getElementById(noteName.toLowerCase() + '-label') : null;

      if(output[noteOct].pressed && (!prevNotesTemp[noteName] || prevNotesTemp[noteName] === 0) && labelElem) { // For pressed keys.
        let sound = fetchedSounds[octave][volume];
        let soundID = sound.play(note); // Plays note and stores the note ID in the soundId variable
        labelElem.classList.toggle('active'); // Toggles the 'active' class which lights up whatever keys are currently playing.
        prevNotesTemp[noteName] = soundID; // Stores the soundID variable in prevNotesTemp with noteName as its key.
      } else if(!output[noteOct].pressed && prevNotes[noteName as keyof typeof prevNotes] > 0 && labelElem) { // For unpressed keys.
        if(Object.keys(prevNotes).some((playedNote) => playedNote === noteName)) { // Checks that a note exists in prevNotes that matches noteName
          labelElem.classList.toggle('active');
          fetchedSounds[octave][volume].fade(.5, 0, 300, prevNotes[noteName]); // Fades out whatever notes are being unpressed.
        }

        delete prevNotesTemp[noteName]; // Resets prevNotesTemp key for notes that have been unpressed.
      }
    }
  })
  return prevNotesTemp;
}

const loadSound = (url: string) => {
  return new Howl({
    src: [url + '.webm', url + 'mp3'],
    sprite: {
      C: [0, 4999],
      'C#': [5000, 4999],
      D: [10000, 4999],
      Eb: [15000, 4999],
      E: [20000, 4999],
      F: [25000, 4999],
      'F#': [30000, 4999],
      G: [35000, 4999],
      'G#': [40000, 4999],
      A: [45000, 4999],
      Bb: [50000, 4999],
      B: [55000, 5000],
    },
    volume: .5,
  });
}

export const setView = (toFetch: number[], fetchedSounds: FetchedSounds, octaveMinMax: number[], sound: string, volume: string) => {
  let notFetched: number[] = [];
  let fetched: FetchedSounds = {...fetchedSounds};

  if(octaveMinMax[0] !== octaveMinMax[1]) {
    for(let i = 0; i < toFetch.length; i++) {
      let url = `${process.env.REACT_APP_SERVER}/sounds/Instruments/${sound}/${toFetch[i]}/${volume}`;

      if(!(toFetch[i] in fetched)) {
        notFetched.push(toFetch[i]);
      } else if(!(volume in fetched[toFetch[i]])) {
        notFetched.push(toFetch[i]);
      }

      if(notFetched.length > 0) {
        fetched = {...fetched, [toFetch[i]]: {[volume]: loadSound(url)}};
      }
    }
    
    return fetched;
  }
  return {};
}