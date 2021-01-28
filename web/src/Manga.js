import React from 'react';
import { Link, navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';

function Manga(props) {
    const [manga, setManga] = React.useState();
    const [favorite, setIsFavorite] = React.useState();

    React.useState(() => {
        if (!manga) {
            fetch(`/api/manga/${props.mangaId}?includeChapter=1`)
                .then((response) => response.json())
                .then((data) => {
                    setManga(data);
                }).catch((e) => {
                    console.log(e);
                });
        }
    }, [manga])

    const setFavorite = (val) => {
        fetch(`/api/manga/${props.mangaId}/favorite`, {
                method: val ? "PUT" : "DELETE"
            })
            .then((response) => setIsFavorite(val))
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <div className={"main w-full mx-auto px-2 flex flex-col h-auto"}>
            <Topbar>
                <button onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className={"text-gray-300 truncate"}>{manga && manga.Title}</span>
                <span></span>
            </Topbar>
            <div className={"w-full lg:pl-48"}>
                <div id={"detail"} className={"flex flex-col justify-center bg-white dark:bg-gray-800 p-2 mb-2 rounded shadow"}>
                    <div className={"flex"}>
                        <div className={"pb-7/6 mr-2"}>
                            <img className={"w-32 rounded object-cover"} alt={manga && manga.Title} src={manga && manga.CoverURL}></img>
                        </div>
                        <div className={"flex flex-col justify-left"}>
                            <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Authors</span>
                            <span className={"md:text-xl sm:text-sm text-gray-900 dark:text-gray-300 mr-2 text-left"}>{manga && manga.Authors}</span>
                            <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Status</span>
                            <span className={"md:text-xl sm:text-sm text-gray-900 dark:text-gray-300 mr-2 text-left"}>{manga && manga.Status}</span>
                        </div>
                    </div>
                </div>
                <div id={"description"} className={"flex flex-col justify-center bg-white dark:bg-gray-800 p-2 mb-2 rounded shadow"}>
                    <div className={"flex"}>
                        <button className={"rounded p-2 border text-gray-900 dark:text-gray-50"} onClick={() => setFavorite(!favorite)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill={favorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                    <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Description</span>
                    <p className={"md:text-base sm:text-xs text-gray-900 dark:text-gray-300 text-left break-words"}>{manga && manga.Description}</p>
                    <div className={"w-full flex flex-wrap"}>
                        {manga && manga.Genres.split(',').map((genre, index) => (
                            <span key={index} className={"md:text-base sm:text-xs text-gray-900 dark:text-gray-300 mr-2 rounded-full border border-gray-900 dark:border-gray-300 px-2 mt-2"}>
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className={"w-full lg:pl-48 pb-safe-bottom-scroll"}>
                <div id={"chapters"} className={"flex justify-center bg-white dark:bg-gray-800 p-2 rounded shadow"}>
                    <div className={"flex flex-col w-full divide-y-2 dark:divide-gray-900 divide-gray-100"}>
                        <span className={"md:text-xl sm:text-base font-bold text-gray-900 dark:text-gray-300 text-left"}>Chapters</span>
                        {manga && manga.Chapters.map(ch => (
                            <Link key={ch.ID} className={"flex inline-flex hover:bg-gray-200 dark:hover:bg-gray-700 p-2"} to={`/chapter/${ch.ID}`}>
                                <div className={"flex justify-between items-center w-full text-gray-900 dark:text-gray-300"}>
                                    <div className={"flex flex-col"}>
                                        <span className={"text-md font-semibold text-left"}>{ch.Title !== "" ? ch.Title : ch.Number}</span>
                                        <span className={"text-sm text-left"}>{ch.UploadedAt}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <Navbar />
        </div>
    )
}


export default Manga;