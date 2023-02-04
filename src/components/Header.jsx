import React, { useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import { Select, Tooltip, Button, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useColorMode, useDisclosure } from '@chakra-ui/react';
import { TbFileInfo, TbLayoutSidebar, TbSettings } from 'react-icons/tb';
import { FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { MdDarkMode, MdFullscreen, MdOutlineLightMode } from 'react-icons/md';
import logo from "../assets/images/horizontal-logo.png";
import { zoomOptions } from '../data/viewerData';
import { Kbd } from '@chakra-ui/react';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

const ToolbarBtn = ({ icon, canActive, title, handleClick, initStatus, className }) => {
  const [isActive, setIsActive] = useState(initStatus || false);
  return (
    <Tooltip label={title} fontSize="md">
      <span className={className}>
        <button
          type='button'
          onClick={() => {
            if(canActive) {
              setIsActive(prev => !prev);
            }
            handleClick();
          }}
          className={`hover:bg-active-color hover:dark:bg-gray-500 hover:text-active-color text-text-color dark:text-white h-10 w-10 rounded-md active:scale-95 transition-all  ${isActive ? 'bg-active-color text-active-color dark:text-text-color dark:hover:text-white' : ''} `}
        >
          <span className='flex align-middle justify-center text-2xl'>{icon}</span>
        </button>
      </span>
    </Tooltip>
  )
}
const DocumentInformation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <ToolbarBtn
        icon={<TbFileInfo />}
        title="Show Document Information"
        handleClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Document Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant='simple'>
                {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                <Thead>
                  <Tr>
                    <Th>Inviter</Th>
                    <Th>{/* Inviter Email */}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>SALIC</Td>
                    <Td>stsadmin@salic.onmicrosoft.com</Td>
                  </Tr>
                </Tbody>
              </Table>

              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>27-08-2020 05:09</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>#Pages</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>78</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};


const Header = () => {
  const { currentMode, setMode, setActiveThumbnailes, handleFullScreen, handleRotateLeft, handleRotateRight, handleZoomIn, handleZoomOut, setZoom } = useStateContext();
  const { toggleColorMode } = useColorMode();
  const [isShowTools, setIsShowTools] = useState(false);


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
        <Select variant='filled' defaultValue={1} onChange={e => setZoom(Number(e.target.value))}>
          {zoomOptions.map((option, i) => <option key={i} value={option.value}>{option.label}</option>)}
        </Select>
      </div>
      <ToolbarBtn
        icon={<FiZoomIn />}
        title="Zoom In"
        handleClick={handleZoomIn}
      />
    </div>
  );
  return (
    <header className='fixed w-full shadow-lg h-14 md:h-16'>
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
        {!  isShowTools && <div className='flex gap-2'>
          <DocumentInformation />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              style={{ backgroundColor: "transparent" }}
              icon={<ToolbarBtn
                icon={<TbSettings />}
                title="Menu"
                // canActive
              />}
            />
            <MenuList>
              <MenuItem onClick={handleFullScreen} command={<Kbd>F11</Kbd>}>
                Fullscreen
              </MenuItem>
            </MenuList>
          </Menu>
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