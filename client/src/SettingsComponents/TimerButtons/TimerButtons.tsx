import React, { useEffect } from 'react';
import { FaStop, FaCircle, FaRegCircle, FaPlay, FaPause } from 'react-icons/fa'

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

  const recordingClassName = `playback-button recording-button${(props.mode === 'recording') ? ' active' : ''}`;
  const playingClassName = `playback-button playing-button${(props.mode === 'playing') ? ' active' : ''}`;
  const metronomeClassName = `playback-button metronome-button${props.metronome === 'on' ? ' active' : ''}`;
  return (
    <>
      <button type='button' className='playback-button stop-button' onClick={() => {props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'stop' : 'keyboard'}); setTimeout(() => props.midiDispatch({type: 'mode', mode: 'keyboard'}))}}><FaStop style={{verticalAlign: 'middle'}} /></button>
      <button type='button' className={recordingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'recording' : 'keyboard'})}><FaCircle style={{verticalAlign: 'middle'}} /></button>
      <button type='button' className={playingClassName} onClick={() => props.midiDispatch({type: 'mode', mode: (props.mode === 'keyboard') ? 'playing' : 'keyboard'})}><FaPlay style={{verticalAlign: 'middle'}} /></button>
      <button type='button' className={metronomeClassName} onClick={() => {props.midiDispatch({type: 'metronome', metronome: (props.metronome === 'on') ? 'off' : 'on'})}} >{(props.metPlay) ? <><FaRegCircle style={{verticalAlign: 'middle'}} /><FaCircle style={{verticalAlign: 'middle'}} /></> : <><FaCircle style={{verticalAlign: 'middle'}} /><FaRegCircle style={{verticalAlign: 'middle'}} /></>}</button>
    </>
  )
}

export default TimerButtons;