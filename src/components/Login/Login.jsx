/* eslint-disable no-empty-pattern */
import React from "react";
import { Button } from "@material-ui/core";

import "./styles.css";
import { auth, provider } from "../../util/firebase";
import { useStateValue } from "../../util/StateProvider";

export default function Login() {
    const [{}, dispatch] = useStateValue();

    const handleLogin = async () => {
        try {
            const res = await auth.signInWithPopup(provider);
            dispatch({
                type: "SET_USER",
                user: res.user,
            });
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login">
            <div className="login__container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
                    alt=""
                />
                <div className="login__text">
                    <h1>Sign in to WhatsApp</h1>
                </div>
                <Button onClick={handleLogin}>Sign In With Google</Button>
            </div>
        </div>
    );
}
