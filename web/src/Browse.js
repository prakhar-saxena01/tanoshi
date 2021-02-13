import React from 'react';
import Navbar from './common/Navbar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(1),
    },
}));

function Browse(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navbar />
            <div className={classes.content}>
                {props.children}
            </div>
        </div>
    )
}

export default Browse;