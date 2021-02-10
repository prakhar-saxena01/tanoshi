import React from 'react';
import { navigate } from "@reach/router";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function SettingCategories() {
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