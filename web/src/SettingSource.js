import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
    avatar: {
        marginRight: '0.5rem',
    },
    button: {
        right: 0,
    },
    textField: {
        width: '100%',
        marginBottom: '0.5rem'
    }
}));

function Input(props) {
    const render = () => {
        switch (typeof props.val) {
            case 'boolean':
                return <Switch onChange={(e) => props.onChange(e.target.checked)} checked={props.val} />
            default:
                return ""
        }
    }

    return (
        <ListItem button>
            <ListItemText primary={props.label} />
            <ListItemSecondaryAction>
                {render()}
            </ListItemSecondaryAction>
        </ListItem>
    )
}

function SettingSource(props) {
    const classes = useStyles();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFactor, setTwoFactor] = React.useState("");
    const [remember, setRemember] = React.useState(false);
    const [config, setConfig] = React.useState();

    React.useEffect(() => {
        if (!config) {
            fetch(`/api/source/${props.sourceName}/config`)
                .then((response) => response.json())
                .then(data => setConfig(data))
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [props.sourceName, config])

    const login = () => {
        if (username === "" || password === "") {
            return
        }

        fetch(`/api/source/${props.sourceName}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                TwoFactor: twoFactor,
                Remember: remember
            })
        })
            .then((response) => response)
            .catch((e) => {
                console.log(e);
            });
    }

    const save = () => {
        fetch(`/api/source/${props.sourceName}/config`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })
            .then((response) => response)
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <React.Fragment>
            <Typography variant="h6">
                Login
            </Typography>
            <FormControl fullWidth>
                <TextField className={classes.textField} id="username" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
                <TextField className={classes.textField} id="password" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                <TextField className={classes.textField} id="two_factor" label="Two factor" variant="outlined" onChange={(e) => setTwoFactor(e.target.value)} />
                <FormControlLabel className={classes.textField} control={<Checkbox name="rememberMe" checked={remember} onChange={(e) => setRemember(e.target.checked)} />} label="Remember Me" />
                <Button className={classes.button} variant="contained" onClick={() => login()}>Submit</Button>
            </FormControl>
            <Typography variant="h6">
                Languages
            </Typography>
            <FormControl fullWidth>
            {config && <List>
                {Object.keys(config.Language).map((k) => (
                    <Input key={k} id={`lang-${k}`} label={k} val={config.Language[k]} onChange={(value) => { const cfg = Object.assign({}, config); cfg.Language[k] = value; setConfig(cfg) }} />
                ))}
            </List>}
            <Button className={classes.button} variant="contained" onClick={() => save()}>Submit</Button>
            </FormControl>
        </React.Fragment>
    )
}

export default SettingSource;