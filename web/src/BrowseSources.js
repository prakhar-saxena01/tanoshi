import React from 'react';
import { navigate } from "@reach/router";
import Topbar from './common/Topbar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

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
    avatar: {
      marginRight: '0.5rem',
    },
}));

function BrowseSources() {
    const classes = useStyles();
    const [sourceList, setSourceList] = React.useState([]);

    React.useEffect(() => {
        fetch(`/api/source?installed=1`)
            .then((response) => response.json())
            .then((data) => {
                setSourceList(data);
            }).catch((e) => {
                console.log(e);
            });
    }, [])

    return (
        <React.Fragment className={"w-full lg:pl-48"}>
            <Topbar>
                <Typography variant="h6" className={classes.title}>
                    Browse
                </Typography>
            </Topbar>
            <List>
                {sourceList.map((s, index) => (
                    <ListItem button key={index} className={"flex justify-between"} onClick={() => navigate(`/browse/${s.Name}`)}>
                        <Avatar className={classes.avatar} src={s.Icon} alt={s.Name} />
                        <ListItemText
                            primary={s.Name}
                            secondary={s.Version}
                        />
                        <ListItemSecondaryAction onClick={() => navigate(`/browse/${s.Name}/latest`)}>
                            <Button>Latest</Button>
                        </ListItemSecondaryAction>
                    </ListItem >
                ))}
            </List>
        </React.Fragment>
    )
}

export default BrowseSources;