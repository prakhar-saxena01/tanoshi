import React from 'react';
import {
    makeStyles,
    Box,
    Typography,
    Button,
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Slide,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormControl
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    button: {
        width: '100%',
        marginTop: '0.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    input: {
        width: '100%'
    }
}));


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Input(props) {
    const classes = useStyles();

    const { label, isMultiple, values, onChange, selected } = props;

    if (isMultiple && values && values.length > 0) {
        return (
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {values.map(v => {
                            return (
                                <ListItem key={v.Value} onClick={() => onChange(v.Value)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selected ? selected.indexOf(v.Value) !== -1 : false}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': label.replace(' ', '-').toLowerCase() }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={label.replace(' ', '-').toLowerCase()} primary={v.Label} />
                                </ListItem>
                            )
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    }
    if (values && values.length > 0) {
        return (
            <FormControl className={classes.input}>
                <InputLabel id={`${label.replace(' ', '-').toLowerCase()}-label`}>{label}</InputLabel>
                <Select
                    labelId={`${label.replace(' ', '-').toLowerCase()}-label`}
                    id={label.replace(' ', '-').toLowerCase()}
                    onChange={(e) => onChange(e.target.value)}
                    value={selected || ""} >
                    {values.map(v => {
                        return (
                            <MenuItem key={v.Value} value={v.Value}>{v.Label}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl >
        )
    }
    return (
        <TextField className={classes.input} label={label} value={selected || ""} onChange={(e) => onChange(e.target.value)} />
    )
}

function Section(props) {
    const { label, isMultiple, value, setValue, values, field } = props;

    const onChange = (val) => {
        if (isMultiple) {
            if (!value[field]) {
                value[field] = [];
            }

            const currentIndex = value[field].indexOf(val);
            const newSelected = [...value[field]];

            if (currentIndex === -1) {
                newSelected.push(val);
            } else {
                newSelected.splice(currentIndex, 1);
            }

            setValue({...value, [field]: newSelected});
        } else {
            
            setValue({...value, [field]: val});
        }
    };

    return (
        <Box padding={2}>
            <Input 
                onChange={(val) => onChange(val)} 
                selected={value[field]} 
                isMultiple={isMultiple} 
                label={label} 
                values={values} />
        </Box>
    )
}

function Filter(props) {
    const classes = useStyles();

    const { options, onFilter, open, onClose } = props;

    const [filterParam, setFilterParam] = React.useState({});

    return (
        <React.Fragment>
            <Dialog fullScreen onClose={onClose} open={open} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Filters
                        </Typography>
                        <Button color="inherit" onClick={() => onFilter(filterParam)} aria-label="close">
                            Filter
                        </Button>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                {options && options.map((f, i) => (
                    <Section
                        key={`${f.Field}-${i}`} 
                        label={f.Label} 
                        isMultiple={f.IsMultiple} 
                        values={f.Values} 
                        value={filterParam}
                        setValue={setFilterParam}
                        field={f.Field} />
                ))}
            </Dialog >
        </React.Fragment>
    )
}

export default Filter;