import React from 'react';
import { Link } from '@reach/router';

function History() {
    const [history, setHistory] = React.useState();

    React.useEffect(() => {
        if (!history) {
            fetch(`/api/history`)
                .then((response) => response.json())
                .then((data) => {
                    setHistory(data);
                }).catch((e) => {
                    console.log(e);
                });
        }
    });

    const calculate_days = (at) => {
        let today = Date.now();
        let read = new Date(at);
        let diff = Math.abs(today - read);
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "Today";
        } else if (days === 1) {
            return "Yesterday";
        } else if (days > 1 && days <= 7) {
            return days + " Days Ago";
        } else if (days > 7 && days < 31) {
            return (days / 7) + " Weeks Ago";
        } else {
            return (days / 30) + " Months Ago";
        }
    }

    return (
        <div className={"divide-y divide-gray-100 dark:divide-gray-900"}>
            {history && history.map((h, i) => (
                <Link key={i} className={"p-2 flex h-24 bg-white dark:bg-gray-800 shadow"} to={`/chapter/${h.ChapterID}`}>
                    <img className={"w-16 rounded object-cover"} alt={h.MangaTitle} src={h.CoverURL}></img>
                    <div className={"flex flex-col ml-2"}>
                        <h1 className={"text-gray-900 dark:text-gray-50 text-left"}>{h.MangaTitle}</h1>
                        <h2 className={"text-gray-900 dark:text-gray-50 text-left"}>{`${h.ChapterTitle} - ${h.ChapterNumber}`}</h2>
                        <h2 className={"text-gray-900 dark:text-gray-50 text-left"}>{calculate_days(h.ReadAt)}</h2>
                    </div>
                </Link>
            ))}
        </div>
    )
}
export default History;