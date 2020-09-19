import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { Sidebar, Chat, Login } from "./components";
import { useStateValue } from "./util/StateProvider";

export default function App() {
    const [{ user }] = useStateValue();

    return (
        <div className="app">
            {!user ? (
                <Login />
            ) : (
                <div className="app__body">
                    <Router>
                        <Sidebar />
                        <Switch>
                            <Route exact path="/room/:roomID">
                                <Chat />
                            </Route>
                        </Switch>
                    </Router>
                </div>
            )}
        </div>
    );
}
