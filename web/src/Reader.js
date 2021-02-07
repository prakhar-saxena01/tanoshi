import { Link } from '@reach/router';
import React, { useRef, useState } from 'react';
import ReaderSetting from './common/ReaderSetting';

function Topbar(props) {
    return (
        <div className={`flex justify-between items-center animate__animated  ${props.visible ? "animate__slideInDown" : "animate__slideOutUp"} animate__faster block fixed inset-x-0 top-0 z-50 bg-gray-800 z-50 content-end opacity-75 pt-safe-top pb-2 text-gray-50`}>
            <Link className={"mx-2"} to={`/manga/${props.mangaId}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </Link>
            <div className={"flex flex-col truncate"}>
                <span>{props.mangaTitle}</span>
                <span>{props.chapterTitle}</span>
            </div>
            <button className={"mx-2"} onClick={(e) => props.onReaderSetting()}>
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
            <button className={"mx-2"} onClick={(e) => props.setChapterId(props.prev)} disabled={props.prev === 0}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
            </button>
            <div>
                <span>{props.currentPage + 1}</span>
                <span>/</span>
                <span>{props.pageLength}</span>
            </div>
            <button className={"mx-2"} onClick={(e) => props.setChapterId(props.next)} disabled={props.next === 0}>
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
            <div ref={el} className={"h-screen w-screen overflow-y-auto"} onScroll={onscroll} onClick={() => props.onHideBar()}>
                {props.pages.map((p, index) => (
                    <img ref={(el) => refs.current[index] = el} className={`page my-2 mx-auto ${props.currentPage !== index ? "page" : ""}`} key={index} src={`/api/proxy?url=${p.URL}`} alt={index} onLoad={() => scrollto(index)}></img>
                ))}
            </div>
        )
    } else if (props.readerMode === "paged") {
        if (props.displayMode === "single") {
            return (
                <div className={"w-full self-center"}>
                    <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => prevPage(1)}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"} onClick={() => props.onHideBar()}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => nextPage(1)}></div>
                    {props.pages.map((p, index) => (
                        <img className={`h-auto md:h-screen mx-auto ${props.currentPage !== index ? "hidden" : "block"}`} key={index} src={`/api/proxy?url=${p.URL}`} alt={index}></img>
                    ))}
                </div>
            )
        } else if (props.displayMode === "double") {
            return (
                <div className={"w-full self-center"}>
                    <div className={"h-screen w-1/3 cursor-pointer fixed left-0"} onClick={() => prevPage(2)}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed inset-x-0 mx-auto"} onClick={() => props.onHideBar()}></div>
                    <div className={"h-screen w-1/3 cursor-pointer fixed right-0"} onClick={() => nextPage(2)}></div>
                    <div className={`flex justify-center overflow-x-auto ${props.direction === "righttoleft" ? "flex-row-reverse" : "flex-row"}`}>
                        {props.pages.map((p, index) => (
                            <img className={`object-contain h-screen max-w-1/2 ${index === props.currentPage || index === props.currentPage + 1 ? "block" : "hidden"}`} key={index} src={`/api/proxy?url=${p.URL}`} alt={index}></img>
                        ))}
                    </div>
                </div>
            )
        }
    }
    return (
        <div></div>
    )
}

function Reader(props) {
    const [mangaId, setMangaId] = React.useState();
    const [chapterId, setChapterId] = React.useState(props.chapterId);
    
    const defaultSetting = {
        readerMode: "paged",
        displayMode: "single",
        direction: "lefttoright",
        background: "white"
    };
    const getItem = (key) => {
        var settingPath = mangaId ? `/${mangaId}` : "";
        let setting = localStorage.getItem(`${key}${settingPath}`);
        if (!setting) {
            setting = localStorage.getItem(`${key}`);
        }
        if (!setting) {
            localStorage.setItem(key, defaultSetting[key]);
            setting = localStorage.getItem(`${key}`);
        }
        return setting
    }

    const [manga, setManga] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [chapter, setChapter] = useState();
    const [barVisible, setBarVisible] = useState(true);

    const [showReaderSetting, setReaderSetting] = useState(false);
    const [readerMode, setReaderMode] = React.useState(getItem("readerMode"));
    const [displayMode, setDisplayMode] = React.useState(getItem("displayMode"));
    const [direction, setDirection] = React.useState(getItem("direction"));
    const [background, setBackground] = React.useState(getItem("background"));

    const [isLoading, setLoading] = React.useState(false);

    const didMountRef = useRef(false);

    /*
    * Get chapter details
    */
    React.useEffect(() => {
        setLoading(true);
        fetch(`/api/chapter/${chapterId}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then((data) => {
                setChapter(data);
                setCurrentPage(data.LastPageRead);
                setMangaId(data.MangaID);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
            });
    }, [chapterId])

    /*
    * Get manga details
    */
    React.useEffect(() => {
        if (!mangaId) {
            return
        }
        setLoading(true);
        fetch(`/api/manga/${mangaId}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then((data) => {
                setManga(data);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
            });
    }, [mangaId])

    React.useEffect(() => {
        if (showReaderSetting && !barVisible) {
            setReaderSetting(false);
        }
    }, [showReaderSetting, barVisible])


    /*
    * Post chapter history
    */
    React.useEffect(() => {
        if (currentPage > 0) {
            fetch(`/api/history/chapter/${chapterId}?page=${currentPage}`, { method: "PUT" })
                .then((response) => response)
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [chapterId, currentPage])

    /*
    * Get reader settings
    */
    React.useEffect(() => {
        if (didMountRef.current) {
            localStorage.setItem(`readerMode/${mangaId}`, readerMode);
            localStorage.setItem(`displayMode/${mangaId}`, displayMode);
            localStorage.setItem(`direction/${mangaId}`, direction);
            localStorage.setItem(`background/${mangaId}`, background);
        } else {
            didMountRef.current = true;
        }
    }, [readerMode, displayMode, direction, background, mangaId])

    const handlSetChapter = (chapter) => {
        setCurrentPage(0);
        setChapterId(chapter);
    }

    return (
        <div className={`min-h-screen flex ${background === "black" ? "bg-gray-900" : "bg-white"}`}>
            <Topbar mangaId={mangaId} mangaTitle={manga &&manga.Title} chapterTitle={chapter ? chapter.Title !== "" ? `Ch. ${chapter.Number} - ${chapter.Title}` : chapter.Number : ""} visible={barVisible} onReaderSetting={() => setReaderSetting(!showReaderSetting)} />
            <ReaderWrapper readerMode={readerMode} displayMode={displayMode} direction={direction} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={chapter ? chapter.Pages : []} onHideBar={() => setBarVisible(!barVisible)} />
            <Bottombar currentPage={currentPage} pageLength={chapter ? chapter.Pages.length : 0} visible={barVisible} setChapterId={handlSetChapter}  prev={chapter ? chapter.Prev : 0} next={chapter ? chapter.Next : 0}/>
            {showReaderSetting &&
                <div className={"fixed z-50 right-0 mt-10"}>
                    <ReaderSetting mangaId={chapter && chapter.MangaID} setReaderMode={setReaderMode} setDisplayMode={setDisplayMode} setDirection={setDirection} setBackground={setBackground} />
                </div>
            }
        </div>
    )
}

export default Reader;