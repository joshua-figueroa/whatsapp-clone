import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { StateProvider } from "./util/StateProvider";
import { initialState, reducer } from "./util/reducer";

ReactDOM.render(
    <StrictMode>
        <StateProvider initialState={initialState} reducer={reducer}>
            <App />
        </StateProvider>
    </StrictMode>,
    document.getElementById("root")
);

serviceWorker.unregister();
