import React from 'react';
import MangaList from './common/MangaList';


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

    return (
        <MangaList mangaList={mangaList} />
    )
}

export default LibraryManga;