import React, { useEffect, useRef } from 'react';
import { FaArrowsAltH, FaArrowsAltV} from 'react-icons/fa';
import DragLabel from '../Tools/DragLabel';

interface UISettingsProps {
  gridSize: number[];
  setXGridSize: Function;
  setYGridSize: Function;
}

function UISettings(props: UISettingsProps) {
  const xGridSliderRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if(xGridSliderRef.current) props.setXGridSize(parseInt(xGridSliderRef.current.value));
  // }, [xGridSliderRef.current]);

  // if(xGridSliderRef.current) {
  //   xGridSliderRef.current.oninput = () => {
  //     console.log(xGridSliderRef.current!.value)
  //     props.setXGridSize(parseInt(xGridSliderRef.current!.value));
  //   }
  // }

  return (
    <>
      <DragLabel plane='x' range={[-30, 279]} style={{cursor: 'ew-resize', userSelect: 'none'}} text={<><FaArrowsAltH style={{verticalAlign: 'middle'}} /> width</>} value={props.gridSize[0]} setValue={(size: number) => { props.setXGridSize(size)}} />
      <DragLabel plane='y' range={[0, 200]} style={{cursor: 'ns-resize', userSelect: 'none'}} text={<><FaArrowsAltV style={{verticalAlign: 'middle'}} />height</>} value={props.gridSize[1]} setValue={(size: number) => { props.setYGridSize(size)}} />
      {/* <input type='range' ref={xGridSliderRef} min='-50' max='50' defaultValue='0' className='slider' id='x-grid-size'></input> */}
    </>
  )
}

export default UISettings;