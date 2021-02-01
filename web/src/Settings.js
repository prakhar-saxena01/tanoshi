import React from 'react';
import { navigate } from '@reach/router';
import Topbar from './common/Topbar';
import Navbar from './common/Navbar';


function Settings(props) {
    return (
        <div className={"main w-full"}>
            <Topbar>
                <button onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={"w-6 h-6"}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className={"text-gray-300 truncate"}>Settings</span>
                <span></span>
            </Topbar>
            <div className={"w-full"}>
                {props.children}
            </div>
            <Navbar />
        </div>
    )
}

export default Settings;