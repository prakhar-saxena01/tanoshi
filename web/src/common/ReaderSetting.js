import React from 'react';

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
        if(props.setReaderMode) {
            props.setReaderMode(readerMode);
        }
    // eslint-disable-next-line
    }, [settingPath, readerMode])
    React.useEffect(() => {
        localStorage.setItem(`displayMode${settingPath}`, displayMode);
        if(props.setDisplayMode) {
            props.setDisplayMode(displayMode);
        }
    // eslint-disable-next-line
    }, [settingPath, displayMode])
    React.useEffect(() => {
        localStorage.setItem(`direction${settingPath}`, direction);
        if(props.setDirection) {
            props.setDirection(direction);
        }
    // eslint-disable-next-line
    }, [settingPath, direction])
    React.useEffect(() => {
        localStorage.setItem(`background${settingPath}`, background);
        if(props.setBackground) {
            props.setBackground(background);
        }
    // eslint-disable-next-line
    }, [settingPath, background])
    
    return (
        <div className={"p-2"}>
            <div className={"shadow w-full p-2 rounded-t lg:rounded mb-0 lg:mb-2 mx-auto inset-x-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 mx-2"}>
                <div className={"w-full"}>
                    <div className={"w-full flex justify-between border-b border-gray-10 dark:border-gray-900 mb-2"}>
                        <h1>Settings</h1>
                    </div>
                    <label>Reader Mode</label>
                    <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                        <button className={`w-1/2 ${readerMode === "continous" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setReaderMode("continous")}>Continous</button>
                        <button className={`w-1/2 ${readerMode === "paged" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setReaderMode("paged")}>Paged</button>
                    </div>
                </div>
                <div className={"w-full"}>
                    <label>Display Mode</label>
                    <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                        <button className={`w-1/2 ${displayMode === "single" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setDisplayMode("single")}>Single</button>
                        <button className={`w-1/2 ${displayMode === "double" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setDisplayMode("double")}>Double</button>
                    </div>
                </div>
                <div className={"w-full"}>
                    <label>Direction</label>
                    <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                        <button className={`w-1/2 ${direction === "lefttoright" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setDirection("lefttoright")}>Left to Right</button>
                        <button className={`w-1/2 ${direction === "righttoleft" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setDirection("righttoleft")}>Right to Left</button>
                    </div>
                </div>
                <div className={"w-full"}>
                    <label>background</label>
                    <div className={"w-full bg-gray-200 dark:bg-gray-700 rounded p-1"}>
                        <button className={`w-1/2 ${background === "white" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setBackground("white")}>White</button>
                        <button className={`w-1/2 ${background === "black" ? "bg-gray-50 dark:bg-gray-600 rounded shadow" : ""}`} onClick={() => setBackground("black")}>Black</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReaderSetting;

