import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function ReaderSetting(props) {
    const [readerMode, setReaderMode] = React.useState();
    const [displayMode, setDisplayMode] = React.useState();
    const [direction, setDirection] = React.useState();
    const [background, setBackground] = React.useState();


    var settingPath = props.mangaId ? `/${props.mangaId}` : "";
    const getItem = (key) => {
        let setting = localStorage.getItem(`${key}${settingPath}`);
        if (!setting) {
            setting = localStorage.getItem(`${key}`);
        }
        return setting
    }

    React.useState(() => {
        setReaderMode(getItem(`readerMode`));
        setDisplayMode(getItem(`displayMode`));
        setDirection(getItem(`direction`));
        setBackground(getItem(`background`));
    })
    React.useEffect(() => {
        localStorage.setItem(`readerMode${settingPath}`, readerMode);
        if (props.setReaderMode) {
            props.setReaderMode(readerMode);
        }
        // eslint-disable-next-line
    }, [settingPath, readerMode])
    React.useEffect(() => {
        localStorage.setItem(`displayMode${settingPath}`, displayMode);
        if (props.setDisplayMode) {
            props.setDisplayMode(displayMode);
        }
        // eslint-disable-next-line
    }, [settingPath, displayMode])
    React.useEffect(() => {
        localStorage.setItem(`direction${settingPath}`, direction);
        if (props.setDirection) {
            props.setDirection(direction);
        }
        // eslint-disable-next-line
    }, [settingPath, direction])
    React.useEffect(() => {
        localStorage.setItem(`background${settingPath}`, background);
        if (props.setBackground) {
            props.setBackground(background);
        }
        // eslint-disable-next-line
    }, [settingPath, background])

    return (
        <React.Fragment>
            <List>
                <ListItem button className={"w-full"}>
                    <ListItemText primary="Reader Mode" />
                    <ListItemSecondaryAction>
                        <Select
                            value={readerMode}
                            onChange={(event) => setReaderMode(event.target.value)}
                        >
                            <MenuItem value="continous">
                                Continous
                            </MenuItem >
                            <MenuItem value="paged">
                                Paged
                            </MenuItem >
                        </Select>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem button className={"w-full"}>
                    <ListItemText primary="Display Mode" />
                    <ListItemSecondaryAction>
                        <Select
                            value={displayMode}
                            onChange={(event) => setDisplayMode(event.target.value)}
                        >
                            <MenuItem value="single">
                                Single
                            </MenuItem >
                            <MenuItem value="double">
                                Double
                            </MenuItem >
                        </Select>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem button className={"w-full"}>
                    <ListItemText primary="Direction" />
                    <ListItemSecondaryAction>
                        <Select
                            value={direction}
                            onChange={(event) => setDirection(event.target.value)}
                        >
                            <MenuItem value="lefttoright">
                                Left to Right
                            </MenuItem >
                            <MenuItem value="righttoleft">
                                Right to Left
                            </MenuItem >
                        </Select>
                    </ListItemSecondaryAction>
                </ListItem>
                <ListItem button className={"w-full"}>
                    <ListItemText primary="background" />
                    <ListItemSecondaryAction>
                        <Select
                            value={background}
                            onChange={(event) => setBackground(event.target.value)}
                        >
                            <MenuItem value="white">
                                White
                            </MenuItem >
                            <MenuItem value="black">
                                Black
                            </MenuItem >
                        </Select>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </React.Fragment>
    )
}

export default ReaderSetting;

