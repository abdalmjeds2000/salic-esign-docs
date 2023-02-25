import { Button, Kbd, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tooltip, Tr, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { TbFileInfo, TbSettings } from "react-icons/tb";
import { useStateContext } from "../context/ContextProvider";
import { docSchema } from "../data/docSchema";
import { SignaturePad } from "./signature-pad/SignaturePad";

const DocumentInformation = ({ dataSchema, numOfPages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <Tooltip label="Show Document Information">
        <Button colorScheme='purple' size='xs' onClick={onOpen}><TbFileInfo size={16} /></Button>
      </Tooltip>
      <Modal isOpen={isOpen} size="lg" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Document Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableContainer>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Inviter</Th>
                    <Th>{/* Inviter Email */}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{dataSchema?.invitee?.Name}</Td>
                    <Td>{dataSchema?.invitee?.Email}</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Invitee</Th>
                    <Th>{/* Inviter Email */}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{dataSchema?.invitor?.Name}</Td>
                    <Td>{dataSchema?.invitor?.Email}</Td>
                  </Tr>
                </Tbody>
              </Table>

              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>Invite Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{dataSchema?.invitor?.inviteAt}</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Table variant='simple'>
                <Thead>
                  <Tr>
                    <Th>#Pages</Th>
                    <Th>#Signatures</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>{numOfPages}</Td>
                    <Td>{docSchema.numOfActions}</Td>
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
const SettingsMenu = ({ data, numOfPages }) => {
  const { handleFullScreen } = useStateContext();
  return (
    <Menu size='xs'>
      <MenuButton >
        <Button colorScheme='blackAlpha' className="dark:bg-gray-600" size='xs'><TbSettings className="dark:text-white" size={16} /></Button>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleFullScreen} command={<Kbd>F11</Kbd>}>
          Fullscreen
        </MenuItem>
      </MenuList>
    </Menu>
  );
};




const ToolsHeader = ({ actions }) => {

  return (
    <div className="fixed top-14 md:top-16 shadow-2xl dark:drop-shadow-xl z-[9] w-full">
      <div className="h-10 md:h-10 px-3 py-0 md:px-6 bg-[#f0f2f4] dark:bg-secondary-dark-bg dark:text-white text-text-color">
        <div className="h-full flex justify-between items-center overflow-auto">
          <div className="flex justify-center items-center gap-1">
            <SettingsMenu />
            <DocumentInformation dataSchema={docSchema} numOfPages={docSchema.numOfPages} />
            <span className="ml-1"><SignaturePad /></span>
          </div>

          {/* <div className='flex gap-2 items-center'>
            {actions?.map((item, i) => (
              <Tooltip key={i} label={`#${item.page}`}>
                <Button
                  size="xs"
                  colorScheme={item.isSigned ? "green" : "red"}
                  variant="solid"
                  onClick={() => {
                    const element = document.getElementById(`page_${item.page}`);
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                >{i+1}</Button>
              </Tooltip>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default ToolsHeader