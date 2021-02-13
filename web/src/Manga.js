import React from 'react';
import { navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Chip,
    IconButton,
    Box,
    BottomNavigation
} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import RefreshIcon from '@material-ui/icons/Refresh';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


const useStyles = makeStyles((theme) => ({
    image: {
        paddingBottom: '141.5094339622642%',
    },
    img: {
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
    genre: {
        marginRight: 2,
        marginBottom: 2
    },
    mangaTitle: {
        flexGrow: 1
    },
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
        maxWidth: '100%'
    },
    read: {
        opacity: '50%'
    },
    bottomNavigation: {
        backgroundColor: 'transparent'
    }
}));

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

    const refreshMangaDetails = () => {
        fetch(`/api/manga/${props.mangaId}?includeChapter=1&refresh=true`)
            .then((response) => response.json())
            .then((data) => {
                setManga(data);
                setIsFavorite(data.IsFavorite);
            }).catch((e) => {
                console.log(e);
            });
    }

    return (
        <React.Fragment>
            <Topbar>
            <IconButton color='inherit' onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" className={classes.mangaTitle}>
                    {manga && manga.Title}
                </Typography>
                <IconButton edge="end" variant="outlined" onClick={() => setFavorite(!favorite)}>
                    {favorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
                <IconButton edge="end" variant="outlined" onClick={() => refreshMangaDetails()}>
                    <RefreshIcon />
                </IconButton>
            </Topbar>
            <div className={classes.root}>
                <Navbar />
                <div className={classes.content}>
                    <Box padding={2}>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Box component='img' width={{ xs: '6rem', lg: '8rem' }} alt={manga && manga.Title} src={manga && `/api/proxy?url=${manga.CoverURL}`}></Box>
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
                        <Typography variant="h6">Description</Typography>
                        <Typography gutterBottom variant="body1">{manga && manga.Description}</Typography>
                        {manga && manga.Genres.split(',').map((genre, index) => (
                            <Chip key={index} label={genre} variant="outlined" className={classes.genre} />
                        ))}
                    </Box>
                    <List subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Chapters
                    </ListSubheader>
                    }>
                        {manga && manga.Chapters && manga.Chapters.map(ch => (
                            <ListItem button key={ch.ID} onClick={() => navigate(`/chapter/${ch.ID}`)} className={ch.ReadAt ? classes.read : ""}>
                                <ListItemText
                                    primary={ch.Title !== "" ? `Ch.${ch.Number} ${ch.Title}` : ch.Number}
                                    secondary={new Date(ch.UploadedAt).toLocaleDateString()}
                                />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </div>
            <BottomNavigation className={classes.bottomNavigation} />
        </React.Fragment >
    )
}


export default Manga;