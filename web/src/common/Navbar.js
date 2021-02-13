import React from 'react';
import { navigate, useMatch } from "@reach/router";
import {
    makeStyles,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    useMediaQuery,
    useTheme,
    BottomNavigation,
    BottomNavigationAction
} from '@material-ui/core';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ExploreIcon from '@material-ui/icons/Explore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100vw',
        height: 'auto',
        bottom: 0,
        left: 0,
        right: 0,
        position: 'fixed',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: theme.zIndex.drawer + 1,
    },
    padding: {
        backgroundColor: 'transparent',
        marginBottom: 'env(safe-area-inset-bottom)'
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
}));


// return `flex rounded px-2 ${match ?  "text-accent lg:text-gray-90 bg-gray-100 dark:bg-gray-80 lg:bg-gray-300 lg:dark:bg-gray-700": "text-gray-900 dark:text-gray-50 lg:text-gray-900"}`
function BottomNavbar() {
    const clasess = useStyles();

    const libraryMatch = useMatch('/');
    const browseMatch = useMatch('/browse/*');
    const updatesMatch = useMatch('/update');
    const historyMatch = useMatch('/history');
    const settingMatch = useMatch('/settings/*');

    let initialValue = 'library';
    if (libraryMatch) {
        initialValue = 'library';
    } else if (browseMatch) {
        initialValue = 'browse';
    } else if (updatesMatch) {
        initialValue = 'update';
    } else if (historyMatch) {
        initialValue = 'history';
    } else if (settingMatch) {
        initialValue = 'settings';
    }

    const [value, setValue] = React.useState(initialValue);



    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <React.Fragment>
            <BottomNavigation className={clasess.root} value={value} onChange={handleChange}>
                <BottomNavigationAction label="Library" value="library" onClick={() => navigate("/")} icon={<BookmarkIcon />} />
                <BottomNavigationAction label="Browse" value="browse" onClick={() => navigate("/browse")} icon={<ExploreIcon />} />
                <BottomNavigationAction label="Update" value="update" onClick={() => navigate("/update")} icon={<NotificationsIcon />} />
                <BottomNavigationAction label="History" value="history" onClick={() => navigate("/history")} icon={<HistoryIcon />} />
                <BottomNavigationAction label="Settings" value="settings" onClick={() => navigate("/settings")} icon={<SettingsIcon />} />
            </BottomNavigation>
            <BottomNavigation className={clasess.padding} />
        </React.Fragment>
    )
}

function NavDrawer(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
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
                        <ListItem button value="browse" onClick={() => navigate("/browse")}>
                            <ListItemIcon>
                                <ExploreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Browse" />
                        </ListItem>
                        <ListItem button value="update" onClick={() => navigate("/update")}>
                            <ListItemIcon>
                                <NotificationsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Update" />
                        </ListItem>
                        <ListItem button value="history" onClick={() => navigate("/history")}>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary="History" />
                        </ListItem>
                        <ListItem button value="settings" onClick={() => navigate("/settings")}>
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </React.Fragment>
    )
}

function Navbar(props) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));

    return matches ? <NavDrawer /> : <BottomNavbar />
}

export default Navbar;