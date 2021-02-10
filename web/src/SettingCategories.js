import React from 'react';
import { navigate } from "@reach/router";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    image: {
        paddingBottom: '141.5094339622642%',
    },
    img: {
        width: '8rem',
        objectFit: 'cover'
    },
    title: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        opacity: '60%',
        color: '#ffffff',
    },
    root: {

    }
}));

function SettingCategories() {
    const classes = useStyles();

    return (
        <React.Fragment>
            <List>
                <ListItem button onClick={() => navigate("/settings/reader")}>
                    <ListItemText primary="Reader" />
                </ListItem>
                <ListItem button onClick={() => navigate("/settings/source")}>
                    <ListItemText primary="Sources" />
                </ListItem>
            </List>
        </React.Fragment>
    )
}

export default SettingCategories;