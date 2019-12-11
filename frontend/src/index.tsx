import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Main from "./components/Main/main";
import OnUpdateHandler from "./OnUpdate";

import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Main />, document.getElementById("root"));

serviceWorker.register({ onUpdate: OnUpdateHandler });
