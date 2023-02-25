import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Stack, Tooltip, useDisclosure, useRadio, useRadioGroup, useToast } from '@chakra-ui/react';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { FaEraser, FaRedo, FaSignature, FaUndo } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import SignatureCanvas from 'react-signature-canvas';
import { Layer, Stage } from 'react-konva';
import { useStateContext } from '../../context/ContextProvider';
import URLImage from '../../components/konva-components/URLImage';
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ImPencil2 } from 'react-icons/im';
import { GrClearOption } from 'react-icons/gr';



const reducerPenWidth = (state, action) => {
  switch (action.type) {
    case "INCREASE":
      return state < 15 ? state + 1 : state;
    case "DECREASE":
      return state > 1 ? state - 1 : state;
    default:
      return 10;
  }
};

const penColorsList = [
  { key: 1, name: "blackAlpha", hex: "#000000" },
  { key: 2, name: "blue", hex: "#4239ff" },
  { key: 3, name: "red", hex: "#ff4239" },
  { key: 4, name: "green", hex: "#24cd75" },
];




export const SignaturePad = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signatures, setSignatures, activePage } = useStateContext();
  const signatureCanvasRef = useRef();
  const [penWidth, dispatchPW] = useReducer(reducerPenWidth, 8);
  const [penColor, setPenColor] = useState("#000000");
  const toast = useToast();

  const onModalClose = () => {
    onClose();
  }
  const handleCreateSignature = async () => {
    const paths = await signatureCanvasRef.current.exportPaths();
    if(paths.length) {
      const imgData = await signatureCanvasRef.current.exportImage("svg");
      const item = {
        _id: signatures.length + 1,
        page: activePage,
        imageData: imgData,
        x: 100, 
        y: 100,
        width: 192, height: 108
      };
      setSignatures(prev => [...prev, item]);
      onModalClose();
    } else {
      toast({
        title: "Draw First",
        status: "error",
        isClosable: true,
      });
    }
  }

  return (
    <div>
      <Tooltip label="Signature Pad">
        <Button colorScheme='orange' variant="outline" size='xs' onClick={onOpen}><FaSignature /></Button>
      </Tooltip>
      <Modal isOpen={isOpen} size="3xl" onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Draw Your Signature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='flex flex-col gap-2'>
              <div>
                <ReactSketchCanvas
                  className='bg-neutral-200 mb-4'
                  height={280}
                  ref={signatureCanvasRef}
                  strokeWidth={penWidth}
                  strokeColor={penColor}
                  canvasColor="#00000000"
                />
              </div>
              <div className='flex flex-wrap gap-3 justify-between w-full'>
                <div className="flex flex-wrap gap-3">
                  <Tooltip label="Pen Width">
                    <div>
                      <Button colorScheme='blue' size="sm" roundedLeft="lg" padding={1} roundedRight="none" onClick={() => dispatchPW({ type: "INCREASE" })}>
                        <AiOutlinePlus />
                      </Button>
                      <Button colorScheme='gray' size="sm" rounded="none">
                        {penWidth}
                      </Button>
                      <Button colorScheme='gray' size="sm" variant="outline" roundedRight="lg" padding={1} roundedLeft="none" onClick={() => dispatchPW({ type: "DECREASE" })}>
                        <AiOutlineMinus />
                      </Button>
                    </div>
                  </Tooltip>
                  <div>
                    <Stack direction="row">
                      {penColorsList.map(item => (
                        <Button
                          size="sm"
                          className={`p-1 rounded-full w-8 h-8 flex align-middle justify-center`}
                          style={{ backgroundColor: penColor !== item.hex ? item.hex+30 : item.hex, border: `3px solid ${item.hex}` }}
                          onClick={() => {
                            setPenColor(item.hex);
                            signatureCanvasRef.current.eraseMode(false);
                          }}
                          rounded="full"
                        >
                          {/* <Radio 
                            key={item.key} size='lg' colorScheme={item.name} 
                            onClick={() => setPenColor(item.hex)} 
                            style={{ border: `3px solid ${item.hex}` }} 
                            _Checked={{ background: item.hex }}
                            isChecked={penColor === item.hex} /> */}
                        </Button>
                      ))}
                    </Stack>
                  </div>
                  <Tooltip label="Click to Draw">
                    <Button size="sm" onClick={() => signatureCanvasRef.current.eraseMode(false)}><ImPencil2 /></Button>
                  </Tooltip>
                  <Tooltip label="Eraser">
                    <Button size="sm" onClick={() => signatureCanvasRef.current.eraseMode(true)}><FaEraser /></Button>
                  </Tooltip>
                  <Tooltip label="Undo">
                    <Button size="sm" onClick={() => signatureCanvasRef.current.undo()}><FaUndo /></Button>
                  </Tooltip>
                  <Tooltip label="Redo">
                    <Button size="sm" onClick={() => signatureCanvasRef.current.redo()}><FaRedo /></Button>
                  </Tooltip>
                  <Tooltip label="Reset Canvas">
                    <Button size="sm" onClick={() => signatureCanvasRef.current.resetCanvas()}><GrClearOption className='mr-1' />Clear</Button>
                  </Tooltip>
                  {/* <Button colorScheme='gray' size="sm" ml={3} onClick={clear}>
                    Clear
                  </Button> */}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' size="md" mr={3} onClick={handleCreateSignature}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}


export const Signatures = ({ pageNumber, stageProps }) => {
  const { signatures, setSignatures } = useStateContext();
  const [selectedId, selectShape] = React.useState(null);


  const handleDragEnd = (e) => {
    const updatedSignatures = signatures?.map(item => {
      if(item._id === e.target.attrs._id) {
        item = {...item, ...e.target.attrs}
      }
      return item;
    });
    setSignatures(updatedSignatures);
  }

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };


  return (
    <Stage
      {...stageProps}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {
          signatures?.map((item, i) => {
            if(pageNumber === item.page) {
              // return <Text key={item.key} x={200} y={200} text={"SIGNATURE " + item.key} draggable fontSize={22} />
              return (
                <URLImage 
                  key={item._id} 
                  _id={item._id}
                  src={item.imageData}
                  shapeProps={{
                    // x: item.x,
                    // y: item.y,
                    // width: item.width,
                    // height: item.height,
                    // rotation: item.rotation,
                    ...item,
                    draggable: true,
                    onDragEnd: (e) => handleDragEnd(e),
                  }}

                  isSelected={item._id === selectedId}
                  onSelect={() => selectShape(item._id)}
                  onChange={(newAttrs) => {
                    const rects = signatures.slice();
                    rects[i] = {...rects[i], ...newAttrs};
                    setSignatures(rects);
                  }}
                />
              )
            }
          })
        }
      </Layer>
    </Stage>
  )
}
