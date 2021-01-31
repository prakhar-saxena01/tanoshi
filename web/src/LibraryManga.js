import React from 'react';
import Cover from './common/Cover';

function Skeleton() {
    return (
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
    )
}

function LibraryManga(props) {
    const [mangaList, setMangaList] = React.useState();

    React.useEffect(() => {
        if (!mangaList) {
            const urlParams = new URLSearchParams(props.location.search);
            const title = urlParams.get('keyword');

            fetch(`/api/library?title=${title}`)
                .then((response) => response.json())
                .then((data) => {
                    setMangaList(data);
                }).catch((e) => {
                    console.log(e);
                });
        }
    })

    if (!mangaList) {
        return (
            <Skeleton />
        )
    }

    return (
        <div className={"w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-2"}>
            {mangaList && mangaList.map((el, index) => (
                <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
            ))}
        </div>
    )
}

export default LibraryManga;