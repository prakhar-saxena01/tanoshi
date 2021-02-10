import React from '@react';
import Cover from './Cover';

function MangaList(props) {
    const {mangaList} = props;

    return (
        <div>{mangaList && mangaList.map((el, index) => (
            <Cover key={index} id={el.ID} title={el.Title} coverUrl={el.CoverURL} isFavorite={el.IsFavorite} />
        ))}
        </div>
    )
}

export default MangaList;