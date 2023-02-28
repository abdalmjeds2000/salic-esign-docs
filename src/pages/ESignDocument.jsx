import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Skeleton, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Stack, Tooltip, useDisclosure } from "@chakra-ui/react";
import ToolsHeader from "../components/ToolsHeader";
import useOnScreen from "../hooks/useOnScreen";
import { Signatures, SignaturePad } from "../components/signature-pad/SignaturePad";
import { Layer, Stage } from "react-konva";
import URLImage from "../components/konva-components/URLImage";


  function SliderThumbs({ getSliderValue }) {
    const [sliderValue, setSliderValue] = React.useState(2);
    const [showTooltip, setShowTooltip] = React.useState(false);

    useEffect(() => {
      getSliderValue(sliderValue);
    }, [sliderValue]);

    
    return (
      <div className="my-3 mx-6">
        <Slider
          id='slider'
          defaultValue={sliderValue}
          min={1}
          max={3}
          step={1}
          onChange={setSliderValue}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SliderTrack bg='white'>
            <SliderFilledTrack bg='blue.700' />
          </SliderTrack>
          <Tooltip
            placement='bottom'
            isOpen={showTooltip}
            label={sliderValue}
          >
            <SliderThumb boxSize={5} />
          </Tooltip>
        </Slider>
      </div>
    )
  }

  const Thumb = ({ item, sliderValue }) => {
    const { activePage, setActivePage, isMobile } = useStateContext();

    const thumbRef = useRef();
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const isOnScreen = useOnScreen(thumbRef);
    const [timer, setTimer] = useState(0);

    const fetchPage = async () => {
      setLoading(true);
      setIsReady(true);
      setLoading(false);
    }

    useEffect(() => {
      if(!isReady) {
        const counter = setInterval(() => {
          if(isOnScreen) {
            setTimer(prev => prev += 1);
          } else {
            setTimer(0);
          }
        }, 500);
        return () => clearInterval(counter);
      }
    }, [isOnScreen, isReady]);
    useEffect(() => {
      if(isOnScreen && !isReady && timer > 2) {
        fetchPage();
      }
    }, [isOnScreen, timer]);


    const desktopStylesPage = {
      width: (item.width / 4) * (sliderValue * 0.5), 
      height: (item.height / 4) * (sliderValue * 0.5)
    }
    const mobileStylesPage = {
      width: 100, 
      height: "fit-content",
      minHeight: 100,
    }
    return (
      <div 
        key={item.Index} 
        id={`thumb_${item.Index}`} 
        ref={thumbRef}
        className={`thumb-item flex flex-col items-center w-fit h-fit transition-all cursor-pointer bg-neutral-300 dark:bg-neutral-900 dark:bg-opacity-25 bg-opacity-25 dark:hover:bg-opacity-100 hover:bg-opacity-100 ${activePage === item.Index ? "bg-opacity-100 dark:bg-opacity-100" : ""} p-4 pb-1 max-md:p-0 max-md:rounded-sm rounded-lg`}
        onClick={() => {
          setActivePage(item.Index);
          const element = document.getElementById(`page_${item.Index}`);
          if (element) element.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <div className="thumb-head"></div>
        <div 
          className={`thumb-body relative rounded-sm max-md:rounded-none overflow-hidden bg-white shadow-xl ${activePage === item.Index && "outline outline-4 outline-slate-400 dark:outline-slate-400"}`} 
          style={isMobile ? mobileStylesPage : desktopStylesPage}
        >
          <Skeleton
            height='100%'
            isLoaded={!loading}
            fadeDuration={2}
            bg='white'
          >
            {!loading && <img 
              src={`https://salicapi.com/api/Signature/GetThumbnailPage?Page=${item.Index-1}`} alt=""
              width="100%" height="100%" 
              loading="lazy"
            />}
          </Skeleton>
        </div>
        <div className={`thumb-footer text-text-color dark:text-white max-md:hidden ${activePage === item.Index ? "text-slate-500 font-semibold" : ""}`}>
          {item.Index}
        </div>
      </div>
    )
  }
  const Thumbs = ({ pages, actions }) => {
    const [sliderValue, setSliderValue] = React.useState(3);
    const { activeThumbnailes } = useStateContext();

    return (
      <div style={{ display: activeThumbnailes ? "block" : "none"}} className='w-80 bg-neutral-200 drop-shadow-lg border-r-4 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 flex-col overflow-hidden resize-x p-4 max-md:fixed max-md:z-50 max-md:left-0 max-md:top-14 max-md:h-full max-md:w-32 max-md:py-2 max-md:px-0.5 max-md:shadow-2xl'>
        <div className="max-md:hidden thumbs-header mb-4">
          <SliderThumbs getSliderValue={setSliderValue} />
          {/* <h3 className="font-semibold text-xl text-text-color dark:text-white">Thumbnails</h3> */}
        </div>
        <Scrollbars>
          <div className='thumbs-body flex justify-center flex-wrap gap-y-4 max-md:gap-y-2 gap-x-2 max-md:py-1'>
            {
              pages?.map((item, i) => {
                return (
                  <Thumb key={i} item={item} sliderValue={sliderValue} />
                )
              })
            }
          </div>
        </Scrollbars>
        <div className="thumbs-footer"></div>
      </div>
    )
  }

  const Page = ({item, totalPages}) => {
    const pageRef = useRef();
    const { scale, rotation, setActivePage, pdfQuality, selectShape, onOpen, setNewSignAttrs } = useStateContext();
    const [isReady, setIsReady] = useState(false);
    const [imgData, setImgData] = useState({});
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);
    const isOnScreen = useOnScreen(pageRef);

    const fetchPage = async () => {
      setLoading(true);
      setImgData({ 
        // src: require(`../assets/images/imagesfile/Logotype ( PDFDrive )_page-${item.Index.toString().padStart(4, '0')}.jpg`),
        src: `https://salicapi.com/api/Signature/GetPage?Page=${item.Index-1}&q=${pdfQuality}`,
        index: item.Index, 
        size: "1MB", 
        alt: "", 
        width: item.width, 
        height: item.height, 
      });
      setIsReady(true);

      setLoading(false);
    }
    useEffect(() => {
      if(!isReady) {
        const counter = setInterval(() => {
          if(isOnScreen) {
            setTimer(prev => prev += 1);
          } else {
            setTimer(0);
          }
        }, 500);
        return () => clearInterval(counter);
      }
    }, [isOnScreen, isReady]);
    useEffect(() => {
      if(isOnScreen && !isReady && timer >= 3) {
        fetchPage();
      }
      // if(isOnScreen && timer >= 1) {
      //   setActivePage(item.Index);
      // }

    }, [isOnScreen, timer]);
    // to refetch images after user change pdf quality
    useEffect(() => {
      setIsReady(false);
    }, [pdfQuality]);


    const checkDeselect = (e) => {
      // deselect when clicked on empty area
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        selectShape(null);
      }
    };


    const Drawing = () => (
      <Stage
        width={item.width * scale}
        height={item.height * scale}
        scale={{x: scale, y: scale}}
        rotation={rotation}
        style={{position: "absolute", top: 0, left: 0}}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer>
          {item?.signaturesPlaces?.map((sign, i) => (
            <URLImage
              key={i}
              src={require("../assets/images/sign_placeholder.png")}
              shapeProps={{
                ...sign,
                draggable: false,
                onClick: (e) => {
                  setNewSignAttrs({...sign, page: item.Index});
                  onOpen();
                },
                onTap: (e) => {
                  setNewSignAttrs({...sign, page: item.Index});
                  onOpen();
                },
              }}
            />
          ))}
          <Signatures 
            pageNumber={item.Index} 
            stageProps={{
              width: item.width * scale,
              height: item.height * scale,
              scale: {x: scale, y: scale},
              style: {position: "absolute", top: 0, left: 0}
            }}
          />
        </Layer>
      </Stage>
    )
    
    return (
      <div key={item.Index} ref={pageRef} id={`page_${item.Index}`} className={`page-item mb-6 transition-all ${isReady ? "opacity-100" : "opacity-25"}`}>
        <div 
          className="text-9xl bg-white rounded-sm overflow-hidden text-text-color" 
          style={{width: item.width * scale, height: item.height * scale, transform: `rotate(${rotation}deg)`}}
        >
          {
            !loading
            ? (
              <>
                <Drawing />
                <img 
                  src={imgData.src} alt=""
                  width={imgData.width * scale} height={imgData.height * scale} 
                  loading="lazy"
                />
              </>
            ) : (
              <div className="flex justify-center mt-14"><Spinner size='md' /></div>
            )
          }
        </div>
        <div className='mt-2 h-4'>
          <p className="text-sm float-left max-md:hidden">78d11272-86b3-49fe-a3d5-284ecf48ec01</p>
          <p className="text-sm md:float-right text-center">{item.Index} / {totalPages}</p>
        </div>
      </div>
    )
  }
  const Document = ({ pages }) => {
    const pagesParentRef = useRef(null);
    const { scale } = useStateContext();

    return (
      <div className="flex-[7] flex flex-col bg-neutral-300 px-0 md:px-6 dark:bg-neutral-700 overflow-auto">
        <div className="pages-header"></div>
        <div className='pages-body h-full'>
          <Scrollbars style={{ height: "100%" }}>
            <div ref={pagesParentRef} id="pagesParentRef" className='pages block h-full pt-5 pb-10'>
              {
                pages?.map((item) => (
                  <div key={item.Index} className="mx-auto last:pb-8" style={{ width: item.width * scale }}>
                    <Page
                      item={item} 
                      totalPages={pages.length} 
                      // setDocumentSchema={setDocumentSchema}
                    />
                  </div>
                ))
              }
            </div>
          </Scrollbars>
        </div>
        <div className="pages-footer"></div>
      </div>
    )
  }





const ESignDocument = () => {
  const { activeThumbnailes, documentSchema, setZoom, setScaleByParentWidth, isMobile, isOpen, onOpen, onClose } = useStateContext();

  useEffect(() => {
    document.title = `SALIC eSign - [${documentSchema.title}]`
  }, [documentSchema]);

  useEffect(() => {
    setZoom(setScaleByParentWidth());
  }, [activeThumbnailes]);


  return (
    <div className="w-screen h-screen overflow-auto bg-white">
      <Header docSchema={documentSchema} />
      <ToolsHeader actions={documentSchema.actions} />

      <main className="flex flex-1 h-full" style={{ paddingTop: /* isMobile ? "3.5rem" : */ "5.5rem" }}>
        <SignaturePad isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        {/* {activeThumbnailes && <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />} */}
        <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />
        <Document pages={documentSchema.pages} />
      </main>
    </div>
  )
}

export default ESignDocument
