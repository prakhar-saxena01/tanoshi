import React from 'react';
import MangaList from './common/MangaList';
import Topbar from './common/Topbar';
import { useMatch, navigate } from '@reach/router';
import Filter from './common/Filter';
import { makeStyles, Typography, Button, BottomNavigation, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
    },
    bottomNavigation: {
        backgroundColor: 'transparent'
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
                    return null
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
                <IconButton color='inherit' onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {`Browse ${props.sourceName}`}
                </Typography>
                <Button color="inherit" onClick={() => setShowFilters(true)}>Filter</Button>
            </Topbar>
            <Filter onFilter={handleFilterChange} options={filters} onClose={() => setShowFilters(false)} open={showFilters} />
            <MangaList mangaList={mangaList} />
            <Button className={classes.button} disabled={isLoading} onClick={() => setPage(page + 1)}>
                {isLoading ? "Loading..." : "Load More"}
            </Button>
            <BottomNavigation className={classes.bottomNavigation} />
        </React.Fragment>
    )
}

export default BrowseSource;