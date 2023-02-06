import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import { docSchema } from "../data/docSchema";
import { Scrollbars } from 'react-custom-scrollbars-2';
import wait from "waait";
import { Button, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spinner, Tooltip } from "@chakra-ui/react";
import { fabric } from 'fabric';
import Konva from 'konva';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import ToolsHeader from "../components/ToolsHeader";
import Rectangle from "../components/konva-components/Rectangle";


  function SliderThumbs({ getSliderValue }) {
    const [sliderValue, setSliderValue] = React.useState(4);
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
          max={10}
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
    const [activePage, setActivePage] = useState(1);
    const [sliderValue, setSliderValue] = React.useState(5);

    return (
      <div className='w-80 bg-neutral-200 dark:bg-neutral-800 flex-col overflow-hidden resize-x p-4 hidden md:flex'>
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
                    className={`thumb-item flex flex-col items-center w-fit h-fit cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 ${activePage === item.Index ? "bg-neutral-300 dark:bg-neutral-700" : ""} px-6 py-4 rounded-lg`}
                    onClick={() => {
                      setActivePage(item.Index);
                      const element = document.getElementById(`page_${item.Index}`);
                      if (element) element.scrollIntoView();
                    }}
                  >
                    <div className="thumb-head"></div>
                    <div 
                      className={`thumb-body relative bg-white shadow-xl border-gray-300 border-2 ${activePage === item.Index && "border-active-color"}`} 
                      style={{width: (item.width / 4) * (sliderValue / 4), height: (item.height / 4) * (sliderValue / 4)}}
                    >
                      <div className="overlay_layer p-2 absolute w-full h-full flex flex-col justify-end items-center overflow-hidden" style={{ background: pageActions.length > 0 ? "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 100%)" : "" }}>
                        <Tooltip label={`Actions for #${item.Index} page`} openDelay={500} fontSize="small">
                          <div className="thumb-actions flex gap-1 flex-wrap mb-1">
                            {pageActions?.map((action, i) => {
                              return (
                                <span className={`w-5 h-5 rounded-md ${action.isSigned ? "bg-green-600" : "bg-red-600"} flex justify-center items-center text-xs text-white`}>
                                  {i+1}
                                </span>
                              )
                            })}
                          </div>
                        </Tooltip>
                      </div>

                      {item.Index}

                    </div>
                    <div className={`thumb-footer text-text-color dark:text-white ${activePage === item.Index ? "text-blue-900 font-semibold" : ""}`}>
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
    const { scale, rotation } = useStateContext();
    const [isReady, setIsReady] = useState(false);
    var observer = new IntersectionObserver(async function(entries) { 
      if(entries[0]['isIntersecting'] === true) {
        const currentPage = item;
        if(!currentPage.isLoaded) {
          await wait(2000);
          setIsReady(true);
          // setDocumentSchema(prev => {
          //   prev.pages.filter(itm => itm.Index === item.Index)[0].isLoaded = true;
          //   return {...prev}
          // })
        }
      }
    }, { threshold: [0, 0.5, 1] });
    useEffect(() => {
      observer.observe(pageRef.current);
    }, []);

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
          />
          <Text x={100} y={40} text="This is try to Draw Text" draggable fontSize="22" />
          <Text x={350} y={40} text={"#" + item.Index} fontSize="22" />
        </Layer>
      </Stage>
    )

    return (
      <div key={item.Index} ref={pageRef} id={`page_${item.Index}`} className="page-item mt-8" style={{ }}>
        <div 
          className="text-9xl shadow-lg bg-white overflow-hidden text-text-color" 
          style={{width: item.width * scale, height: item.height * scale, transform: `rotate(${rotation}deg)`}}
        >
          <div className="m-14 text-right">
            {/* {!isReady ? <Spinner size='xl' /> : "#" + item.Index} */}
          </div>
          {isReady ? <Drawing /> : <div className="flex justify-center"><Spinner size='xl' /></div>}
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
      <div className="flex-[7] flex flex-col bg-neutral-100 px-8 dark:bg-neutral-700 overflow-auto">
        <div className="pages-header"></div>
        <div className='pages-body h-full'>
          <Scrollbars style={{ height: "100%" }}>
            <div ref={pagesParentRef} id="pagesParentRef" className='pages block h-full'>
                {
                  pages?.map((item) => (
                    <div key={item.Index} className="mx-auto" style={{ width: item.width * scale }}>
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
    <div className="flex flex-col w-screen h-screen overflow-auto bg-white">
      <Header docSchema={documentSchema} />
      <ToolsHeader actions={documentSchema.actions} />

      <main className="flex h-full">
        {activeThumbnailes && <Thumbs pages={documentSchema.pages} actions={documentSchema.actions} />}
        <Document pages={documentSchema.pages} />
      </main>
    </div>
  )
}

export default ESignDocument
