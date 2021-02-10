import React from 'react';
import {
    Snackbar
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function useAlert() {
    const [status, setStatus] = React.useState();
    const [severity, setSeverity] = React.useState();
    const [open, setOpen] = React.useState();

    const handleClose = (event, reason) => {
        setOpen(false);
    }

    return [
        (
            <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
                <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>{status}</MuiAlert>
            </Snackbar>
        ),
        (severity, status) => {setStatus(status); setSeverity(severity); setOpen(true);}
    ]
}

export { useAlert }