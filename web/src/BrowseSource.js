import React from 'react';
import Cover from './common/Cover';
import Topbar from './common/Topbar';
import { useMatch } from '@reach/router';

function Search(props) {
    return (
        <div className={"w-full mb-2 ml-0 inline-flex"}>
            <input className={"border rounded outline-none w-full mr-2 p-1"} placeholder={"Search"} type={"text"} onKeyDown={(e) => { if (e.key === "Enter") { props.onChange(e) } }}></input>
            <button onClick={props.onCancel}>Cancel</button>
        </div>
    )
}

function Skeleton(props) {
    return (
        <div>
            <Topbar>
                <button>Filter</button>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <button >Search</button>
            </Topbar>
            <div className={"px-2 ml-0 pb-safe-bottom-scroll"}>
                <div className={`animate-tw-pulse w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2`}>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                    <div className={"bg-gray-300 h-40 md:h-80"}></div>
                </div>
            </div>
        </div>
    )
}

function BrowseSource(props) {
    const [isLoading, setLoading] = React.useState(false);
    const [mangaList, setMangaList] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [isSearch, setSearch] = React.useState(false);
    const [keyword, setKeyword] = React.useState("");

    const isLatest = useMatch("/browse/:sourceName/latest");

    React.useEffect(() => {
        setLoading(true);

        let url = `/api/source/${props.sourceName}`
        if (isLatest) {
            url += `/latest?page=${page}`
        } else {
            url += `?title=${keyword}&page=${page}`
        }
        fetch(url)
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else {
                    return []
                }
            })
            .then((data) => {
                setMangaList(m => [...m, ...data]);
                setLoading(false);
            }).catch((e) => {
                console.log(e);
            });
        // eslint-disable-next-line
    }, [props.sourceName, keyword, page])

    if (mangaList.length === 0 && isLoading) {
        return (
            <Skeleton sourceName={props.sourceName} />
        )
    }

    return (
        <div>
            <Topbar>
                <button>Filter</button>
                <span className={"text-gray-300"}>{`Browse ${props.sourceName}`}</span>
                <button >Search</button>
            </Topbar>
            {isSearch && <Search onCancel={() => setSearch(false)} onChange={(e) => {
                setMangaList([]);
                setPage(1);
                setKeyword(e.target.value);
            }} />}
            <div className={"px-2 ml-0 pb-safe-bottom-scroll"}>
                <div className={`w-full grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2`}>
                    {mangaList.map((el, index) => (
                        <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
                    ))}
                </div>
                <button disabled={isLoading} className={"w-full mt-2 p-1 text-accent rounded shadow-sm dark:bg-gray-800 hover:shadow dark:hover:bg-gray-700"} onClick={() => setPage(page + 1)}>
                    {isLoading ? "Loading..." : "Load More"}
                </button>
            </div>
        </div>
    )
}

export default BrowseSource;