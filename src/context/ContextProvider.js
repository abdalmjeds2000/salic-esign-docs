import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [activeThumbnailes, setActiveThumbnailes] = useState(false);
  const [currentMode, setCurrentMode] = useState(localStorage.getItem('chakra-ui-color-mode') || 'light');
  const totalPages = 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [pdfQuality, setPdfQuality] = useState(2);

  const [isAllowShowDoc, setIsAllowShowDoc] = useState(false);




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
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);