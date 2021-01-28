import React from 'react';
import { Link } from '@reach/router';


function SettingCategories() {
    return (
        <div className={"flex flex-col justify-start rounded-lg bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 px-2"}>
            <Link className={"p-2 text-left"} to="/settings/reader">Reader</Link>
            <Link className={"p-2 text-left"} to="/settings/source">Sources</Link>
        </div>
    )
}

export default SettingCategories;