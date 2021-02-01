import React from 'react';

function Input(props) {
    const render = () => {
        switch (typeof props.val) {
            case 'boolean':
                return (
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id={props.id} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-1 appearance-none cursor-pointer" onChange={(e) => props.onChange(e.target.checked)} checked={props.val} />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-900 cursor-pointer shadow"></label>
                    </div>
                )
            default:
                return ""
        }
    }

    return (
        <div className={"flex justify-between py-2 mx-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"}>
            <label htmlFor={props.id} className={"toggle-label my-auto mx-2 text-gray-900 dark:text-gray-100"}>{props.label}</label>
            {render()}
        </div>
    )
}

function SettingSource(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFactor, setTwoFactor] = React.useState("");
    const [remember, setRemember] = React.useState(false);
    const [config, setConfig] = React.useState();

    React.useEffect(() => {
        if (!config) {
            fetch(`/api/source/${props.sourceName}/config`)
                .then((response) => response.json())
                .then(data => setConfig(data))
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [props.sourceName, config])

    const login = () => {
        if (username === "" || password === "") {
            return
        }

        fetch(`/api/source/${props.sourceName}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                TwoFactor: twoFactor,
                Remember: remember
            })
        })
            .then((response) => response)
            .catch((e) => {
                console.log(e);
            });
    }

    const save = () => {
        fetch(`/api/source/${props.sourceName}/config`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(config)
        })
            .then((response) => response)
            .catch((e) => {
                console.log(e);
            });
    }

    return (
        <div className={"p-2 pb-safe-bottom-scroll"}>
            <h1 className={"m-2 text-left text-gray-900 dark:text-gray-100"}>Login</h1>
            <div className={"rounded shadow flex flex-col m-auto bg-white dark:bg-gray-800 pt-2"}>
                <input id="username" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 dark:border-gray-700 h-8 dark:bg-gray-800 text-gray-900 dark:text-gray-100"} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                <input id="password" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 dark:border-gray-700 h-8 dark:bg-gray-800 text-gray-900 dark:text-gray-100"} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                <input id="two_factor" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 dark:border-gray-700 h-8 dark:bg-gray-800 text-gray-900 dark:text-gray-100"} type="two_factor" placeholder="Two Factor" onChange={(e) => setTwoFactor(e.target.value)}></input>
                <div className={"inline-flex"}>
                    <input id="remember-me" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="checkbox" placeholder="Remember Me" onChange={(e) => setRemember(e.target.checked)}></input>
                    <label htmlFor={"remember-me"} className={"my-auto mx-2 text-gray-900 dark:text-gray-100"}>Remember Me</label>
                </div>
                <button className={"py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b text-accent"} onClick={() => login()}>Submit</button>
            </div>
            <h1 className={"m-2 text-left text-gray-900 dark:text-gray-100"}>Languages</h1>
            {config && <div className={"rounded shadow flex flex-col m-auto bg-white dark:bg-gray-800 divide-y-2 dark:divide-gray-900 divide-gray-50"}>
                {config && Object.keys(config.Language).map((k) => (
                    <Input key={k} id={`lang-${k}`} label={k} val={config.Language[k]} onChange={(value) => { const cfg = Object.assign({}, config); cfg.Language[k] = value; setConfig(cfg) }} />
                ))}
                <button className={"py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b text-accent"} onClick={() => save()}>Submit</button>
            </div>}
        </div>
    )
}

export default SettingSource;