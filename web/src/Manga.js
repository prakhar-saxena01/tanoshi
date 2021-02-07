import React from 'react';
import { Link, navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

const useStyles = makeStyles((theme) => ({
    image: {
        paddingBottom: '141.5094339622642%',
    },
    img: {
        width: '8rem',
        objectFit: 'cover'
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: '60%',
        color: '#ffffff',
    },
    root: {

    }
}));

function Skeleton() {
    return (
        <React.Fragment className={"main overflow-auto w-full mx-auto lg:pl-48 px-2 flex flex-col h-auto"}>
            <Topbar>
            </Topbar>
            <div className={"w-full animate-tw-pulse"}>
                <div id={"detail"} className={"flex flex-col justify-center bg-white dark:bg-gray-800 p-2 mb-2 rounded shadow"}>
                    <div className={"flex"}>
                        <div className={"pb-7/6 mr-2"}>
                            <div className={"w-32 h-48 bg-gray-300 rounded object-cover"}></div>
                        </div>
                        <div className={"flex flex-col justify-left"}>
                            <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Authors</span>
                            <span className={"w-48 h-6 bg-gray-200 md:text-xl sm:text-sm text-gray-900 dark:text-gray-300 mr-2 text-left"}></span>
                            <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Status</span>
                            <span className={"w-48 h-6 bg-gray-200 md:text-xl sm:text-sm text-gray-900 dark:text-gray-300 mr-2 text-left"}></span>
                        </div>
                    </div>
                </div>
                <div id={"description"} className={"flex flex-col justify-center bg-white dark:bg-gray-800 p-2 mb-2 rounded shadow"}>
                    <div className={"flex"}>
                        <button className={"rounded p-2 border text-gray-900 dark:text-gray-50"}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                    <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Description</span>
                    <div className={"w-full space-y-2"}>
                        <div className={"w-full h-6 bg-gray-300"}></div>
                        <div className={"w-full h-6 bg-gray-300"}></div>
                        <div className={"w-full h-6 bg-gray-300"}></div>

                    </div>
                    <div className={"w-full flex flex-wrap"}>
                        <div className={"w-12 h-6 bg-gray-300 mr-2 rounded-full px-2 mt-2"}></div>
                        <div className={"w-12 h-6 bg-gray-300 mr-2 rounded-full px-2 mt-2"}></div>
                    </div>
                </div>
                <div id={"chapters"} className={"flex justify-center bg-white dark:bg-gray-800 p-2 rounded shadow"}>
                    <div className={"flex flex-col w-full divide-y-2 dark:divide-gray-900 divide-gray-100 space-y-2"}>
                        <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Chapters</span>
                        <div className={`flex inline-flex`} >
                            <div className={"flex justify-between items-center w-full text-gray-900 dark:text-gray-300"}>
                                <div className={"h-12 w-full bg-gray-300"}></div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                        <div className={`flex inline-flex`} >
                            <div className={"flex justify-between items-center w-full text-gray-900 dark:text-gray-300"}>
                                <div className={"h-12 w-full bg-gray-300"}></div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Navbar />
        </React.Fragment>
    )
}

function Manga(props) {
    const classes = useStyles();

    const [manga, setManga] = React.useState();
    const [favorite, setIsFavorite] = React.useState();

    React.useState(() => {
        if (!manga) {
            fetch(`/api/manga/${props.mangaId}?includeChapter=1`)
                .then((response) => response.json())
                .then((data) => {
                    setManga(data);
                    setIsFavorite(data.IsFavorite);
                }).catch((e) => {
                    console.log(e);
                });
        }
    }, [manga])

    const setFavorite = (val) => {
        fetch(`/api/library/manga/${props.mangaId}`, {
            method: val ? "POST" : "DELETE"
        })
            .then((response) => setIsFavorite(val))
            .catch((e) => {
                console.log(e);
            });
    }

    if (!manga) {
        return Skeleton();
    }

    return (
        <React.Fragment className={"main overflow-auto w-full lg:pl-48 flex flex-col h-auto"}>
            <Topbar>
            </Topbar>
            <Grid container spacing={2}>
                <Grid item>
                    <img className={classes.img} alt={manga && manga.Title} src={manga && `/api/proxy?url=${manga.CoverURL}`}></img>
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Typography gutterBottom variant="h6">
                            {manga && manga.Title}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {manga && manga.Authors}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {manga && manga.Status}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <IconButton variant="outlined" onClick={() => setFavorite(!favorite)}>
                {favorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            <Typography variant="h6">Description</Typography>
            <Typography gutterBottom variant="body1">{manga && manga.Description}</Typography>
            {manga && manga.Genres.split(',').map((genre, index) => (
                <Chip key={index} label={genre} variant="outlined" />
            ))}

            <List subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Chapters
                    </ListSubheader>
            }>
                {manga && manga.Chapters && manga.Chapters.map(ch => (
                    <ListItem button key={ch.ID} className={`flex inline-flex hover:bg-gray-200 dark:hover:bg-gray-700 p-2 ${ch.ReadAt ? "opacity-25" : "opacity-100"}`} onClick={() => navigate(`/chapter/${ch.ID}`)}>
                        <ListItemText
                            primary={ch.Title !== "" ? `Ch.${ch.Number} ${ch.Title}` : ch.Number}
                            secondary={new Date(ch.UploadedAt).toLocaleDateString()}
                        />
                    </ListItem>
                ))}
            </List>
            <Navbar />
        </React.Fragment>
    )
}


export default Manga;