import React from 'react';
import { navigate, useMatch } from "@reach/router"
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ExploreIcon from '@material-ui/icons/Explore';
import NotificationsIcon from '@material-ui/icons/Notifications';
import HistoryIcon from '@material-ui/icons/History';
import SettingsIcon from '@material-ui/icons/Settings';
const useStyles = makeStyles({
    root: {
        width: '100vw',
        bottom: 0,
        left: 0,
        right: 0,
        position: 'fixed',
    },
});


// return `flex rounded px-2 ${match ?  "text-accent lg:text-gray-90 bg-gray-100 dark:bg-gray-80 lg:bg-gray-300 lg:dark:bg-gray-700": "text-gray-900 dark:text-gray-50 lg:text-gray-900"}`
function Navbar() {
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
            <BottomNavigation />
        </React.Fragment>
    )
}

export default Navbar;