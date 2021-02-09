import React from 'react';
import Cover from './common/Cover';
import Grid from '@material-ui/core/Grid';


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