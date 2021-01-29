import React from 'react';
import { Link, useMatch } from "@reach/router"

// return `flex rounded px-2 ${match ?  "text-accent lg:text-gray-90 bg-gray-100 dark:bg-gray-80 lg:bg-gray-300 lg:dark:bg-gray-700": "text-gray-900 dark:text-gray-50 lg:text-gray-900"}`
function Navbar() {
    const libraryMatch = useMatch('/');
    const browseMatch = useMatch('/browse/*');
    const updatesMatch = useMatch('/update');
    const historyMatch = useMatch('/history');
    const settingMatch = useMatch('/settings/*');
    
    const navClass = (match) => {
        return `flex rounded px-2 ${match ? "text-accent lg:text-gray-200 lg:bg-accent": "text-gray-900 dark:text-gray-50 lg:text-gray-400"}`
    }

    return (
        <div className={"fixed inset-x-0 bottom-0 lg:inset-y-0 lg:left-0 lg:w-48 z-40 border-t lg:border-r border-gray-300 dark:border-gray-700 lg:border-gray-700 safe-bottom bg-gray-100 dark:bg-gray-800 lg:bg-gray-800 lg:px-3 flex lg:flex-col justify-evenly lg:justify-start pb-safe-bottom pt-2 lg:pt-safe-top-bar"}>
            <Link className={navClass(libraryMatch)} to="/">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className={"hidden lg:block my-auto mx-2"}>Library</span>
            </Link>
            <Link className={navClass(browseMatch)} to="/browse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className={"hidden lg:block my-auto mx-2"}>Browse</span>
            </Link>
            <Link className={navClass(updatesMatch)} to="/update">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className={"hidden lg:block my-auto mx-2"}>Updates</span>
            </Link>
            <Link className={navClass(historyMatch)} to="/history">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={"hidden lg:block my-auto mx-2"}>History</span>
            </Link>
            <Link className={navClass(settingMatch)} to="/settings">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6 my-2"}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className={"hidden lg:block my-auto mx-2"}>Settings</span>
            </Link>
        </div>
    )
}

export default Navbar;