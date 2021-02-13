import React from 'react';
import { useAlert } from './common/Alert';
import {
    makeStyles,
    Button,
    ListItemIcon,
    ListItemText,
    ListItem,
    List,
    Typography,
    Switch,
    TextField,
    FormControlLabel,
    FormControl,
    Checkbox
} from '@material-ui/core';

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
                return (
                    <ListItem button onClick={(e) => props.onChange(props.label, !props.val)}>
                        <ListItemText primary={props.label} />
                        <ListItemIcon>
                            <Switch checked={props.val} />
                        </ListItemIcon>
                    </ListItem>
                )
            default:
                return ""
        }
    }

    return render();
}

function SettingSource(props) {
    const classes = useStyles();

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFactor, setTwoFactor] = React.useState("");
    const [remember, setRemember] = React.useState(false);
    const [config, setConfig] = React.useState();

    const [alert, setAlert] = useAlert();

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
            .then((response) => {
                if (response.status !== 200) {
                    setAlert('error', 'Login error');
                } else {
                    setAlert('success', 'Login success');
                }
            })
            .catch((e) => {
                console.log(e);
                setAlert('error', `Login error: ${e}`);
            });
    }

    React.useEffect(() => {
        if (!config) {
            return
        }
        fetch(`/api/source/${props.sourceName}/config`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })
            .then((response) => {
                if (response.status !== 200) {
                    // setAlert('error', 'Set config error');
                } else {
                    // setAlert('success', 'Set config success');
                }
            })
            .catch((e) => {
                console.log(e);
                // setAlert('error', `Set config error: ${e}`)
            });
    }, [props.sourceName, config])


    return (
        <React.Fragment>
            <Typography variant="h6">
                Login
            </Typography>
            <FormControl fullWidth>
                <TextField className={classes.textField} id="username" label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
                <TextField className={classes.textField} type="password" id="password" label="Password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
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
                        <Input key={k} id={`lang-${k}`} label={k} val={config.Language[k]} onChange={(field, value) => { const cfg = Object.assign({}, config); cfg.Language[field] = value; setConfig(cfg) }} />
                    ))}
                </List>}
            </FormControl>
            {alert}
        </React.Fragment>
    )
}

export default SettingSource;