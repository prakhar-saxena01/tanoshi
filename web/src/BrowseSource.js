import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import { useMatch } from '@reach/router';
import Filter from './common/Filter';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
        let query = "";
        Object.keys(val).map(key => {
            query += `&${key}=${toFilter[key]}`
        })
        return query;
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
    }, [props.sourceName])

    const handleFilterChange = (val) => {
        let v = Object.assign({}, val);
        setToFilters(v);
    }

    return (
        <React.Fragment>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    {`Browse ${props.sourceName}`}
                </Typography>
                <Button color="inherit">Filter</Button>
            </Topbar>
            {/* <div className={"fixed z-50 right-0 top-0 mt-10 w-full md:w-auto"}>
                <Filter onFilter={handleFilterChange} filters={filters} />
            </div> */}
                <Grid container spacing={1}>
                    {mangaList.map((el, index) => (
                        <Grid key={index} item xs={4} lg={1}>
                            <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                        </Grid>
                    ))}
                </Grid>
                <Button className={classes.button} disabled={isLoading} onClick={() => setPage(page + 1)}>
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
        </React.Fragment>
    )
}

export default BrowseSource;