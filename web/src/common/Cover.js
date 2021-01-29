import React from 'react';
import { useNavigate, useMatch } from "@reach/router"

function Cover(props) {
    let timeout;
    const browseMatch = useMatch('/browse/*');

    const navigate = useNavigate();
    const [favorite, setIsFavorite] = React.useState(props.isFavorite);

    const toggleFavorite = () => {
        fetch(`/api/library/manga/${props.id}`, {
            method: !favorite ? "POST" : "DELETE"
        })
            .then((response) => setIsFavorite(!favorite))
            .catch((e) => {
                console.log(e);
            });
    }

    const startTimer = () => {
        timeout = setTimeout(ontimer, 1000);
    }

    const ontimer = (e) => {
        timeout = undefined;
        toggleFavorite();
    }

    const onmousedown = (e) => {
        e.preventDefault();
        startTimer();
    }

    const onmouseup = (e) => {
        e.preventDefault();
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
            navigate(`/manga/${props.id}`)
        }
    }

    const ontouchstart = (e) => {
        e.preventDefault();
        startTimer();

    }

    const ontouchmove = (e) => {
        e.preventDefault();
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
        }
    }

    const ontouchend = (e) => {
        e.preventDefault();
        if (timeout) {
            clearTimeout(timeout);
            timeout = undefined;
            navigate(`/manga/${props.id}`)
        }
    }

    return (
        <button className={"cursor-pointer relative rounded-md pb-7/5 shadow bg-gray-900 animate__animated animate__fadeIn"} to={`/manga/${props.id}`} onMouseDown={onmousedown} onMouseUp={onmouseup} onTouchStart={ontouchstart} onTouchMove={ontouchmove} onTouchEnd={ontouchend}>
            <img className={`absolute w-full h-full object-cover rounded-md ${favorite && browseMatch ? "opacity-25": "opacity-100"}`} src={props.coverUrl} alt=""></img>
            <span className={"absolute left-0 bottom-0 sm:text-sm text-xs bg-gradient-to-t from-gray-900 to-transparent w-full opacity-75 text-gray-50 px-1 pb-1 pt-4 truncate rounded-b-md"}>
                {props.title}
            </span>
        </button>
    )
}

export default Cover;