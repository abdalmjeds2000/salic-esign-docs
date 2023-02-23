import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import { docSchema } from "../data/docSchema";
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Tooltip } from "@chakra-ui/react";
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import ToolsHeader from "../components/ToolsHeader";
import useOnScreen from "../hooks/useOnScreen";
import { Signatures } from "../components/signature-pad/SignaturePad";


  function SliderThumbs({ getSliderValue }) {
    const [sliderValue, setSliderValue] = React.useState(3);
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
          max={5}
          onChange={(v) => setSliderValue(v)}
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
  const Thumbs = ({ pages, actions }) => {
    const { activePage, setActivePage } = useStateContext();
    const [sliderValue, setSliderValue] = React.useState(3);

    return (
      <div className='w-80 bg-neutral-200 drop-shadow-lg border-r-4 border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 flex-col overflow-hidden resize-x p-4 hidden md:flex'>
        <div className="thumbs-header mb-4">
          <SliderThumbs getSliderValue={setSliderValue} />
          {/* <h3 className="font-semibold text-xl text-text-color dark:text-white">Thumbnails</h3> */}
        </div>
        <Scrollbars>
          <div className='thumbs-body flex justify-center flex-wrap gap-y-4 gap-x-2'>
            {
              pages?.map((item) => {
                const pageActions = actions?.filter(a => a.page === item.Index);
                return (
                  <div 
                    key={item.Index} 
                    id={`thumb_${item.Index}`} 
                    className={`thumb-item flex flex-col items-center w-fit h-fit transition-all cursor-pointer bg-neutral-300 dark:bg-neutral-900 dark:bg-opacity-25 bg-opacity-50 dark:hover:bg-opacity-100 hover:bg-opacity-100 ${activePage === item.Index ? "bg-opacity-100 dark:bg-opacity-100" : ""} p-6 pb-3 rounded-lg`}
                    onClick={() => {
                      setActivePage(item.Index);
                      const element = document.getElementById(`page_${item.Index}`);
                      if (element) element.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <div className="thumb-head"></div>
                    <div 
                      className={`thumb-body relative rounded-sm overflow-hidden bg-white shadow-xl ${activePage === item.Index && "outline outline-4 outline-slate-400 dark:outline-slate-400"}`} 
                      style={{width: (item.width / 4) * (sliderValue * 0.25), height: (item.height / 4) * (sliderValue * 0.25)}}
                    >
                      <div className="overlay_layer p-2 absolute w-full h-full flex flex-col justify-end items-center overflow-hidden" style={{ background: pageActions.length > 0 ? "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 100%)" : "" }}>
                        <Tooltip label={`Actions for #${item.Index} page`} openDelay={500} fontSize="small">
                          <div className="thumb-actions flex gap-1 flex-wrap mb-1">
                            {pageActions?.map((action, i) => {
                              return (
                                <span key={i} className={`w-5 h-5 rounded-md ${action.isSigned ? "bg-green-600" : "bg-red-600"} flex justify-center items-center text-xs text-white`}>
                                  {i+1}
                                </span>
                              )
                            })}
                          </div>
                        </Tooltip>
                      </div>

                      {/* {item.Index} */}

                    </div>
                    <div className={`thumb-footer text-text-color dark:text-white ${activePage === item.Index ? "text-slate-500 font-semibold" : ""}`}>
                      {item.Index}
                    </div>
                  </div>
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
    const { scale, rotation, setActivePage, pdfQuality } = useStateContext();
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
      if(isOnScreen && timer >= 1) {
        console.log(item.Index);
        setActivePage(item.Index);
        // const element = document.getElementById(`thumb_${item.Index}`);
        // if (element) element.scrollIntoView({ behavior: "smooth" });
      }

    }, [isOnScreen, timer]);
    useEffect(() => {
      setIsReady(false);
    }, [pdfQuality]);

    const Drawing = () => (
      <Stage width={item.width * scale} height={item.height * scale} scale={{x: scale, y: scale}} style={{ position: "absolute", top: 0, left: 0 }}>
        <Layer>
          <Rect x={25} y={25} width={50} height={50} fill="#0035c6" onClick={() => alert("you are clicked on rectangle")} shadowBlur={10} shadowOpacity={.5} />
          <Circle
            x={70}
            y={70}
            draggable
            radius={25}
            fill="#00c6c6"
            onClick={() => alert("you are clicked on Circle")}
            pointer
          />
          <Text x={100} y={40} text="This is try to Draw Text" draggable fontSize={22} />
          <Text x={350} y={40} text={"#" + item.Index} fontSize={22} />
        </Layer>
        <Signatures pageNumber={item.Index} />
      </Stage>
    )
    
    return (
      <div key={item.Index} ref={pageRef} id={`page_${item.Index}`} className={`page-item mb-10 transition-all ${isReady ? "opacity-100" : "opacity-25"}`}>
        <div 
          className="text-9xl shadow-lg bg-white rounded-sm overflow-hidden text-text-color" 
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
                />
              </>
            ) : (
              <div className="flex justify-center mt-14"><Spinner size='md' /></div>
            )
          }
          
        </div>
        <div className='flex justify-between'>
          <p className="text-sm">file.png</p>
          <p className="text-sm">{item.Index} / {totalPages}</p>
        </div>
      </div>
    )
  }
  const Document = ({ pages }) => {
    const pagesParentRef = useRef(null);
    const { scale } = useStateContext();

    return (
      <div className="flex-[7] flex flex-col bg-neutral-100 px-2 md:px-6 dark:bg-neutral-700 overflow-auto">
        <div className="pages-header"></div>
        <div className='pages-body h-full'>
          <Scrollbars style={{ height: "100%" }}>
            <div ref={pagesParentRef} id="pagesParentRef" className='pages block h-full py-10'>
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
  const [documentSchema, setDocumentSchema] = useState(docSchema);
  const { activeThumbnailes } = useStateContext();

  return (
    <div className="w-screen h-screen overflow-auto bg-white">
      <Header docSchema={documentSchema} />
      <ToolsHeader actions={documentSchema.actions} />

      <main className="flex flex-1 h-full pt-[5.5rem] md:pt-[6.5rem]">
        {activeThumbnailes && <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />}
        <Document pages={documentSchema.pages} />
      </main>
    </div>
  )
}

export default ESignDocument
