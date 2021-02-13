import React from 'react';
import { navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { Typography, makeStyles, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

function Settings(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Topbar>
                <IconButton color='inherit' onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Settings
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

export default Settings;