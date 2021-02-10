import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      paddingTop: 'env(safe-area-inset-top)'
    },
    topbar: {
        marginTop: 'env(safe-area-inset-top)'
    }
  }));

function Topbar(props) {
    const clasess = useStyles();
    return (
        <React.Fragment>
            <AppBar position="fixed" className={clasess.appBar}>
                <Toolbar>{props.children}</Toolbar>
            </AppBar>
            <Toolbar className={clasess.topbar} />
        </React.Fragment>
    )
}

export default Topbar;