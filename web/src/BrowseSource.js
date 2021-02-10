import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import { useMatch } from '@reach/router';
import Filter from './common/Filter';
import { makeStyles, Box, Grid, Typography, Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    button: {
        width: '100%',
        marginTop: '0.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
}));

function BrowseSource(props) {
    const classes = useStyles();

    const [isLoading, setLoading] = React.useState(false);
    const [showFilters, setShowFilters] = React.useState(false);
    const [filters, setFilters] = React.useState([]);
    const [toFilter, setToFilters] = React.useState([]);
    const [mangaList, setMangaList] = React.useState([]);
    const [page, setPage] = React.useState(1);

    const isLatest = useMatch("/browse/:sourceName/latest");

    React.useEffect(() => {
        setLoading(true);

        let url = `/api/source/${props.sourceName}`
        if (isLatest) {
            url += `/latest?page=${page}`
        } else {
            url += `?page=${page}${constructFilter(toFilter)}`;
        }
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return []
                }
            })
            .then((data) => {
                setMangaList(m => [...m, ...data]);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line
    }, [page, toFilter]);

    const constructFilter = (val) => {
        return Object.keys(val).reduce((q, key) => {
            q += `&${key}=${toFilter[key]}`;
            return q;
        }, "");
    }

    React.useEffect(() => {
        setLoading(true);

        let url = `/api/source/${props.sourceName}/filters`;
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return {}
                }
            })
            .then((data) => {
                setFilters(data);
            }).catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line
    }, [props.sourceName]);

    const handleFilterChange = (val) => {
        setToFilters(val);
        setShowFilters(false);
        setMangaList([]);
        setPage(1);
    }

    return (
        <React.Fragment>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    {`Browse ${props.sourceName}`}
                </Typography>
                <Button color="inherit" onClick={() => setShowFilters(true)}>Filter</Button>
            </Topbar>
            <Filter onFilter={handleFilterChange} options={filters} onClose={() => setShowFilters(false)} open={showFilters}/>
            <Box width="100vw" padding={2}>
                <Grid container spacing={1}>
                    {mangaList.map((el, index) => (
                        <Grid key={index} item xs={4} md={2} lg={1}>
                            <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                        </Grid>
                    ))}
                </Grid>
                <Button className={classes.button} disabled={isLoading} onClick={() => setPage(page + 1)}>
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            </Box>
        </React.Fragment>
    )
}

export default BrowseSource;