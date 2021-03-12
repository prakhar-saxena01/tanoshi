import React from 'react';
import ReaderSetting from "./common/ReaderSetting";
import { navigate } from "@reach/router";
import {
    makeStyles,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Avatar,
    IconButton
} from '@material-ui/core';
import Topbar from './common/Topbar';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
    image: {
        paddingBottom: '141.5094339622642%',
    },
    img: {
        width: '8rem',
        objectFit: 'cover'
    },
    title: {
        flexGrow: 1,
    },
    avatar: {
        marginRight: '0.5rem',
    },
    root: {

    }
}));


function SettingReader(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Topbar>
                <IconButton color='inherit' onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Reader
                </Typography>
            </Topbar>
            <ReaderSetting />
        </React.Fragment>
    )
}

export default SettingReader;