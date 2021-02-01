import React from 'react';
import Navbar from './common/Navbar';

// eslint-disable-next-line
function Search(props) {
    return (
        <div className={"w-full mb-2 ml-0 inline-flex"}>
            <input className={"border rounded outline-none w-full mr-2 p-1"} placeholder={"Search"} type={"text"} onKeyDown={(e) => { if (e.key === "Enter") { props.onChange(e) } }}></input>
            <button onClick={props.onCancel}>Cancel</button>
        </div>
    )
}

function Browse(props) {
    return (
        <div className={"main"}>
            {props.children}
            <Navbar />
        </div>
    )
}

export default Browse;