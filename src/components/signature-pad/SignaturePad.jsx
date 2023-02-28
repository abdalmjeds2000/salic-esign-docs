import { Button, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Tooltip, useDisclosure, useRadio, useRadioGroup, useToast } from '@chakra-ui/react';
import React, { useReducer, useRef, useState } from 'react';
import { FaEraser, FaRedo, FaUndo } from 'react-icons/fa';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { useStateContext } from '../../context/ContextProvider';
import URLImage from '../../components/konva-components/URLImage';
import { ReactSketchCanvas } from "react-sketch-canvas";
import { ImPencil2 } from 'react-icons/im';
import { HiOutlineTrash } from 'react-icons/hi';
import { MdOutlineFileUpload } from 'react-icons/md';



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
  const { signatures, setSignatures, selectShape, isOpen, onClose, newSignAttrs } = useStateContext();
  const signatureCanvasRef = useRef();
  const [imageBase64, setImageBase64] = useState('');
  const [penWidth, dispatchPW] = useReducer(reducerPenWidth, 4);
  const [penColor, setPenColor] = useState("#000000");
  const toast = useToast();

  const onModalClose = () => {
    onClose();
  }
  const handleCreateDrawSignature = async () => {
    const paths = await signatureCanvasRef.current.exportPaths();
    if(paths?.length) {
      const imgData = await signatureCanvasRef.current.exportImage("svg");
      const item = {
        _id: signatures.length + 1,
        // page: activePage,
        imageData: imgData, signPaths: paths,
        x: 100, y: 100,
        width: 192, height: 108,
        scaleX: 1, scaleY: 1,
        ...newSignAttrs
      };
      selectShape(item._id);
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
  const handleCreateUploadSignature = async () => {
    if(imageBase64 && imageBase64.length) {
      const imgData = imageBase64;
      const item = {
        _id: signatures.length + 1,
        // page: activePage,
        imageData: imgData,
        x: 100, y: 100,
        width: 192, height: 108,
        scaleX: 1, scaleY: 1,
        ...newSignAttrs
      };
      selectShape(item._id);
      setImageBase64("");
      setSignatures(prev => [...prev, item]);
      onModalClose();
    } else {
      toast({
        title: "Upload Image First",
        status: "error",
        isClosable: true,
      });
    }
  }




  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    try {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
    } catch (err) {
      console.log("cancel select file");
    }
  };




  return (
    <div>
      {/* <Tooltip label="Signature Pad">
        <Button colorScheme='orange' variant="outline" size='xs' onClick={onOpen}><FaSignature /></Button>
      </Tooltip> */}
      <Modal isOpen={isOpen} size="3xl" onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Draw Your Signature</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs isFitted defaultIndex={0} variant="enclosed">
              <TabList>
                <Tab _selected={{ bg: "blue.400", color: "#fff" }}>Draw</Tab>
                <Tab _selected={{ bg: "blue.400", color: "#fff" }}>Upload</Tab>
              </TabList>
              <TabPanels className="border dark:border-neutral-700 border-t-0 py-2" roundedBottom={12}>
                <TabPanel>
                  <div className='flex flex-col gap-2'>
                    <div>
                      <ReactSketchCanvas
                        className='bg-neutral-100 mb-3 signatures-drawer-canvas'
                        height={280}
                        ref={signatureCanvasRef}
                        strokeWidth={penWidth}
                        strokeColor={penColor}
                        backgroundImage={"https://www.pngmart.com/files/3/Horizontal-Line-Transparent-Background.png"}
                        exportWithBackgroundImage={false}
                        canvasColor="#ffffff00"
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
                            {penColorsList.map((item, i) => (
                              <Button
                                key={i}
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
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 flex justify-end'>
                    <Tooltip label="Reset Canvas">
                      <Button size="md" variant="solid" colorScheme="red" mr="2" onClick={() => signatureCanvasRef.current.resetCanvas()}>Clear</Button>
                    </Tooltip>
                    <Button colorScheme='green' size="md" onClick={handleCreateDrawSignature}>
                      Create
                    </Button>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div>
                    <div>
                      <div className='flex justify-between mb-6'>
                        <Button colorScheme="blue" padding={0}> 
                          <label htmlFor="file-upload" className="flex items-center gap-2 px-4 cursor-pointer">
                            <MdOutlineFileUpload size={24} />
                            <span>Upload Signature</span>
                          </label>
                        </Button>
                        <input id="file-upload" type="file" onChange={handleImageChange} />
                      </div>
                      <div className='p-4 border-2 border-dashed rounded-lg'>
                        {
                          imageBase64 && imageBase64?.length
                          ? <img src={imageBase64} alt="signature" className='bg-white' />
                          : <span className='block text-center text-neutral-300'>PREVIEW PLACE</span>
                        }
                      </div>
                    </div>
                    <div className='mt-6 flex justify-end'>
                      {(imageBase64 || imageBase64?.length > 0) && <Button 
                        colorScheme="red" 
                        variant="solid"
                        mr={2}
                        onClick={() => setImageBase64("")}>
                        <HiOutlineTrash />
                      </Button>}
                      <Button colorScheme='green' onClick={handleCreateUploadSignature}>
                        Create
                      </Button>
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            {/* <Tooltip label="Reset Canvas">
              <Button size="md" variant="solid" colorScheme="red" mr="2" onClick={() => signatureCanvasRef.current.resetCanvas()}>Clear</Button>
            </Tooltip>
            <Button colorScheme='green' size="md" mr={3} onClick={handleCreateDrawSignature}>
              Create
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}


export const Signatures = ({ pageNumber }) => {
  const { signatures, setSignatures, selectedId, selectShape } = useStateContext();


  const handleDragEnd = (e) => {
    const updatedSignatures = signatures?.map(item => {
      if(item._id === e.target.attrs._id) {
        item = {...item, ...e.target.attrs}
        selectShape(item._id);
      }
      return item;
    });
    setSignatures(updatedSignatures);
  }



  return (
    <>
      {
        signatures?.map((item, i) => {
          if(pageNumber === item.page) {
            return (
              <URLImage 
                key={item._id} 
                _id={item._id}
                src={item.imageData}
                shapeProps={{
                  ...item,
                  draggable: true,
                  onDragEnd: handleDragEnd,
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
    </>
  )
}
