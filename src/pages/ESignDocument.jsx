import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import Header from "../components/Header";
import { docSchema } from "../data/docSchema";
import { Scrollbars } from 'react-custom-scrollbars-2';
import wait from "waait";
import { Spinner } from "@chakra-ui/react";


const Thumbs = ({ pages }) => {
  const { activePage, setActivePage } = useStateContext();

  return (
    <div className='w-80 bg-neutral-200 dark:bg-neutral-800 flex-col overflow-hidden resize-x p-4 hidden md:flex'>
      <div className="thumbs-header">
        {/* <h3 className="font-semibold text-xl text-text-color dark:text-white">Thumbnails</h3> */}
      </div>
        <Scrollbars>
          <div className='thumbs-body flex flex-col items-center gap-4 h-full '>
            {
              pages?.map((item) => (
                <div 
                  key={item.Index} 
                  id={`thumb_${item.Index}`} 
                  onClick={() => {
                    setActivePage(item.Index);
                    const element = document.getElementById(`page_${item.Index}`);
                    if (element) element.scrollIntoView();
                  }}
                  className={`thumb-item flex flex-col items-center w-fit mx-auto cursor-pointer hover:bg-neutral-300 dark:hover:bg-neutral-600 ${activePage === item.Index ? "bg-neutral-300 dark:bg-neutral-700" : ""} px-10 py-6 rounded-lg`}
                >
                  <div></div>
                  <div 
                    className={`bg-white shadow-xl border-gray-300 border-2 ${activePage === item.Index && "border-active-color"}`} 
                    style={{width: item.width / 4, height: item.height / 4}}
                  >

                  </div>
                  <div className={`text-text-color dark:text-white ${activePage === item.Index ? "text-blue-900 font-semibold" : ""}`}>
                    {item.Index}
                  </div>
                </div>
              ))
            }
          </div>
        </Scrollbars>
      <div className="thumbs-footer"></div>
    </div>
  )
}


const Page = ({item, totalPages, setDocumentSchema}) => {
  const pageRef = useRef();
  const { scale, rotation } = useStateContext();

  var observer = new IntersectionObserver(async function(entries) { 
    if(entries[0]['isIntersecting'] === true) {
      const currentPage = item;
        if(!currentPage.isLoaded) {
        console.log(entries[0].target.id);
        await wait(1000);
        setDocumentSchema(prev => {
          prev.pages.filter(itm => itm.Index === item.Index)[0].isLoaded = true;
          return {...prev}
        })
      }
    }
  }, { threshold: [0, 0.5, 1] });

  useEffect(() => {
    observer.observe(pageRef.current);
  }, []);


  return (
    <div key={item.Index} className="page-item mb-4" id={`page_${item.Index}`} ref={pageRef}>
      <div 
        className="text-9xl shadow-lg bg-white overflow-hidden text-text-color" 
        style={{width: item.width * scale, height: item.height * scale, transform: `rotate(${rotation}deg)`}}
      >
        {!item.isLoaded ? <Spinner size='xl' /> : item.Index}
      </div>
      <div className='flex justify-between'>
        <div>file.png</div>
        <div>{item.Index} / {totalPages}</div>
      </div>
    </div>
  )
}
const Document = ({ pages, actions, setDocumentSchema }) => {
  const { activePage, setActivePage, scale } = useStateContext();

  return (
    <div className="flex-[7] flex flex-col bg-neutral-100 px-4 dark:bg-neutral-700 overflow-auto">
      <div className="pages-header">
        <div className="flex justify-center p-2 overflow-auto">
          <div className='flex gap-2 items-center'>
            {actions?.map((item, i) => (
              <button 
                key={i}
                onClick={() => {
                  setActivePage(item.page);
                  const element = document.getElementById(`page_${item.page}`);
                  if (element) element.scrollIntoView();
                }} 
                className="bg-gray-300 hover:bg-blue-active-color text-gray-500 dark:text-gray-50 dark:bg-main-dark-bg dark:hover:bg-blue-active-color hover:text-white w-6 h-6 rounded-full hover:scale-105  active:scale-100 transition-all"
              >
                <span>{i+1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='pages-body h-full'>
        <Scrollbars style={{ height: "100%" }}>
          <div className='pages block h-full'>
              {
                pages?.map((item) => (
                  <div className="mx-auto" style={{ width: item.width * scale }}>
                    <Page
                      key={item.Index}
                      item={item} 
                      totalPages={pages.length} 
                      setDocumentSchema={setDocumentSchema}
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
    <div className="w-screen h-screen overflow-hidden bg-white">
      <Header />
      {/* <Toolbar /> */}

      <main className="flex h-full pt-14 md:pt-16">
        {activeThumbnailes && <Thumbs pages={docSchema.pages} />}
        <Document 
          pages={documentSchema.pages} 
          actions={documentSchema.actions}
          totalPages={documentSchema.numOfPages} 
          setDocumentSchema={setDocumentSchema} 
        />
      </main>
    </div>
  )
}

export default ESignDocument