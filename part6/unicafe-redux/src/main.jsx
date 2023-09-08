import React from "react";
import ReactDOM from "react-dom/client";

import { createStore } from "redux";
import reducer from "./reducers/reducer";

const store = createStore(reducer);

const App = () => {
  const action = (actionType) => store.dispatch({ type: actionType });

  return (
    <div>
      <button onClick={() => action("GOOD")}>good</button>
      <button onClick={() => action("OK")}>ok</button>
      <button onClick={() => action("BAD")}>bad</button>
      <button onClick={() => action("ZERO")}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

const renderApp = () => {
  root.render(<App />);
};

renderApp();
store.subscribe(renderApp);
