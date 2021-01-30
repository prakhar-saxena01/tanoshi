import { navigate } from '@reach/router';
import React, { useState } from 'react';

function Topbar(props) {
    return (
        <div className={`flex justify-between items-center animate__animated  ${props.visible ? "animate__slideInDown" : "animate__slideOutUp"} animate__faster block fixed inset-x-0 top-0 z-50 bg-gray-800 z-50 content-end opacity-75 pt-safe-top pb-2 text-gray-50`}>
            <button className={"mx-2"} onClick={(e) => navigate(-1)}>
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
        <div className={`flex justify-between items-center animate__animated ${props.visible ? "animate__slideInUp" : "animate__slideOutDown"} fanimate__aster block fixed inset-x-0 bottom-0 z-50 bg-gray-800 z-50 content-end opacity-75 pt-2 pb-safe-bottom text-gray-50`}>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
            </button>
            <div>
                <span>{props.currentPage + 1}</span>
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

function ReaderWrapper(props) {
    const el = React.useRef();
    const refs = React.useRef({});

    const nextPage = (val) => {
        if (props.currentPage + val < props.pages.length) {
            props.setCurrentPage(props.currentPage + val)
        }
    }

    const prevPage = (val) => {
        if (props.currentPage - val >= 0) {
            props.setCurrentPage(props.currentPage - val)
        }
    }

    const onscroll = (e) => {
        e.preventDefault();

        let page = 0;
        for (let i = 0; i < props.pages.length; i++) {
            if (e.target.scrollTop > refs.current[i].offsetTop) {
                page = i;
            } else {
                break;
            }
        }
        props.setCurrentPage(page);
    }

    const scrollto = (index) => {
        if (index !== props.currentPage) {
            return
        }
        if (refs && refs.current[index]) {
            refs.current[index].scrollIntoView();
        }
    }

    if (props.readerMode === "continous") {
        return (
            <div ref={el} className={"h-screen overflow-y-auto"} onScroll={onscroll}>
                {props.pages.map((p, index) => (
                    <img ref={(el) => refs.current[index] = el} className={"page my-2 mx-auto"} key={index} src={`/api/proxy?url=${p.URL}`} alt={index} onLoad={() => scrollto(index)}></img>
                ))}
            </div>
        )
    } else if (props.readerMode === "paged") {
        if (props.displayMode === "single") {
            return (
                <div className={"self-center"}>
                    <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => prevPage(1)}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"} onClick={() => props.onHideBar()}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => nextPage(1)}></div>
                    {props.pages.map((p, index) => (
                        <img className={`h-auto md:h-screen ${props.currentPage !== index ? "hidden" : "block"}`} key={index} src={`/api/proxy?url=${p.URL}`} alt={index}></img>
                    ))}
                </div>
            )
        } else if (props.displayMode === "double") {
            return (
                <div className={"self-center"}>
                    <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => prevPage(2)}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"} onClick={() => props.onHideBar()}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => nextPage(2)}></div>
                    <div className={`w-screen flex justify-center overflow-x-auto ${props.direction === "righttoleft" ? "flex-row-reverse" : "flex-row"}`}>
                        {props.pages.map((p, index) => (
                            <img className={`object-contain h-screen max-w-1/2 ${index === props.currentPage || index === props.currentPage + 1 ? "block" : "hidden"}`} key={index} src={`/api/proxy?url=${p.URL}`} alt={index}></img>
                        ))}
                    </div>
                </div>
            )
        }
    } else {
        return (
            <div></div>
        )
    }
}

function Reader(props) {
    const [currentPage, setCurrentPage] = useState(0);
    const [chapter, setChapter] = useState();
    const [barVisible, setBarVisible] = useState(true);

    const [readerMode, setReaderMode] = React.useState();
    const [displayMode, setDisplayMode] = React.useState();
    const [direction, setDirection] = React.useState();
    const [background, setBackground] = React.useState();

    React.useEffect(() => {
        let readerMode = localStorage.getItem("readerMode");
        if (readerMode === "") {
            readerMode = "paged";
            localStorage.setItem("readerMode", readerMode);
        }
        setReaderMode(readerMode);

        let displayMode = localStorage.getItem("displayMode");
        if (displayMode === "") {
            displayMode = "single";
            localStorage.setItem("displayMode", displayMode);
        }
        setDisplayMode(displayMode);

        let direction = localStorage.getItem("direction");
        if (direction === "") {
            direction = "lefttoright";
            localStorage.setItem("direction", direction);
        }
        setDirection(direction);

        let background = localStorage.getItem("background");
        if (background === "") {
            background = "white";
            localStorage.setItem("background", background);
        }
        setBackground(background);

        if (!chapter) {
            fetch(`/api/chapter/${props.chapterId}`)
                .then((response) => response.json())
                .then((data) => {
                    setChapter(data);
                    setCurrentPage(data.LastPageRead);
                }).catch((e) => {
                    console.log(e);
                });
        }
    })

    React.useEffect(() => {
        if (currentPage > 0) {
            fetch(`/api/history/chapter/${props.chapterId}?page=${currentPage}`, { method: "PUT" })
                .then((response) => response)
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [props.chapterId, currentPage])

    return (
        <div className={`min-h-screen flex ${background === "black" ? "bg-gray-900" : "bg-white"}`}>
            <Topbar title={chapter ? chapter.Title !== "" ? chapter.Title : chapter.Number : ""} visible={barVisible} />
            <ReaderWrapper readerMode={readerMode} displayMode={displayMode} direction={direction} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={chapter ? chapter.Pages : []} onHideBar={() => setBarVisible(!barVisible)} />
            <Bottombar currentPage={currentPage} pageLength={chapter ? chapter.Pages.length : 0} visible={barVisible} />
        </div>
    )
}

export default Reader;