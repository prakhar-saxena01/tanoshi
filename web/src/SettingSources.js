import React from 'react';
import { useAlert } from './common/Alert';
import { navigate } from "@reach/router";
import {
    makeStyles,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Button,
    Avatar
} from '@material-ui/core';


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
    avatar: {
        marginRight: '0.5rem',
    },
    root: {

    }
}));

function SettingSources() {
    const classes = useStyles();

    const [sourceList, setSourceList] = React.useState();
    const [isInstalling, setInstalling] = React.useState(false);

    const [alert, setAlert] = useAlert();

    React.useEffect(() => {
        fetch(`/api/source`)
            .then((response) => response.json())
            .then((data) => {
                setSourceList(data);
            }).catch((e) => {
                console.log(e);
            });
    }, [isInstalling])

    const installSource = (sourceName, update) => {
        setInstalling(true);
        fetch(`/api/source/${sourceName}`, {
            method: update ? "PUT" : "POST"
        })
            .then((response) => {
                if (response.status !== 200) {
                    setAlert('error', 'Install error');
                } else {
                    setInstalling(false);
                    setAlert('success', 'Install success');
                }
            })
            .catch((e) => {
                console.log(e);
                setAlert('error', `Install error: ${e}`)
            });
    }

    const text = (s) => {
        if (s.Update) {
            return "Update"
        } else if (s.Installed) {
            return "Installed"
        }
        return "Install"
    }

    if (!sourceList) {
        return <div></div>
    }

    return (
        <React.Fragment>
            <Typography variant="h6">
                Sources
            </Typography>
            <List>
                {sourceList.map((s, index) => (
                    <ListItem button key={index} onClick={() => navigate(`/settings/source/${s.Name}`)}>
                        <Avatar className={classes.avatar} src={s.Icon} alt={s.Name} />
                        <ListItemText
                            primary={s.Name}
                            secondary={s.Version}
                        />
                        <ListItemSecondaryAction>
                            <Button disabled={s.Installed && !s.Update} onClick={() => installSource(s.Name, s.Update)}>{text(s)}</Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            {alert}
        </React.Fragment>
    )
}

export default SettingSources;