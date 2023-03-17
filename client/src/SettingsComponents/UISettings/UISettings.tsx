import React from 'react';
import { FaArrowsAltH, FaArrowsAltV} from 'react-icons/fa';
import DragLabel from '../../Tools/DragLabel/DragLabel';

interface UISettingsProps {
  gridSize: number[];
  setXGridSize: Function;
  setYGridSize: Function;
}

function UISettings(props: UISettingsProps) {
  return (
    <>
      <DragLabel plane='x' range={[-30, 279]} style={{cursor: 'ew-resize', userSelect: 'none'}} text={<><FaArrowsAltH style={{verticalAlign: 'middle'}} /> width</>} value={props.gridSize[0]} setValue={(size: number) => { props.setXGridSize(size)}} />
      <DragLabel plane='y' range={[0, 200]} style={{cursor: 'ns-resize', userSelect: 'none'}} text={<><FaArrowsAltV style={{verticalAlign: 'middle'}} />height</>} value={props.gridSize[1]} setValue={(size: number) => { props.setYGridSize(size)}} />
    </>
  )
}

export default UISettings;