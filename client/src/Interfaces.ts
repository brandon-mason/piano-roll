// Universal interfaces (2)
export interface QwertyNote {
  key: string;
  note: string;
  altNote?: string,
  octave: number;
}

export interface KeysPressed {
  [key: string]: {
    octave: number;
    pressed: boolean;
    time: number;
  };
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
  numMeasures: number;
  subdiv: number;
  bpm: number;
  mode: string;
}

export interface MidiAction {
  type: string;
  numMeasures?: number;
  subdiv?: number;
  bpm?: number;
  mode?: string;
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
  midiDispatch: Function;
}

//Key-Note-Input.tsx interfaces (1)
export interface KeyNoteInputProps {
  octave: number;
  onNotePlayed: Function;
  pianoRollKey: any[] | null;
}

//Timer.tsx interfaces (1)
export interface TimerProps {
  mode: string;
  bpm: number;
  midiLength: number;
  time: number;
  pulseNum: number;
  handleSetTime: Function;
  handleSetPulseNum: Function;
  midiDispatch: React.Dispatch<any>
}

//MidiRecorder.tsx interfaces (3)
export interface MidiRecord {
  [time: number]: KeysPressed;
}

export interface MidiRecorderProps {
  soundDetails: {
    [key: string]: {
      fileName: string;
      displayName: string;
    }
  }
  soundState: {
    sound: any;
    octave: number;
    volume: string;
  };
  midiState: {
    numMeasures: any;
    subdiv: number;
    bpm: number;
    mode: string;
  }
  keysPressed: KeysPressed;
  time: number;
  handlePlayback: Function;
  soundDispatch: React.Dispatch<any>;
  midiDispatch: React.Dispatch<any>;
}

export interface obj {
  [time: number]: KeysPressed;
}

// Piano.tsx interfaces (5)

export interface OctavesInViewProps {
  octaveMax: number;
  labelsRef: React.RefObject<HTMLDivElement>;
  octave: number;
  handleViewChange: Function;
}

export interface PianoProps {
  soundDetails: Object;
  sound: string;
  octave: number;
  volume: string;
  mode: string;
  keysPressed: KeysPressed;
  pianoRollKey: any[];
  playback: KeysPressed;
  labelsRef: React.RefObject<HTMLDivElement>;
}

export interface Keys {
  octave: number;
  pressed: boolean;
  pianoRoll: boolean;
}

export interface FetchedSounds {
  [octaves: number]: {
    [volume: string]: any;
  };
}

export interface PrevNotes {
  [note: string]: number;
}

// PianoRoll.tsx interfaces ()
export interface KeyProps {
  key: string;
  qwertyKey: string;
  note: string;
  altNote: string;
  octave: number;
  handleNotePlayed: Function;
}

export interface NoteLabelsProps {
  octaveArray: string[];
  octave: number;
  labelsRef: React.RefObject<HTMLDivElement>;
  handleNotePlayed: Function
}

export interface PianoRollProps {
  soundDetails: Object;
  time: number;
  midiLength: number;
  playback: KeysPressed;
  sound: string
  octave: number;
  numMeasures: number;
  subdiv: number;
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
  octaveArray: string[];
  numMeasures: number;
  subdiv: number;
}