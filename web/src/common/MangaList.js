import React from 'react';
import Cover from './Cover';
import { Grid, Box } from '@material-ui/core';

function MangaList(props) {
    const { mangaList } = props;

    return (
        <Box width="100%">
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
                {mangaList && mangaList.map((el, index) => (
                    <Grid key={index} item xs={4} sm={2} lg={1}>
                        <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                    </Grid>
                ))}

            </Grid>

        </Box>
    )
}

export default MangaList;