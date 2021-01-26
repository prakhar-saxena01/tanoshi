import React from 'react';
import { useNavigate } from "@reach/router"
import Topbar from './common/Topbar';

function SourceLogin(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [twoFactor, setTwoFactor] = React.useState("");
    const [remember, setRemember] = React.useState(false);

    const navigate = useNavigate();

    const login = () => {
        fetch(`/api/source/${props.sourceName.toLowerCase()}/login`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Username: username,
                Password: password,
                TwoFactor: twoFactor,
                Remember: remember
            })
        })
        .then((response) => navigate(`/browse/${props.sourceName}`, {replace: true}))
        .catch((e) => {
            console.log(e);
        });
    }

    return (
        <div className={"lg:pl-48"}>
            <Topbar>
                <div></div>
                <span className={"text-gray-300"}>{`Login to ${props.sourceName}`}</span>
                <div></div>
            </Topbar>
            <div className={"rounded shadow flex flex-col w-1/2 m-auto"}>
                <input id="username" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)}></input>
                <input id="password" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                <input id="two_factor" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="two_factor" placeholder="Two Factor" onChange={(e) => setTwoFactor(e.target.value)}></input>
                <div className={"inline-flex"}>
                    <input id="remember-me" className={"focus:outline-none mx-2 my-1 p-1 border border-gray-100 h-8"} type="checkbox" placeholder="Remember Me" onChange={(e) => setRemember(e.target.checked)}></input>
                    <label htmlFor={"remember-me"} className={"my-auto mx-2"}>Remember Me</label>
                </div>
                <button className={"py-2 hover:bg-gray-100 text-accent"} onClick={() => login()}>Submit</button>
            </div>
        </div>
    )
}

export default SourceLogin;