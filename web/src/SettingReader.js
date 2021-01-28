import React from 'react';
import { useNavigate } from "@reach/router"

function Input(props) {
    const render = () => {
        switch (typeof props.val) {
            case 'boolean':
                return (
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id={props.id} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-1 appearance-none cursor-pointer" onChange={(e) => props.onChange(e.target.checked)} checked={props.val} />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer shadow"></label>
                    </div>
                )
            default:
                return ""
        }
    }

    return (
        <div className={"flex justify-between py-2"}>
            <label htmlFor={props.id} className={"toggle-label my-auto mx-2"}>{props.label}</label>
            {render()}
        </div>
    )
}

function SettingReader(props) {
    const [readerMode, setReaderMode] = React.useState();
    const [displayMode, setDisplayMode] = React.useState();
    const [direction, setDirection] = React.useState();
    const [background, setBackground] = React.useState();

    React.useState(() => {
        setReaderMode(localStorage.getItem("readerMode"));
        setDisplayMode(localStorage.getItem("displayMode"));
        setDirection(localStorage.getItem("direction"));
        setBackground(localStorage.getItem("background"));
    })
    React.useEffect(() => {
        localStorage.setItem("readerMode", readerMode);
    }, [readerMode])
    React.useEffect(() => {
        localStorage.setItem("displayMode", displayMode);
    }, [displayMode])
    React.useEffect(() => {
        localStorage.setItem("direction", direction);
    }, [direction])
    React.useEffect(() => {
        localStorage.setItem("background", background);
    }, [background])
    
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

export default SettingReader;

