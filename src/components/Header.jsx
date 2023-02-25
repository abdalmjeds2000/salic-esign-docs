import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import { Tooltip, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useColorMode, useDisclosure, MenuDivider, scaleFadeConfig, useNumberInput, HStack, Input, useToast } from '@chakra-ui/react';
import { TbFileInfo, TbLayoutSidebar, TbSettings } from 'react-icons/tb';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdDarkMode, MdOutlineImage, MdOutlineLightMode } from 'react-icons/md';
import logo from "../assets/images/horizontal-logo.png";
import { zoomOptions } from '../data/viewerData';
import { Kbd } from '@chakra-ui/react';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { BiChevronDown } from 'react-icons/bi';
import { IoMdCheckmark } from 'react-icons/io';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

const ToolbarBtn = ({ icon, canActive, title, handleClick, initStatus, className }) => {
  const [isActive, setIsActive] = useState(initStatus || false);
  return (
    <Tooltip label={title} hasArrow fontSize="small">
      <span className={className}>
        <button
          type='button'
          onClick={() => {
            if(canActive) {
              setIsActive(prev => !prev);
            }
            if(handleClick) {
              handleClick();
            }
          }}
          className={`hover:bg-active-color hover:dark:bg-gray-500 hover:text-active-color text-text-color dark:text-white h-10 w-10 rounded-md active:scale-95 transition-all  ${isActive ? 'bg-active-color text-active-color dark:text-text-color dark:hover:text-white' : ''} `}
        >
          <span className='flex align-middle justify-center text-2xl'>{icon}</span>
        </button>
      </span>
    </Tooltip>
  )
}

const DocumentNavigate = ({ pagesCount, value, handleChange }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  useNumberInput({
    step: 1,
    defaultValue: 1,
    // value: value,
    min: 1,
    max: pagesCount || 1,
    precision: 0,
    onChange: handleChange
  })

const inc = getIncrementButtonProps()
const dec = getDecrementButtonProps()
const input = getInputProps()

return (
  <HStack maxW='150px'>
    <Button {...inc}><AiFillCaretDown /></Button>
    <Input {...input} style={{ padding: "0 10px" }} />
    <Button {...dec}><AiFillCaretUp /></Button>
  </HStack>
)
}

const qualityOptions = [
  { label: "Low", tag: null, value: 1 },
  { label: "Normal", tag: null, value: 2 },
  { label: "High", tag: null, value: 3 },
];


const Header = ({ docSchema }) => {
  const { currentMode, scale, setMode, setActiveThumbnailes, pdfQuality, setPdfQuality, handleRotateLeft, handleRotateRight, handleZoomIn, handleZoomOut, setZoom, activeThumbnailes } = useStateContext();
  const { toggleColorMode } = useColorMode();
  const [isShowTools, setIsShowTools] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if(pdfQuality === 3) {
      toast({
        title: "Note, you have chosen the high quality of the document, in case the application is heavy, please choose a lower display quality.",
        status: "warning",
        isClosable: true,
      })
    } else {
      toast.closeAll();
    }
  }, [pdfQuality]);
  const setScaleByParentWidth = () => {
    const parentWidth = document.getElementById("pagesParentRef")?.clientWidth - 40;
    const firstPageWidth = docSchema.pages[0].width;
    const newScale = parentWidth / firstPageWidth;
    return newScale
  }

  useEffect(() => {
    setZoom(setScaleByParentWidth());
  }, [activeThumbnailes]);

  const ViewerTools = () => (
    <div className='flex gap-2'>
      <ToolbarBtn
        icon={<FiRotateCcw />}
        title="Rotate Counterclockwise"
        handleClick={handleRotateLeft}
      />
      <ToolbarBtn
        icon={<FiRotateCw />}
        title="Rotate Clockwise"
        handleClick={handleRotateRight}
        className="mr-2"
      />
      <ToolbarBtn
        icon={<FiZoomOut />}
        title="Zoom Out"
        handleClick={handleZoomOut}
      />
      <div>
        <Menu>
          <MenuButton as={Button} rightIcon={<BiChevronDown />}>
            {Math.round(scale*100)}%
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setZoom(setScaleByParentWidth())}>Fit to width</MenuItem>
            {/* <MenuItem>Fit to hight</MenuItem> */}
            <MenuDivider />
            {zoomOptions.map((item, i) => (
              <MenuItem key={i} command={scale === item.value ? <IoMdCheckmark /> : ""} onClick={() => setZoom(item.value)}>{item.label}</MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
      <ToolbarBtn
        icon={<FiZoomIn />}
        title="Zoom In"
        handleClick={handleZoomIn}
      />
    </div>
  );




  return (
    <header className='fixed top-0 w-full border-b-2 border-gray-200 dark:border-gray-800 z-10 h-14 md:h-16'>
      <div className='flex justify-between w-full h-full px-3 py-0 md:px-6 md:py-3 items-center bg-[#e7ebee] dark:bg-main-dark-bg'>
        <div className='flex gap-2'>
          <div className='hidden md:block mr-4'>
            <ToolbarBtn
              icon={<TbLayoutSidebar />}
              title="Panel"
              handleClick={() => setActiveThumbnailes(prev => !prev)}
              canActive
              initStatus={true}
            />
          </div>

          <div className='hidden md:flex'>
            <ViewerTools />
          </div>
          <div className='flex md:hidden mr-4'>
            <ToolbarBtn
              icon={isShowTools ? <RiArrowRightSLine /> : <RiArrowLeftSLine />}
              title="Viewer Tools"
              handleClick={() => setIsShowTools(prev => !prev)}
            />
            {isShowTools ? <ViewerTools /> : null}
          </div>
        </div>
        <div>
          <img src={logo} alt="logo" className="hidden md:block" style={{ height: 30, filter: currentMode === "dark" ? "grayscale(1) invert(1)" : "" }} />
        </div>
        {!isShowTools && <div className='flex gap-2'>
          <Menu>
            <MenuButton as={Button} aria-label='Options' rightIcon={<BiChevronDown />}>
              <span className='text-text-color dark:text-white text-2xl'>
                <MdOutlineImage />
              </span>
            </MenuButton>
            <MenuList>
              {qualityOptions?.map((item, i) => (
                <MenuItem key={i} onClick={() => setPdfQuality(item.value)} command={pdfQuality == item.value ? <IoMdCheckmark /> : null}>
                  <span className={pdfQuality === item.value ? "font-semibold" : ""}>{item?.label} <span className='text-sm opacity-25'>{item.tag}</span></span>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* <DocumentNavigate pagesCount={docSchema.numOfPages} value={activePage} handleChange={p => goToPage(p)} /> */}
          <ToolbarBtn
            icon={currentMode === "dark" ? <MdDarkMode /> : <MdOutlineLightMode />}
            title={`Switch To ${currentMode === "dark" ? "Light" : "Dark"} Mode`}
            handleClick={() => {
              setMode(currentMode === "dark" ? "light" : "dark");
              toggleColorMode();
            }}
          />
        </div>}
      </div>
    </header>
  )
}

export default Header