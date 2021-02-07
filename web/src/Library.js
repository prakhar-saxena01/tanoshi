import React from 'react';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';

function Search(props) {
    return (
        <div className={"w-full mb-2 ml-0 inline-flex"}>
            <input className={"border rounded outline-none w-full mr-2 p-1"} placeholder={"Search"} type={"text"} onKeyDown={(e) => { if (e.key === "Enter") { props.onChange(e) } }}></input>
            <button onClick={props.onCancel}>Cancel</button>
        </div>
    )
}

function Library(props) {
    const [isSearch, setSearch] = React.useState(false);
    // eslint-disable-next-line
    const [keyword, setKeyword] = React.useState("");

    return (
        <div className={"main"}>
            <Topbar>
                <button>Filter</button>
                <span className={"text-gray-300"}>Library</span>
                <button >Search</button>
            </Topbar>
            {isSearch && <Search onCancel={() => setSearch(false)} onChange={(e) => {
                setKeyword(e.target.value);
            }} />}
            <div className={"px-2 lg:ml-48 ml-0 pb-safe-bottom-scroll"}>
                {props.children}
            </div>
            <Navbar />
        </div>
    )
}

export default Library;