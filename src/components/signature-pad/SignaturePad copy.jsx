import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Stack, Tooltip, useDisclosure, useRadio, useRadioGroup, useToast } from '@chakra-ui/react';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { FaSignature } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import SignatureCanvas from 'react-signature-canvas';
import { Layer, Stage } from 'react-konva';
import { useStateContext } from '../../context/ContextProvider';
import URLImage from '../../components/konva-components/URLImage';



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
];




export const SignaturePad = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { signatures, setSignatures, activePage } = useStateContext();
  const signatureCanvasRef = useRef();
  const [penWidth, dispatchPW] = useReducer(reducerPenWidth, 4);
  const [penColor, setPenColor] = useState("#000000");
  const toast = useToast();
  

  const clear = () => {
    signatureCanvasRef.current.clear();
  }
  const onModalClose = () => {
    onClose();
  }
  const handleCreateSignature = () => {
    if(!signatureCanvasRef.current.isEmpty()) {
      const canvasWidth = signatureCanvasRef.current.getCanvas().width;
      const canvasHeight = signatureCanvasRef.current.getCanvas().height;
      const item = {
        _id: signatures.length + 1,
        page: activePage,
        imageData: signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'),
        x: 100, 
        y: 100,
        // width: canvasWidth / 3, height: canvasHeight / 3
      };
      console.log(signatureCanvasRef.current.getSignaturePad());
      setSignatures(prev => [...prev, item]);
      onModalClose();
      toast.closeAll();
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
      <Modal isOpen={isOpen} size="2xl" onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Draw Your Signature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className='flex flex-col gap-2'>
              <div>
                <SignatureCanvas 
                  ref={signatureCanvasRef}
                  penColor={penColor}
                  canvasProps={{width: 600, height: 300, className: 'sigCanvas'}} 
                  maxWidth={penWidth}
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
                      <Button colorScheme='gray' variant="outline" roundedRight="lg" padding={1} roundedLeft="none" size="sm" onClick={() => dispatchPW({ type: "DECREASE" })}>
                        <AiOutlineMinus />
                      </Button>
                    </div>
                  </Tooltip>
                  <div>
                    <Stack direction="row">
                      {penColorsList.map(item => (
                        <div className='p-1 rounded-full dark:bg-slate-500 bg-gray-100 w-8 h-8 flex align-middle justify-center'>
                          <Radio 
                            key={item.key} size='lg' colorScheme={item.name} 
                            onClick={() => setPenColor(item.hex)} 
                            style={{ border: `3px solid ${item.hex}` }} 
                            _Checked={{ background: item.hex }}
                            isChecked={penColor === item.hex} />
                        </div>
                      ))}
                      
                    </Stack>
                  </div>
                  <Button colorScheme='gray' size="sm" ml={3} onClick={clear}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' size="sm" mr={3} onClick={handleCreateSignature}>
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
