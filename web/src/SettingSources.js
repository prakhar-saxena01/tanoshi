import React from 'react';
import { navigate } from "@reach/router";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
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
            .then((response) => setInstalling(false))
            .catch((e) => {
                console.log(e);
                setInstalling(false);
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
        </React.Fragment>
    )
}

export default SettingSources;