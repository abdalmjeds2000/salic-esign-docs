import React from 'react'
import { createPortal } from 'react-dom';
import { useStateContext } from '../../context/ContextProvider';
const ContextMenu = ({ id }) => {
  const { signatures } = useStateContext();

  const signData = signatures.filter(item => item._id === id)[0];

  const shapeX = signData?.x + (signData?.width * signData?.scaleX) || 0 || 0;
  const shapeY = signData?.y || 0;
  console.log(shapeX, shapeY);

  return createPortal(
    <div className='absolute bg-red-600 z-50' style={{ left: shapeX, top: shapeY }}>
      HELLOOOOOOOOOOOOOOOO ({id})
    </div>,
    document.getElementById("portals-content")
  );
}

export default ContextMenu