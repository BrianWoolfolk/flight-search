import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "@theme/styles.scss";

const el = document.getElementById("root")!;
const root = ReactDOM.createRoot(el);
root.render(
  <App />
  // <React.StrictMode>
  // </React.StrictMode>
);
