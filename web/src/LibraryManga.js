import React from 'react';
import Cover from './common/Cover';
import { Grid, Box } from '@material-ui/core';


function LibraryManga(props) {
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
        <Box width="100vw" padding={1}>
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
            {mangaList && mangaList.map((el, index) => (
                <Grid key={index} item xs={4} md={2}>
                    <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                </Grid>
            ))}
        </Grid>
        </Box>
    )
}

export default LibraryManga;