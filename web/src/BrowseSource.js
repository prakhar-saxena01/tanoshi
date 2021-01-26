import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import { Link } from "@reach/router";

function Search(props) {
    return (
        <div className={"w-full mb-2 ml-0 lg:ml-2 lg:pr-2 lg:pl-48 inline-flex"}>
            <input className={"border rounded outline-none w-full mr-2 p-1"} placeholder={"Search"} type={"text"} onKeyDown={(e) => { if (e.key === "Enter") { props.onChange(e) } }}></input>
            <button onClick={props.onCancel}>Cancel</button>
        </div>
    )
}

function BrowseSource(props) {
    const [mangaList, setMangaList] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [isSearch, setSearch] = React.useState(false);
    const [keyword, setKeyword] = React.useState("");

    React.useEffect(() => {
        fetch(`/api/source/${props.sourceName.toLowerCase()}?filters[title]=${keyword}&filters[p]=${page}`)
            .then((response) => response.json())
            .then((data) => {
                setMangaList([...mangaList, ...data]);
            }).catch((e) => {
                console.log(e);
            });
    }, [keyword, page])

    return (
        <div>
            <Topbar>
                <button>Filter</button>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <Link to={"login"}>Login</Link>
            </Topbar>
            {isSearch && <Search onCancel={() => setSearch(false)} onChange={(e) => {
                setMangaList([]);
                setPage(1);
                setKeyword(e.target.value);
            }} />}
            <div className={"px-2 ml-0 lg:ml-2 lg:pr-2 lg:pl-48 pb-safe-bottom-scroll bg-white"}>
                <div className={"w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2"}>
                    {mangaList.map((el, index) => (
                        <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} />
                    ))}
                </div>
                <button className={"w-full text-gray-900 dark:text-gray-50"} onClick={() => setPage(page + 1)}>
                    Load More
                </button>
            </div>
        </div>
    )
}

export default BrowseSource;