import React from 'react';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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

function Library(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    Library
                </Typography>
            </Topbar>
            {props.children}
            <Navbar />
        </React.Fragment>
    )
}

export default Library;