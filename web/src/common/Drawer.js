import React from 'react';
import { navigate } from "@reach/router"
import {
    makeStyles,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar
} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ExploreIcon from '@material-ui/icons/Explore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function NavDrawer(props) {
    const classes = useStyles();

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <List>
                    <ListItem button value="library" onClick={() => navigate("/")}>
                        <ListItemIcon>
                            <BookmarkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Library" />
                    </ListItem>
                    <Divider />
                    <ListItem button value="browse" onClick={() => navigate("/browse")}>
                        <ListItemIcon>
                            <ExploreIcon />
                        </ListItemIcon>
                        <ListItemText primary="Browse" />
                    </ListItem>
                    <Divider />
                    <ListItem button value="update" onClick={() => navigate("/update")}>
                        <ListItemIcon>
                            <NotificationsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Update" />
                    </ListItem>
                    <Divider />
                    <ListItem button value="history" onClick={() => navigate("/history")}>
                        <ListItemIcon>
                            <HistoryIcon />
                        </ListItemIcon>
                    </ListItem>
                    <ListItemText primary="History" />
                    <Divider />
                    <ListItem button value="settings" onClick={() => navigate("/settings")}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    )
}

export default NavDrawer;