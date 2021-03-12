import React from 'react';
import { navigate } from "@reach/router";
import {
    List,
    ListItem,
    ListItemText
} from '@material-ui/core';

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