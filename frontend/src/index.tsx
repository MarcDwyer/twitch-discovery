import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main/main";
import OnUpdateHandler from "./OnUpdate";

import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";

import MyReducers from "./reducers/reducer";

import * as serviceWorker from "./serviceWorker";

import "./index.scss";

const store = createStore(MyReducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register({ onUpdate: OnUpdateHandler });
