import { navigate } from '@reach/router';
import React, { useRef, useState } from 'react';
import {
    makeStyles,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Dialog,
    Slide,
    Slider,
    Backdrop
} from '@material-ui/core';
import ReaderSetting from './common/ReaderSetting';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    titleBox: {
        flexGrow: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    title: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
    },
    button: {
        width: '100%',
        marginTop: '0.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    appBar: {

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    topBar: {
        opacity: '75%',
        backgroundColor: '#000000'
    },
    bottomBar: {
        bottom: 0,
        top: 'auto',
        opacity: '75%',
        backgroundColor: '#000000'
    },
    pageIndicator: {
        flexGrow: 1,
    },
    setting: {
        minWidth: '50%'
    },
    readerButton: {
        flex: '1 1 0px',
    },
    leftButton: {
        left: 0,
        position: 'fixed',
        width: '33.33%',
        height: '100vh'
    },
    middleButton: {
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'fixed',
        width: '33.33%',
        height: '100vh'
    },
    rightButton: {
        right: 0,
        position: 'fixed',
        width: '33.33%',
        height: '100vh'
    }
}));


function Topbar(props) {
    const classes = useStyles();

    return (
        <Slide direction="down" in={props.visible}>
            <AppBar className={classes.topBar}>
                <Toolbar>
                    <IconButton color='primary' className={"mx-2"} onClick={() => navigate(`/manga/${props.mangaId}`)}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Box className={classes.titleBox}>
                        <Typography variant="subtitle1" className={classes.title}>
                            {props.mangaTitle}
                        </Typography>
                        <Typography variant="caption" className={classes.title}>
                            {props.chapterTitle}
                        </Typography>
                    </Box>
                    <IconButton color='primary' onClick={(e) => props.onReaderSetting()}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Slide>
    )
}

function Bottombar(props) {
    const classes = useStyles();

    const {
        visible,
        currentPage,
        pageLength,
        next,
        prev,
        setChapterId,
        setCurrentPage } = props;

    return (
        <Slide direction="up" in={visible}>
            <AppBar className={classes.bottomBar}>
                <Toolbar>
                    <IconButton color='primary' onClick={(e) => props.setChapterId(prev)} disabled={prev === 0}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <Slider
                        getAriaValueText={() => currentPage}
                        aria-labelledby="page-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={pageLength}
                        onChange={(e, val) => setCurrentPage(val)} />
                    <IconButton color='primary' className={"mx-2"} onClick={(e) => setChapterId(next)} disabled={next === 0}>
                        <SkipNextIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Slide>
    )
}

function ReaderWrapper(props) {
    const classes = useStyles();

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
            <Box height='100vh' width='100vw' overflow={{ y: 'auto' }} ref={el} onScroll={onscroll} onClick={() => props.onHideBar()}>
                {props.pages.map((p, index) => (
                    <Box key={index} component="img" width='100vw' ref={(el) => refs.current[index] = el} className={`page my-2 mx-auto ${props.currentPage !== index ? "page" : ""}`} src={`/api/proxy?url=${p.URL}`} alt={index} onLoad={() => scrollto(index)}></Box>
                ))}
            </Box>
        )
    } else if (props.readerMode === "paged") {
        if (props.displayMode === "single") {
            return (
                <Box display="flex" alignItems="center" height='100vh' width='100vw'>
                    <Box className={classes.leftButton} onClick={() => prevPage(1)}></Box>
                    <Box className={classes.middleButton} onClick={() => props.onHideBar()}></Box>
                    <Box className={classes.rightButton} onClick={() => nextPage(1)}></Box>
                    {props.pages.map((p, index) => (
                        <Box key={index} component="img" margin="auto" height={{ xs: 'auto', md: '100vh' }} width={{ xs: '100vw', md: 'auto' }} display={index === props.currentPage ? "block" : "none"} src={`/api/proxy?url=${p.URL}`} alt={index}></Box>
                    ))}
                </Box>
            )
        } else if (props.displayMode === "double") {
            return (
                <Box height='100vh' width='100vw' display='flex'>
                    <Box position='fixed' height='100vh' width='100vw' display='flex' flexDirection={props.direction === "righttoleft" ? "row-reverse" : "row"}>
                        <Box className={classes.readerButton} onClick={() => prevPage(2)}></Box>
                        <Box className={classes.readerButton} onClick={() => props.onHideBar()}></Box>
                        <Box className={classes.readerButton} onClick={() => nextPage(2)}></Box>
                    </Box>
                    <Box width={{ xs: 'fit-content', lg: '100vw' }} display="flex" justifyContent="center" flexDirection={props.direction === "righttoleft" ? "row-reverse" : "row"}>
                        {props.pages.map((p, index) => (
                            <Box key={index} component="img" margin="auto" maxHeight='100vh' maxWidth='50%' display={index === props.currentPage || index === props.currentPage + 1 ? "block" : "none"} src={`/api/proxy?url=${p.URL}`} alt={index}></Box>
                        ))}
                    </Box>
                </Box>
            )
        }
    }
    return (
        <div></div>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Reader(props) {
    const classes = useStyles();

    const [mangaId, setMangaId] = React.useState();
    const [chapterId, setChapterId] = React.useState(props.chapterId);

    const [manga, setManga] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [chapter, setChapter] = useState();
    const [barVisible, setBarVisible] = useState(true);

    const [showReaderSetting, setReaderSetting] = useState(false);
    const [readerMode, setReaderMode] = React.useState();
    const [displayMode, setDisplayMode] = React.useState();
    const [direction, setDirection] = React.useState();
    const [background, setBackground] = React.useState();

    const [isLoading, setLoading] = React.useState(false);

    const didMountRef = useRef(false);

    /*
    * Get chapter details
    */
    React.useEffect(() => {
        setChapter(null);
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

        const defaultSetting = {
            readerMode: "paged",
            displayMode: "single",
            direction: "lefttoright",
            background: "white"
        };

        const getItem = (key) => {
            var settingPath = `/${mangaId}`;
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

        setReaderMode(getItem("readerMode"));
        setDisplayMode(getItem("displayMode"));
        setDirection(getItem("direction"));
        setBackground(getItem("background"));

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
        if (didMountRef.current && mangaId) {
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
        <React.Fragment>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Topbar mangaId={mangaId} mangaTitle={manga && manga.Title} chapterTitle={chapter ? chapter.Title !== "" ? `Ch. ${chapter.Number} - ${chapter.Title}` : chapter.Number : ""} visible={barVisible} onReaderSetting={() => setReaderSetting(!showReaderSetting)} />
            {mangaId && <ReaderWrapper readerMode={readerMode} displayMode={displayMode} direction={direction} currentPage={currentPage} setCurrentPage={setCurrentPage} pages={chapter ? chapter.Pages : []} onHideBar={() => setBarVisible(!barVisible)} />}
            <Bottombar currentPage={currentPage} setCurrentPage={setCurrentPage} pageLength={chapter ? chapter.Pages.length : 0} visible={barVisible} setChapterId={handlSetChapter} prev={chapter ? chapter.Prev : 0} next={chapter ? chapter.Next : 0} />
            <Dialog fullScreen onClose={() => setReaderSetting(false)} open={showReaderSetting} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={() => setReaderSetting(false)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Reader Setting
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <ReaderSetting mangaId={chapter && chapter.MangaID} setReaderMode={setReaderMode} setDisplayMode={setDisplayMode} setDirection={setDirection} setBackground={setBackground} />
            </Dialog >
        </React.Fragment>
    )
}

export default Reader;