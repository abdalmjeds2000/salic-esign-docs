import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Stack, Tooltip, useDisclosure, useRadio, useRadioGroup } from '@chakra-ui/react';
import React, { useReducer, useRef, useState } from 'react';
import { FaSignature } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import SignatureCanvas from 'react-signature-canvas';
import { Layer, Rect, Text } from 'react-konva';
import { useStateContext } from '../../context/ContextProvider';



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
  const [allowCreate, setAllowCreate] = useState(false);
  

  const clear = () => {
    signatureCanvasRef.current.clear()
    setAllowCreate(false);
  }
  const onModalClose = () => {
    setAllowCreate(false);
    onClose();
  }
  const handleCreateSignature = () => {
    const item = {
      key: signatures.length + 1,
      page: activePage,
      imageData: signatureCanvasRef.current.getTrimmedCanvas().toDataURL('image/png'),
      x: 200, 
      y: 200,
    };
    setSignatures(prev => [...prev, item]);
    onModalClose();
  }

  return (
    <div>
      <Tooltip label="Signature Pad">
        <Button colorScheme='blue' size='xs' onClick={onOpen}><FaSignature /></Button>
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
                  canvasProps={{width: 600, height: 300, className: 'sigCanvas', onClick: () => setAllowCreate(true)}} 
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
            <Button colorScheme='blue' isDisabled={!allowCreate} size="sm" mr={3} onClick={handleCreateSignature}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}


export const Signatures = ({ pageNumber }) => {
  const { signatures } = useStateContext();
  
  return (
    <Layer>
      {
        signatures?.map(item => {
          if(pageNumber === item.page) {
            return <Text key={item.key} x={200} y={200} text={"SIGNATURE " + item.key} draggable fontSize={22} />
          }
        })
      }
    </Layer>
  )
}
