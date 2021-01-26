import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';

function Search(props) {
    return (
        <div className={"w-full mb-2 ml-0 lg:ml-2 lg:pr-2 lg:pl-48 inline-flex"}>
            <input className={"border rounded outline-none w-full mr-2 p-1"} placeholder={"Search"} type={"text"} onKeyDown={(e) => { if (e.key === "Enter") { props.onChange(e) } }}></input>
            <button onClick={props.onCancel}>Cancel</button>
        </div>
    )
}

function Browse(props) {
    return (
        <div className={"main bg-white dark:bg-gray-900"}>
            {props.children}
            <Navbar />
        </div>
    )
}

export default Browse;