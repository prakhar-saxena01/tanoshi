import React from 'react';
import Cover from './common/Cover';

function LibraryManga(props) {
    const [mangaList, setMangaList] = React.useState([]);

    React.useEffect(() => {
        if(mangaList.length === 0) {
            const urlParams = new URLSearchParams(props.location.search);
            const title = urlParams.get('keyword');

            fetch(`/api/library?title=${title}`)
            .then((response) => response.json())
            .then((data) => {
                setMangaList([...mangaList, ...data]);
            }).catch((e) => {
                console.log(e);
            });
        }
    })    

    return (
        <div className={"w-full grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2"}>
            {mangaList && mangaList.map((el, index) => (
                <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
            ))}
        </div>
    )
}

export default LibraryManga;