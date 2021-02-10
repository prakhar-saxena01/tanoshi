import React from 'react';
import { navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

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

function Settings(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    Settings
                </Typography>
            </Topbar>
            {props.children}
            <Navbar />
        </React.Fragment>
    )
}

export default Settings;