import { DetailedReactHTMLElement, HTMLAttributes, ReactElement, ReactPortal } from "react";

// Universal interfaces (2)
export interface QwertyNote {
  key: string;
  note: string;
  altNote?: string,
  octave: number;
}

export interface QwertyNoteObj {
  [key: string]: {
    note: string;
    altNote?: string,
    octave: number;
  }
}

export interface KeyPressed {
  key?: string
  pressed: boolean;
<<<<<<< HEAD
  start: number;
  end: number;
=======
  start?: number;
  end?: number;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
}

export interface KeysPressed {
  [note: string]: KeyPressed;
};

// App.tsx interfaces (7)
export interface Reducer<State, Action> {
  (state: State, action: Action): State;
}

export interface SoundState {
  sound: string;
  octave: number;
  volume: string;
};

export interface SoundAction {
  type: string;
  sound?: string;
  octave?: number;
  volume?: string;
}

export interface MidiState {
  bpm: number;
  metronome: string;
  mode: string;
  numMeasures: number;
  ppq: number;
  subdiv: number;
}

export interface MidiAction {
  type: string;
  bpm?: number;
<<<<<<< HEAD
  mode: string;
=======
  mode?: string;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  numMeasures?: number;
  ppq?: number;
  subdiv?: number;
}

export interface ControlsState {
<<<<<<< HEAD
  export: boolean;
=======
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  undo: boolean;
}

export interface ControlsAction {
  type: string;
<<<<<<< HEAD
  export: boolean;
  undo?: boolean;
=======
  undo: boolean;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
}

export interface Midi {
  [time: number]: KeysPressed;
}

// Sound-Settings.tsx interfaces (2)
export interface SoundSettingsProps {
  soundDetails: {
    [sound: string]: {
      [octave: string]: string[]
    }
  };
  sound: string;
  octave: number;
  volume: string;
  pianoDispatch: Function;
}

export interface IOctavesObj {
  [octave: number]: string[];
}

// Midi-Settings.tsx interfaces (1)
export interface MidiSettingsProps {
  soundDetails: Object;
  numMeasures: number;
  subdiv: number;
  bpm: number;
  mode: string;
  controlsDispatch: Function;
  midiDispatch: Function;
}

//Key-Note-Input.tsx interfaces (1)
export interface KeyNoteInputProps {
  octave: number;
  pianoRollKey: any[] | null;
  pulseNum: number;
  onControlsPressed: Function;
  onNotePlayed: Function;
}

//Timer.tsx interfaces (1)
export interface MetronomeProps {
  metronome: string;
  midiLength: number;
  mode: string;
  ppq: number;
  pulseNum: number;
  pulseRate: number;
  handleMetPlay: Function;
}

export interface TimerProps {
  bpm: number;
  mode: string;
  metronome: string;
  midiLength: number;
  ppq: number;
  pulseNum: number;
  pulseRate: number;
  time: number;
  timerRef: React.RefObject<any>;
  handleSetTime: Function;
  handleSetPulseNum: Function;
  handleMetPlay: Function;
}

//MidiRecorder.tsx interfaces (3)
export interface MidiRecorded {
<<<<<<< HEAD
<<<<<<< HEAD
  [pulse: string]: KeysPressed;
=======
  [pulse: number]: KeysPressed;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
=======
  [pulse: string]: KeysPressed;
>>>>>>> 7a3005d (fix(client): Recordings that overlap now play together both while recording and while playing back.)
}

export interface MidiRecorderProps {
  soundDetails: {
    [key: string]: {
      fileName: string;
      displayName: string;
    }
  };
  controlsState: ControlsState;
  midiState: MidiState;
  keysPressed: KeysPressed;
  midiLength: number;
  noteTracks: HTMLCollection | null;
  pulseNum: number;
  pulseRate: number
  noteTracksRef: React.RefObject<HTMLDivElement>;
  controlsDispatch: React.Dispatch<any>;
  midiDispatch: React.Dispatch<any>;
  setPlayback: Function;
<<<<<<< HEAD
=======
  soundDispatch: React.Dispatch<any>;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
}

// Piano.tsx interfaces (5)

export interface OctavesInViewProps {
  octaveMax: number;
  labelsRef: React.RefObject<HTMLDivElement>;
  octave: number;
  handleViewChange: Function;
}

export interface PianoProps {
<<<<<<< HEAD
<<<<<<< HEAD
  pulseNum: number;
=======
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
=======
  pulseNum: number;
>>>>>>> 1f2d55c (backup before refactoring)
  keysPressed: KeysPressed;
  labelsRef: React.RefObject<HTMLDivElement>;
  mode: string;
  octave: number;
  octaveMinMax: number[];
<<<<<<< HEAD
  playback: MidiRecorded;
=======
  playback: KeysPressed;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  sound: string;
  soundDetails: Object;
  volume: string;
}

export interface Keys {
  octave: number;
  pianoRoll: boolean;
  pressed: boolean;
}

export interface FetchedSounds {
<<<<<<< HEAD
<<<<<<< HEAD
  [octaves: string]: {
=======
  [octaves: number]: {
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
=======
  [octaves: string]: {
>>>>>>> 7a3005d (fix(client): Recordings that overlap now play together both while recording and while playing back.)
    [volume: string]: any;
  };
}

export interface PrevNotes {
  [note: string]: number;
}

// PianoRoll.tsx interfaces ()
export interface KeyProps {
  altNote: string;
  key: string;
  note: string;
  octave: number;
  qwertyKey: string;
}

export interface NoteLabelsProps {
  labelsRef: React.RefObject<HTMLDivElement>;
  octaveArray: number[];
  octave: number;
}

export interface PianoRollProps {
  midiLength: number;
  noteTracksRef: React.RefObject<HTMLDivElement>;
  numMeasures: number;
  pulseNum: number
  pulseRate: number
  octave: number;
  sound: string
  soundDetails: Object;
  subdiv: number;
  time: number;
  labelsRef: React.RefObject<HTMLDivElement>;
  handleNotePlayed: Function;
}

// Grid.tsx 
export interface NoteTrackProps {
  key: string;
  note: string;
  octave: number;
  subdiv: number;
}

export interface GridProps {
  octaveArray: number[];
  midiLength: number;
  numMeasures: number;
  pulseNum: number;
  pulseRate: number;
  subdiv: number;
  noteTracksRef: React.RefObject<HTMLDivElement>;
  setNoteTracks: Function;
}

// MidiNotes.tsx interfaces
export interface MidiNoteInfo {
  [noteStart: string]: {
    key: string;
<<<<<<< HEAD
    keyPressed: KeyPressed;
=======
    keyPressed?: KeyPressed;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
    noteTrackId: string;
    noteTracksRef: React.RefObject<HTMLDivElement>;
    props: {
      id: string;
      className: string;
      style?: {
        marginLeft?: string;
        width: string;
        height: string;
      }
    }
  };
}

// export interface MidiNotesProps {
//   controlsState: ControlsState;
//   keysPressed: KeysPressed;
//   midiLength: number;
//   midiRecord: MidiRecord;
//   midiState: MidiState;
//   pulseNum: number;
//   pulseRate: number;
//   noteTracksRef: React.RefObject<HTMLDivElement>;
//   subdiv: number;
//   controlsDispatch: React.Dispatch<any>;
//   onNoteClicked: Function;
//   onNoteRemoved: Function;
// }

export interface MidiNotes {
  [id: string]: ReactElement;
}

export interface Widths {
  [noteStart: string]: {
    start: number;
<<<<<<< HEAD
    end: number;
=======
    end?: number;
>>>>>>> bbc93c9 (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
  };
}

export interface MidiNotePortals {
  [noteTracks: string]: ReactPortal;
}

export interface NoteTrackChilds {
  [noteTrackId: string]: DetailedReactHTMLElement<HTMLAttributes<HTMLElement>, HTMLElement>[]
}

export interface NotesRemoved {
  [remIndex: number]: MidiNoteInfo;
  
}