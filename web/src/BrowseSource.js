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
  }));
  

function Skeleton(props) {
    return (
        <React.Fragment>
            <Topbar>
                <span></span>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <button>Filters</button>
            </Topbar>
            <div className={"px-2 ml-0 pb-safe-bottom-scroll"}>
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
            </div>
        </React.Fragment>
    )
}

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

    if (mangaList.length === 0 && isLoading) {
        return (
            <Skeleton sourceName={props.sourceName} />
        )
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
            <div className={"px-2 ml-0 lg:ml-48 pb-safe-bottom-scroll"}>
                <Grid container spacing={3}>
                    {mangaList.map((el, index) => (
                        <Grid key={index} item xs={1}>
                            <Cover id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                        </Grid>
                    ))}
                </Grid>
                <button disabled={isLoading} className={"w-full mt-2 p-1 text-accent rounded shadow-sm dark:bg-gray-800 hover:shadow dark:hover:bg-gray-700"} onClick={() => setPage(page + 1)}>
                    {isLoading ? "Loading..." : "Load More"}
                </button>
            </div>
        </React.Fragment>
    )
}

export default BrowseSource;