import React, { useCallback, useEffect, useState } from 'react';
import '../../SettingsComponents/Settings.css';

interface DragLabelProps {
  style: {};
  plane: string;
  range: number[];
  text: React.ReactNode;
  value: number;
  setValue: Function;
}

function DragLabel(props: DragLabelProps) {
  const [origVal, setOrigVal] = useState(props.value);
  const [startVal, setStartVal] = useState(0);

  const onStart = useCallback((e: any) => {
    (props.plane === 'y') ? setStartVal(e.clientY) : setStartVal(e.clientX);
    setOrigVal(props.value);
  }, [props.value])

  useEffect(() => {
    function onUpdate(e: MouseEvent) {
      if(startVal) {
        if(props.plane === 'y') {
          if(startVal - e.clientY + origVal > props.range[0] && startVal - e.clientY + origVal < props.range[1]) props.setValue(startVal - e.clientY + origVal);
        } else {
          if(startVal - e.clientX + origVal > props.range[0] && startVal - e.clientX + origVal < props.range[1]) props.setValue(startVal - e.clientX + origVal);
        }
      }
    }

    function onEnd() {
      setStartVal(0);
    }

    document.addEventListener('mousemove', onUpdate);
    document.addEventListener('mouseup', onEnd);
    return () => {
      document.removeEventListener('mousemove', onUpdate);
      document.removeEventListener('mouseup', onEnd);
    }
  }, [origVal, props.setValue, startVal]);
  return (
    <span
      className='click-drag'
      style={props.style}
      onMouseDown={onStart}
    >
      {props.text}
    </span>
  )
}

export default DragLabel;