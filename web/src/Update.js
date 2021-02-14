import React from 'react';
import { navigate } from '@reach/router';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Typography, BottomNavigation, ListSubheader } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    avatar: {
        marginRight: '0.5rem',
    },
    button: {
        width: '100%',
        marginTop: '0.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    bottomNavigation: {
        backgroundColor: 'transparent',
        marginBottom: 'env(safe-area-inset-bottom)'
    }
}));

function Update() {
    const classes = useStyles();

    const [page, setPage] = React.useState(1);
    const [update, setUpdate] = React.useState([]);
    const [updateMap, setUpdateMap] = React.useState({});
    const [disableLoadMore, setDisableLoadMore] = React.useState(false);

    React.useEffect(() => {
        fetch(`/api/update?page=${page}&limit=10`)
            .then((response) => {
                if (response.status === 204) {
                    setDisableLoadMore(true);
                    return [];
                }
                return response.json();
            })
            .then((data) => {
                setUpdate(u => [...u, ...data]);
            }).catch((e) => {
                console.log(e);
            });
    }, [page]);

    React.useEffect(() => {
        if (update.length === 0) {
            return
        }

        let map = update.reduce((m, u) => {
            if (!m[calculate_days(u.UploadedAt)]) {
                m[calculate_days(u.UploadedAt)] = [];
            }
            m[calculate_days(u.UploadedAt)].push(u);
            return m;
        }, {});
        setUpdateMap(map);
    }, [update])

    const calculate_days = (at) => {
        let today = Date.now();
        let read = new Date(at);
        let diff = Math.abs(today - read);
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "Today";
        } else if (days === 1) {
            return "Yesterday";
        } else if (days > 1 && days <= 7) {
            return days + " Days Ago";
        } else if (days > 7 && days < 31) {
            return Math.ceil(days / 7) + " Weeks Ago";
        } else {
            return Math.ceil(days / 30) + " Months Ago";
        }
    }

    return (
        <React.Fragment>
            {updateMap && Object.keys(updateMap).map((key) => {
                return (
                    <List key={key} subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            {key}
                        </ListSubheader>
                    }>
                        {
                            updateMap[key].map((u, i) => (

                                <ListItem button key={i} onClick={() => navigate(`/chapter/${u.ChapterID}`)}>
                                    <Avatar className={classes.avatar} alt={u.MangaTitle} src={`/api/proxy?url=${u.CoverURL}`} />
                                    <ListItemText
                                        primary={u.MangaTitle}
                                        secondary={
                                            <React.Fragment>
                                                <Typography component={'span'} variant="subtitle1">
                                                    {`${u.ChapterTitle} - ${u.ChapterNumber}`}
                                                    <br></br>
                                                </Typography>
                                                <Typography component={'span'} variant="subtitle2">
                                                    {calculate_days(u.UploadedAt)}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            ))
                        }
                    </List>
                )
            })}
            <Button className={classes.button} disabled={disableLoadMore} onClick={(e) => setPage(page + 1)}>
                {disableLoadMore ? "No More" : "Load More"}
            </Button>
            <BottomNavigation className={classes.bottomNavigation} />
        </React.Fragment>
    )
}
export default Update;