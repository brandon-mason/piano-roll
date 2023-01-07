import React, { useEffect } from 'react';

interface TimerButtonProps {
  metPlay: boolean;
  metronome: string
  mode: string;
  pulseNum: number;
  midiDispatch: Function;
}

function TimerButtons(props: TimerButtonProps) {
  useEffect(() => {
    // console.log(props.metPlay)
  }, [props.metPlay])

  const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
  const playingClassName = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
  const metronomeClassName = `metronome-button${props.metronome === 'on' ? ' active' : ''}`;
  return (
    <>
<<<<<<< HEAD
      <button type='button' className='stop-button' onClick={() => {props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard'}); setTimeout(() => props.midiDispatch({type: 'mode', mode: 'keyboard'}))}}>■</button>
      <button type='button' className={recordingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'})}>●</button>
      <button type='button' className={playingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard'})}>▶</button>
      <button type='button' className={metronomeClassName} onClick={() => {props.midiDispatch({type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on'})}} >{(props.metPlay) ? '○●' : '●○'}</button>
    </>
  )
}
import React, { useEffect } from 'react';

interface TimerButtonProps {
  metPlay: boolean;
  metronome: string
  mode: string;
  pulseNum: number;
  midiDispatch: Function;
}

function TimerButtons(props: TimerButtonProps) {
  useEffect(() => {
    // console.log(props.metPlay)
  }, [props.metPlay])

  const recordingClassName = `recording-button${(props.mode === 'recording') ? ' active' : ''}`;
  const playingClassName = `playing-button${(props.mode === 'playing') ? ' active' : ''}`;
  const metronomeClassName = `metronome-button${props.metronome === 'on' ? ' active' : ''}`;
  return (
    <>
      <button type='button' className='stop-button' onClick={() => props.midiDispatch({type: 'mode', mode: 'stop'})}>■</button>
=======
      <button type='button' className='stop-button' onClick={() => {props.midiDispatch({type: 'mode', mode: 'stop'}); props.midiDispatch({type: 'mode', mode: 'keyboard'})}}>■</button>
>>>>>>> 71ede2b (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
      <button type='button' className={recordingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'})}>●</button>
      <button type='button' className={playingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard'})}>▶</button>
      <button type='button' className={metronomeClassName} onClick={() => {props.midiDispatch({type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on'})}} >{(props.metPlay) ? '○●' : '●○'}</button>
    </>
  )
}

export default TimerButtons;