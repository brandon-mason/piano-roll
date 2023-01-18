import React, { useEffect, useRef } from 'react';

interface UISettingsProps {
  setXGridSize: Function;
}

function UISettings(props: UISettingsProps) {
  const xGridSliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(xGridSliderRef.current) props.setXGridSize(parseInt(xGridSliderRef.current.value));
  }, [xGridSliderRef.current]);

  if(xGridSliderRef.current) {
    xGridSliderRef.current.oninput = () => {
      console.log(xGridSliderRef.current!.value)
      props.setXGridSize(parseInt(xGridSliderRef.current!.value));
    }
  }

  return (
    <input type='range' ref={xGridSliderRef} min='-50' max='50' defaultValue='0' className='slider' id='x-grid-size'></input>
  )
}

export default UISettings;