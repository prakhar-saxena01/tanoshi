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

    return (
        <React.Fragment>
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