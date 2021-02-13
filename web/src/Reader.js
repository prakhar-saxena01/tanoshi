import { navigate } from '@reach/router';
import React, { useState } from 'react';
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
    Backdrop,
    DialogTitle,
    DialogContent
} from '@material-ui/core';
import ReaderSetting from './common/ReaderSetting';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
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
        zIndex: theme.zIndex.drawer + 1,
        paddingTop: 'env(safe-area-inset-top)'
    },
    dialog: {
        zIndex: theme.zIndex.drawer + 2,
    },
    toolbar: {
        marginTop: 'env(safe-area-inset-top)'
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 2,
        color: '#fff',
    },
    topBar: {
        opacity: '75%',
        backgroundColor: '#000000',
        paddingTop: 'env(safe-area-inset-top)'
    },
    bottomBar: {
        bottom: 0,
        top: 'auto',
        opacity: '75%',
        backgroundColor: '#000000',
        paddingBottom: 'env(safe-area-inset-bottom)'
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
                        <ArrowBackIosIcon />
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
                    <IconButton color='primary' onClick={(e) => props.setChapterId(prev, true)} disabled={prev === 0}>
                        <SkipPreviousIcon />
                    </IconButton>
                    <Slider
                        getAriaValueText={() => currentPage}
                        aria-labelledby="page-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={pageLength - 1}
                        value={currentPage || 0}
                        onChange={(e, val) => setCurrentPage(val)} />
                    <IconButton color='primary' className={"mx-2"} onClick={(e) => setChapterId(next, true)} disabled={next === 0}>
                        <SkipNextIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Slide>
    )
}

function ReaderWrapper(props) {
    const classes = useStyles();

    const {
        pages,
        currentPage,
        setCurrentPage,
        readerMode,
        displayMode,
        background,
        direction,
        fit,
        onHideBar,
        next,
        prev,
        setChapterId
    } = props;

    const el = React.useRef();
    const refs = React.useRef({});

    const nextPage = (val) => {
        if (currentPage + val < pages.length) {
            setCurrentPage(currentPage + val)
        } else {
            if (next) {
                setChapterId(next, true);
            }
        }
    }

    const prevPage = (val) => {
        if (currentPage - val >= 0) {
            setCurrentPage(currentPage - val)
        } else {
            if (prev) {
                setChapterId(prev, true);
            }
        }
    }

    const onscroll = (e) => {
        e.preventDefault();

        let page = 0;
        for (let i = 0; i < pages.length; i++) {
            if (refs.current[i] && window.pageYOffset > refs.current[i].offsetTop) {
                page = i;
            } else {
                break;
            }
        }
        setCurrentPage(page);
    }

    let scrollListener = null;
    if (readerMode === 'continous') {
        scrollListener = window.addEventListener('scroll', onscroll);
    }

    React.useEffect(() => {
        if (scrollListener) {
            return window.removeEventListener('scroll', scrollListener);
        }
    });

    const scrollto = (index) => {
        if (index !== currentPage) {
            return
        }
        if (refs && refs.current[index]) {
            refs.current[index].scrollIntoView();
        }
    }

    if (readerMode === "continous") {
        window.addEventListener('scroll', onscroll);
        return (
            <Box maxWidth='100vw' ref={el} onClick={() => onHideBar()} bgcolor={background} display='flex' flexDirection='column' alignItems='center'>
                {pages.map((p, index) => (
                    <Box key={index} component="img" width={{ xs: '100vw', md: '75%', lg: 'auto' }} height={{ xs: 'auto', lg: '100vh' }} ref={(el) => refs.current[index] = el} src={`/api/proxy?url=${p.URL}`} alt={index} onLoad={() => scrollto(index)}></Box>
                ))}
            </Box>
        )
    } else if (readerMode === "paged") {
        if (displayMode === "single") {
            return (
                <React.Fragment>
                    <Box position='fixed' height='100vh' width='100vw' display='flex' flexDirection={direction === "righttoleft" ? "row-reverse" : "row"}>
                        <Box className={classes.readerButton} onClick={() => prevPage(1)}></Box>
                        <Box className={classes.readerButton} onClick={() => onHideBar()}></Box>
                        <Box className={classes.readerButton} onClick={() => nextPage(1)}></Box>
                    </Box>
                    <Box minHeight='100vh' width='fit-content' minWidth='100%' display="flex" justifyContent="center" bgcolor={background}>
                        {pages.map((p, index) => (
                            <Box
                                key={index}
                                component="img"
                                margin="auto"
                                height={fit === 'height' ? '100vh' : 'auto'}
                                width={fit === 'width' ? '100%' : 'auto'}
                                display={index === currentPage ? "block" : "none"}
                                src={`/api/proxy?url=${p.URL}`} alt={index}></Box>
                        ))}
                    </Box>
                </React.Fragment>
            )
        } else if (displayMode === "double") {
            return (
                <React.Fragment>
                    <Box position='fixed' height='100vh' width='100vw' display='flex' flexDirection={direction === "righttoleft" ? "row-reverse" : "row"}>
                        <Box className={classes.readerButton} onClick={() => prevPage(2)}></Box>
                        <Box className={classes.readerButton} onClick={() => onHideBar()}></Box>
                        <Box className={classes.readerButton} onClick={() => nextPage(2)}></Box>
                    </Box>
                    <Box minHeight='100vh' width='100vw' display='flex' bgcolor={background}>
                        <Box width='fit-content' height='fit-content' margin='auto' display="flex" justifyContent="center" flexDirection={direction === "righttoleft" ? "row-reverse" : "row"}>
                            {pages.map((p, index) => (
                                <Box
                                    key={index}
                                    component="img"
                                    margin="auto"
                                    height={fit === 'height' ? '100vh' : 'auto'}
                                    width={fit === 'width' ? (index === pages.length - 1 && index % 2 === 0) ? '100vw' : '50%' : 'auto'}
                                    display={index === currentPage || index === currentPage + 1 ? "block" : "none"}
                                    src={`/api/proxy?url=${p.URL}`}
                                    alt={index}></Box>
                            ))}
                        </Box>
                    </Box>
                </React.Fragment>
            )
        }
    }
    return (
        <div></div>
    )
}

function Reader(props) {
    const classes = useStyles();

    const [mangaId, setMangaId] = React.useState();
    const [chapterId, setChapterId] = React.useState({ id: props.chapterId, reset: false });

    const [manga, setManga] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [chapter, setChapter] = useState();
    const [barVisible, setBarVisible] = useState(true);

    const [showReaderSetting, setReaderSetting] = useState(false);
    const [readerMode, setReaderMode] = React.useState();
    const [displayMode, setDisplayMode] = React.useState();
    const [direction, setDirection] = React.useState();
    const [background, setBackground] = React.useState();
    const [fit, setFit] = React.useState();

    const [isLoading, setLoading] = React.useState(false);

    /*
    * Get chapter details
    */
    React.useEffect(() => {
        setChapter(null);
        setLoading(true);
        fetch(`/api/chapter/${chapterId.id}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then((data) => {
                setChapter(data);
                setCurrentPage(chapterId.reset ? 0 : data.LastPageRead);
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
            background: "white",
            fit: 'height'
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
        setBackground(getItem("background"));
        setBackground(getItem("background"));
        setFit(getItem("fit"));

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
            fetch(`/api/history/chapter/${chapterId.id}?page=${currentPage}`, { method: "PUT" })
                .then((response) => response)
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [chapterId, currentPage])

    const handlSetChapter = (id, reset) => {
        setChapterId({ id: id, reset: reset });
    }

    return (
        <React.Fragment>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Topbar
                mangaId={mangaId}
                mangaTitle={manga && manga.Title}
                chapterTitle={chapter ? chapter.Title !== "" ? `Ch. ${chapter.Number} - ${chapter.Title}` : chapter.Number : ""}
                visible={barVisible}
                onReaderSetting={() => setReaderSetting(!showReaderSetting)} />
            {mangaId && <ReaderWrapper
                readerMode={readerMode}
                displayMode={displayMode}
                direction={direction}
                background={background}
                fit={fit}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pages={chapter ? chapter.Pages : []}
                onHideBar={() => setBarVisible(!barVisible)}
                setChapterId={handlSetChapter}
                prev={chapter ? chapter.Prev : 0}
                next={chapter ? chapter.Next : 0} />}
            <Bottombar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageLength={chapter ? chapter.Pages.length : 0}
                visible={barVisible}
                setChapterId={handlSetChapter}
                prev={chapter ? chapter.Prev : 0}
                next={chapter ? chapter.Next : 0} />
            <Dialog fullWidth className={classes.dialog} onClose={() => setReaderSetting(false)} open={showReaderSetting}>
                <DialogTitle>Settings</DialogTitle>
                <DialogContent>
                    <ReaderSetting
                        mangaId={chapter && chapter.MangaID}
                        setReaderMode={setReaderMode}
                        setDisplayMode={setDisplayMode}
                        setDirection={setDirection}
                        setBackground={setBackground}
                        setFit={setFit} />
                </DialogContent>
            </Dialog >
        </React.Fragment>
    )
}

export default Reader;