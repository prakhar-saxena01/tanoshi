import React from 'react';
import { Link } from '@reach/router';


function SettingCategories() {
    return (
        <div className={"flex flex-col justify-start rounded bg-gray-100 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-900 px-2 mx-2 shadow"}>
            <Link className={"p-2 text-left text-gray-900 dark:text-gray-100"} to="/settings/reader">Reader</Link>
            <Link className={"p-2 text-left text-gray-900 dark:text-gray-100"} to="/settings/source">Sources</Link>
        </div>
    )
}

export default SettingCategories;