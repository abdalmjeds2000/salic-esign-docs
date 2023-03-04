import { useDisclosure, useToast } from '@chakra-ui/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { docSchema } from '../data/docSchema';


const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeThumbnailes, setActiveThumbnailes] = useState(false);
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('chakra-ui-color-mode') || 'light');
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pdfQuality, setPdfQuality] = useState(2);
  const [isAllowShowDoc, setIsAllowShowDoc] = useState(false);
  const [documentSchema, setDocumentSchema] = useState(docSchema);
  const [selectedId, selectShape] = React.useState(null);
  const totalPages = documentSchema?.numOfPages;
  const [isOpenSignCM, setIsisOpenSignCM] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });


  const [datesList, setDatesList] = useState([]);
  const [showDateContextMenu, setShowDateContextMenu] = useState(false);
  const [dateContextMenuPosition, setDateContextMenuPosition] = useState({ x: 0, y: 0, _id: null });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newSignAttrs, setNewSignAttrs] = useState({});
  const toast = useToast();




  const setMode = (value) => {
    setCurrentMode(value);
  }
  function handleZoomIn() {
    setScale(prev => prev < 5 ? prev + 0.1 : prev);
  }
  function handleZoomOut() {
    setScale(prev => prev > 0.2 ? prev - 0.1 : prev);
  }
  function setZoom(value) {
    setScale(value);
  }
  function handleRotateLeft() {
    setRotation(prev => prev - 90);
  }
  function handleRotateRight() {
    setRotation(prev => prev + 90);
  }

  function nextPage() {
    setCurrentPage(prev => prev < totalPages ? prev + 1 : prev);
  }
  function previousPage() {
    setCurrentPage(prev => prev > 1 ? prev - 1 : prev);
  }

  function goToPage(page) {
    setActivePage(page);
    const element = document.getElementById(`page_${page}`);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }


  function goPage(value) {
    if(Number(value) <= totalPages && Number(value) > 0) {
      setCurrentPage(value);
    }
  }

  function handleFullScreen() {
    if ((!document.mozFullScreen && !document.webkitIsFullScreen)) {
      document.body.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const onContextMenu = (event) => {
    event.evt.preventDefault(); // prevent default context menu
    setShowContextMenu(true);
    if(event.evt.type === "contextmenu") {
      setContextMenuPosition({ x: event.evt.clientX, y: event.evt.clientY });
    } else if(event.evt.type === "touchend") {
      setContextMenuPosition({ x: event.evt.changedTouches[0]?.clientX, y: event.evt.changedTouches[0]?.clientY });
    }
  }
  function handleCloseContextMenu() {
    setShowContextMenu(false);
    setShowDateContextMenu(false);
  }

  const onDateItemContextMenu = (event) => {
    event.evt.preventDefault(); // prevent default context menu
    setShowDateContextMenu(true);
    if(event.evt.type === "contextmenu") {
      setDateContextMenuPosition({ x: event.evt.clientX, y: event.evt.clientY, _id: event.target.attrs._id });
    } else if(event.evt.type === "touchend") {
      setDateContextMenuPosition({ x: event.evt.changedTouches[0]?.clientX, y: event.evt.changedTouches[0]?.clientY, _id: event.target.attrs._id });
    }
  }

  var isMobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

  const setScaleByParentWidth = () => {
    const paddingPage = isMobile ? 5 : 25;
    const parentWidth = document.getElementById("pagesParentRef")?.clientWidth - paddingPage;
    const firstPageWidth = documentSchema?.pages[0].width;
    const newScale = parentWidth / firstPageWidth;
    if(newScale) {
      return newScale
    }
    return 1
  }

  // handle delete selected signature
  const handleDeleteSignature = () => {
    const newSignatureList = signatures.filter(sign => sign._id !== selectedId);
    setSignatures(newSignatureList);
    selectShape(null);
    setShowContextMenu(false);
  }
  const keydownHandler = (e) => {
    if(e.key === "Delete" && selectedId) {
      e.preventDefault();
      handleDeleteSignature();
    }
  }


  const handelAddDate = (date) => {
    const newDatesList = [...datesList, date];
    setDatesList(newDatesList);
  }
  // handle delete date
  const handleDeleteDate = (id) => {
    const newDatesList = datesList?.filter(date => date._id !== id);
    setDatesList(newDatesList);
    setShowDateContextMenu(false);
  }

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    }
  }, [selectedId]);



  // warning user if he choose a high quality of document
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

  return (
    <StateContext.Provider value={{ 
      activeThumbnailes,
      setActiveThumbnailes,
      currentMode, setMode,
      handleZoomIn, handleZoomOut, setZoom,
      handleRotateLeft, handleRotateRight,
      nextPage, previousPage,
      currentPage, setCurrentPage,
      scale,
      rotation, setRotation,
      goPage,
      handleFullScreen,
      signatures, setSignatures,
      activePage, setActivePage,
      goToPage,
      pdfQuality, setPdfQuality,
      isAllowShowDoc, setIsAllowShowDoc,
      setScaleByParentWidth,
      documentSchema, setDocumentSchema,
      selectedId, selectShape,
      isMobile,
      isOpenSignCM, setIsisOpenSignCM,
      handleDeleteSignature,
      isOpen, onOpen, onClose,
      newSignAttrs, setNewSignAttrs,
      showContextMenu, setShowContextMenu, contextMenuPosition, onContextMenu, handleCloseContextMenu,
      datesList, setDatesList,
      handelAddDate, handleDeleteDate, onDateItemContextMenu, showDateContextMenu, dateContextMenuPosition
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);