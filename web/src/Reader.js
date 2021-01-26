import React, { useState } from 'react';

function Topbar(props) {
    return (
        <div className={"flex justify-between items-center animated slideInDown faster block fixed inset-x-0 top-0 z-50 bg-gray-800 z-50 content-end opacity-75 pt-safe-top pb-2 text-gray-50"}>
            <button className={"mx-2"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <span className={"truncate"}>{props.title}</span>
            <button className={"mx-2"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
        </div>
    )
}

function Bottombar(props) {
    return (
        <div className={"flex justify-between items-center animated slideInDown faster block fixed inset-x-0 bottom-0 z-50 bg-gray-800 z-50 content-end opacity-75 pt-2 pb-safe-bottom text-gray-50"}>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
            </button>
            <div>
                <span>{props.currentPage}</span>
                <span>/</span>
                <span>{props.pageLength}</span>
            </div>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
            </button>
        </div>
    )
}

function VerticalReader(props) {
    return (
        <div className={"h-screen overflow-y-auto"}>
            {props.pages.map((p, index) => (
                <img className={"page my-1 mx-auto"} key={index} src={p.URL} alt={index}></img>
            ))}
        </div>
    )
}


function SingleReader(props) {
    return (
        <div>
            <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => props.setCurrentPage(props.currentPage - 1)}></div>
            <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"}></div>
            <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => props.setCurrentPage(props.currentPage + 1)}></div>
            {props.pages.map((p, index) => (
                <img className={`mx-auto h-screen ${props.currentPage !== index ? "hidden" : "block"}`} key={index} src={p.URL} alt={index}></img>
            ))}
        </div>
    )
}

function DoubleReader(props) {
    return (
        <div>
            <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => props.setCurrentPage(props.currentPage - 2)}></div>
            <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"}></div>
            <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => props.setCurrentPage(props.currentPage + 2)}></div>
            <div className={"flex h-screen justify-center overflow-visible flex-row"}>
                {props.pages.map((p, index) => (
                    <img className={`object-contain h-screen  ${index === props.currentPage || index === props.currentPage + 1 ? "block" : "hidden"}`} key={index} src={p.URL} alt={index}></img>
                ))}
            </div>
        </div>
    )
}


function Reader(props) {
    const [currentPage, setCurrentPage] = useState(0);
    const [chapter, setChapter] = useState();

    React.useState(() => {
        fetch(`/api/chapter/${props.chapterId}`)
            .then((response) => response.json())
            .then((data) => {
                setChapter(data);
            }).catch((e) => {
                console.log(e);
            });
    })

    if (!chapter) {
        return <div></div>
    }

    return (
        <div>
            <Topbar title={chapter.Title !== "" ? chapter.Title : chapter.Number}/>
            <div className={"bg-gray-50"}>
                <DoubleReader currentPage={currentPage} setCurrentPage={setCurrentPage} pages={chapter.Pages}/>
            </div>
            <Bottombar currentPage={currentPage} pageLength={chapter.Pages.length}/>
        </div>
    )
}

export default Reader;