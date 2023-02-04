import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { docSchema } from './data/docSchema'
import wait from 'waait';


function App() {
  const [activePage, setActivePage] = useState(1);
  const [documentSchema, setDocumentSchema] = useState(docSchema);
  const [zoom, setZoom] = useState(0.4);


  useEffect(() => {
    setDocumentSchema(prev => {
      prev.pages.filter(itm => itm.Index === 1)[0].isLoaded = true;
      return {...prev}
    })
  }, []);
  return (
    <div className="h-screen bg-slate-600">
      <header className='bg-gray-200 py-4 px-8 fixed w-full shadow-lg h-40'>
        <div className='flex justify-between items-center mb-2'>
          <p className='font-bold text-4xl text-blue-900'>SALIC</p>
          <div>
            <div className='text-sm'>
              <p><b>Inviter Name: </b>{documentSchema.invitor.Name}</p>
              <p><b>Inviter Email: </b>{documentSchema.invitor.Email}</p>
              <p><b>Date: </b>{documentSchema.invitor.inviteAt}</p>
              <p><b>#Pages: </b>{documentSchema.numOfPages}</p>
            </div>
          </div>
        </div>
        <div>
          <div className='flex gap-2 items-center'>
            {documentSchema.actions.map((item, i) => (
              <button 
                key={i}
                onClick={() => {
                  setActivePage(item.page);
                  const element = document.getElementById(`page_${item.page}`);
                  if (element) {
                    element.scrollIntoView();
                  }
                }} 
                className="bg-gray-500 w-6 h-6 rounded-md text-center text-white hover:scale-105 hover:bg-blue-900 active:scale-100 transition-all"
              >
                <span>{i+1}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className='flex h-full pt-40'>
        <div className='w-36 bg-gray-400 p-4 overflow-auto resize-x'>
          <div className='thumbs flex flex-col items-center gap-4'>
          {
            documentSchema.pages.map((item) => (
              <div 
                key={item.Index} 
                id={`thumb_${item.Index}`} 
                onClick={() => {
                  // setDocumentSchema(prev => {
                  //   prev.pages.filter(itm => itm.Index === item.Index)[0].isLoaded = true;
                  //   return prev
                  // })
                  setActivePage(item.Index);
                  const element = document.getElementById(`page_${item.Index}`);
                  if (element) {
                    element.scrollIntoView();
                  }
                }} 
                className="thumb-item text-center cursor-pointer"
              >
                <div></div>
                <div 
                  className={`bg-white shadow-xl border-gray-300 border-4 ${activePage === item.Index && "border-blue-900"}`} style={{width: item.width * 0.1, height: item.height * 0.1}}
                >...</div>
                <div className={`text-white ${activePage === item.Index ? "text-blue-900 font-semibold" : ""}`}>{item.Index}</div>
              </div>
            ))
          }
          </div>
        </div>
        <div id="pages__list" className='flex-[7] bg-slate-200 p-4 overflow-auto'>
          <div className='pages flex flex-col items-center gap-8'>
            {
              documentSchema.pages.map((item) => (
                <Page 
                  item={item} 
                  zoom={zoom} 
                  totalPages={documentSchema.numOfPages} 
                  pages={documentSchema.pages}
                  setActivePage={setActivePage}
                  setDocumentSchema={setDocumentSchema}
                />
              ))
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;



const Page = ({item, zoom, totalPages, setActivePage, pages, setDocumentSchema}) => {
  const pageRef = useRef();

  var observer = new IntersectionObserver(async function(entries) { 
    if(entries[0]['isIntersecting'] === true) {
      const currentPage = item;
        if(!currentPage.isLoaded) {
        console.log(entries[0].target.id);
        await wait(10000);
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
    <div key={item.Index} className="page-item" id={`page_${item.Index}`} ref={pageRef}>
      <div 
        className="flex items-center justify-center text-9xl bg-white shadow-lg overflow-hidden" 
        style={{width: item.width * zoom, height: item.height * zoom}}
      >
        {!item.isLoaded ? "..." : item.Index}
      </div>
      <div className='flex justify-between'>
        <div>file.png</div>
        <div>{item.Index} / {totalPages}</div>
      </div>
    </div>
  )
}