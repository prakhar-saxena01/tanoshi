import React from 'react';
import { Link } from "@reach/router";

function SettingSources() {
    const [sourceList, setSourceList] = React.useState();
    const [isInstalling, setInstalling] = React.useState(false);

    React.useEffect(() => {
        fetch(`/api/source`)
            .then((response) => response.json())
            .then((data) => {
                setSourceList(data);
            }).catch((e) => {
                console.log(e);
            });
    }, [isInstalling])

    const installSource = (sourceName) => {
        setInstalling(true);
        fetch(`/api/source/${sourceName}/install`, {
                method: "POST"
            })
            .then((response) => setInstalling(false))
            .catch((e) => {
                console.log(e);
                setInstalling(false);
            });
    }

    if (!sourceList) {
        return <div></div>
    }

    return (
        <div className={"p-2"}>
            <h1 className={"text-gray-900 dark:text-gray-100 text-left text-lg"}>Sources</h1>
                {sourceList.map((s, index) => (
                    <div key={index} className={"bg-white dark:bg-gray-700 rounded p-2 shadow"}>
                        <div className={"flex justify-between"}>
                            <Link className={"inline-flex w-full"} to={`/settings/source/${s.Name}`}>
                                <img className={"w-10 h-10 mr-2"} src={s.Icon} alt={s.Name}></img>
                                <div>
                                    <div className={"text-gray-900 dark:text-gray-50 text-left"}>{s.Name}</div>
                                    <div className={"text-gray-800 dark:text-gray-200 text-sm text-left"}>{s.Version}</div>
                                </div>
                            </Link>
                            <button disabled={s.Installed} className={s.Installed ? "" : "block"} onClick={() => installSource(s.Name)}>{s.Installed ? "Installed" : "Install"}</button>
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default SettingSources;