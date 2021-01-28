import React from 'react';
import { useNavigate } from "@reach/router"

function Input(props) {
    const render = () => {
        switch (typeof props.val) {
            case 'boolean':
                return (
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id={props.id} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-1 appearance-none cursor-pointer" onChange={(e) => props.onChange(e.target.checked)} />
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer shadow"></label>
                    </div>
                )
            default:
                return ""
        }
    }

    return (
        <div className={"flex justify-between py-2"}>
            <label htmlFor={props.id} className={"toggle-label my-auto mx-2"}>{props.label}</label>
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

    const navigate = useNavigate();

    React.useEffect(() => {
        if (!config) {
            fetch(`/api/source/${props.sourceName.toLowerCase()}/config`)
                .then((response) => response.json())
                .then(data => setConfig(data))
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [props.sourceName])

    const login = () => {
        if (username === "" || password === "") {
            return
        }

        fetch(`/api/source/${props.sourceName.toLowerCase()}/login`, {
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
            .then((response) => navigate(`/browse/${props.sourceName}`, { replace: true }))
            .catch((e) => {
                console.log(e);
            });
    }

    const save = () => {
        fetch(`/api/source/${props.sourceName.toLowerCase()}/config`, {
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
        <div className={"p-2"}>
            <div className={"rounded shadow flex flex-col m-auto bg-white my-1"}>
                <h1 className={"m-2 text-left"}>Login</h1>
                <input id="username" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                <input id="password" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                <input id="two_factor" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="two_factor" placeholder="Two Factor" onChange={(e) => setTwoFactor(e.target.value)}></input>
                <div className={"inline-flex"}>
                    <input id="remember-me" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="checkbox" placeholder="Remember Me" onChange={(e) => setRemember(e.target.checked)}></input>
                    <label htmlFor={"remember-me"} className={"my-auto mx-2"}>Remember Me</label>
                </div>
                <button className={"py-2 hover:bg-gray-100 text-accent"} onClick={() => login()}>Submit</button>
            </div>
            <div className={"pb-safe-bottom-scroll"}>
                {config && Object.keys(config).map((type) => (
                    <div key={type} className={"rounded shadow flex flex-col m-auto bg-white divide-y-2 dark:divide-gray-900 divide-gray-100"}>
                        <h1 className={"m-2 text-left"}>{type}</h1>
                        {Object.keys(config[type]).map((k) => (
                            <Input key={k} id={`${type}-${k}`} label={k} val={config[type][k]} onChange={(value) => { const cfg = Object.assign({}, config); cfg[type][k] = value; setConfig(cfg) }} />
                        ))}
                        <button className={"py-2 hover:bg-gray-100 text-accent"} onClick={() => save()}>Submit</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SettingSource;