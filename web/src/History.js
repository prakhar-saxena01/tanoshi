import React from 'react';
import { navigate } from '@reach/router';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Typography, BottomNavigation, ListSubheader } from '@material-ui/core';

const useStyles = makeStyles({
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
});

function History() {
    const classes = useStyles();

    const [history, setHistory] = React.useState([]);
    const [historyMap, setHistoryMap] = React.useState({});
    const [page, setPage] = React.useState(1);
    const [disableLoadMore, setDisableLoadMore] = React.useState(false);

    React.useEffect(() => {
        fetch(`/api/history?page=${page}&limit=10`)
            .then((response) => {
                if (response.status === 204) {
                    setDisableLoadMore(true);
                    return [];
                }
                return response.json();
            })
            .then((data) => {
                setHistory(h => [...h, ...data]);
            }).catch((e) => {
                console.log(e);
            });
    }, [page]);

    React.useEffect(() => {
        if (history.length === 0) {
            return
        }

        let map = history.reduce((m, u) => {
            if (!m[calculate_days(u.ReadAt)]) {
                m[calculate_days(u.ReadAt)] = [];
            }
            m[calculate_days(u.ReadAt)].push(u);
            return m;
        }, {});
        setHistoryMap(map);
    }, [history])

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
            return (days / 7) + " Weeks Ago";
        } else {
            return (days / 30) + " Months Ago";
        }
    }

    return (
        <React.Fragment>
            {historyMap && Object.keys(historyMap).map((key) => {
                return (
                    <List key={key} subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            {key}
                        </ListSubheader>
                    }>
                        {
                            historyMap[key].map((u, i) => (

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
                                                    {calculate_days(u.ReadAt)}
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
            <Button disabled={disableLoadMore} className={classes.button} onClick={(e) => setPage(page + 1)}>
                {disableLoadMore ? "No More" : "Load More"}
            </Button>
            <BottomNavigation className={classes.bottomNavigation} />
        </React.Fragment>
    )
}
export default History;