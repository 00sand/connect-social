import React, { useState, useContext } from "react";
import axios from "axios";
import '../App.css';
import Cookies from "universal-cookie"
import { json, useNavigate } from "react-router-dom";
import { AuthContext } from "../helper/AuthContext";

function Login() {

    const [email, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);



    let history = useNavigate();

    const login = () => {
        const data = { email: email, password: password };
        axios.post("https://connect-203.herokuapp.com/auth/login", data, { withCredentials: true }, { credentials: 'include' }).then((response) => {

            if (response.data.error) {
                alert(response.data.error);
            } else {
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
                history('/')

            }
        });
    };
    return (
        <>
            <div className="section flex-c">
                <div className="box width-login">
                    <div className="field mx-4">
                        <label className="label">Email:</label>
                        <div className="control">

                            <input className="input is-rounded"
                                type="email"
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="field mx-4">

                        <label className="label">Password:</label>
                        <div className="control">
                            <input className="input is-rounded"
                                type="password"
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />


                        </div>
                    </div>
                    <div className="pt-4">
                        <button className=" mx-4 button is-link is-rounded" onClick={login}> Login </button>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Login;