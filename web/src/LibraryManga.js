import React from 'react';
import Cover from './common/Cover';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

function LibraryManga(props) {
    const classes = useStyles();
    const [mangaList, setMangaList] = React.useState();

    React.useEffect(() => {
        if (!mangaList) {
            const urlParams = new URLSearchParams(props.location.search);
            const title = urlParams.get('keyword');

            fetch(`/api/library?title=${title}`)
                .then((response) => response.json())
                .then((data) => {
                    setMangaList(data);
                }).catch((e) => {
                    console.log(e);
                });
        }
    })

    return (
        <Grid container spacing={2}>
            {mangaList && mangaList.map((el, index) => (
                <Grid key={index} item xs={4} lg={1}>
                    <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                </Grid>
            ))}
        </Grid>
    )
}

export default LibraryManga;