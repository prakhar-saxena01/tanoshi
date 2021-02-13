import React from 'react';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { makeStyles, Typography } from '@material-ui/core';

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

function Library(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    Library
                </Typography>
            </Topbar>
            <div className={classes.root}>
                <Navbar />
                <div className={classes.content}>
                    {props.children}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Library;