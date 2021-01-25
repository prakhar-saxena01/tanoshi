import React from 'react';
import Cover from './common/Cover'


function Topbar() {
    return (
        <div className={"w-full px-2 pb-2 flex justify-between fixed inset-x-0 top-0 z-50 bg-accent dark:bg-gray-900 border-b border-accent-darker dark:border-gray-800 text-gray-50 pt-safe-top"}>
            <button>Filter</button>
            <span className={"text-gray-300"}>Browse</span>
            <button>Search</button>
        </div>
    )
}

function Browse() {
    const [mangaList, setMangaList] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/source/mangadex/latest')
            .then((response) => response.json())
            .then((data) => {
                setMangaList(data);
            }).catch((e) => {
                console.log(e);
            });
    })

    return (
        <div className={"main bg-gray-50 dark:bg-gray-900"}>
            <Topbar />
            <div className={"px-2 ml-0 lg:ml-2 lg:pr-2 lg:pl-48 pb-safe-bottom-scroll"}>
                <div className={"w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2"}>
                    {mangaList.map((el, index) => (
                        <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL}/>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Browse;