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

function Skeleton() {
    return (
        <div className={`animate-tw-pulse w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2`}>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
            <div className={"bg-gray-300 h-40 md:h-80"}></div>
        </div>
    )
}

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

    if (!mangaList) {
        return (
            <Skeleton />
        )
    }

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                {mangaList && mangaList.map((el, index) => (
                    <Grid key={index} item xs={1}>
                        <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                    </Grid>
                ))}
            </Grid>
        </div >
    )
}

export default LibraryManga;