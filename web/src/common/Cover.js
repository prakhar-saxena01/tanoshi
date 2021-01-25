import React from 'react';
import { Link } from "@reach/router"

function Cover(props) {
    return (
        <Link className={"cursor-pointer relative rounded-md pb-7/5 shadow"} to={`/manga/${props.id}`}>
            <img className={"absolute w-full h-full object-cover rounded-md"} src={props.coverUrl} alt=""></img>
            <span className={"absolute left-0 bottom-0 sm:text-sm text-xs bg-gradient-to-t from-gray-900 to-transparent w-full opacity-75 text-gray-50 px-1 pb-1 pt-4 truncate rounded-b-md"}>
                {props.title}
            </span>
        </Link>
    )
}

export default Cover;