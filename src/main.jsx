import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

window.addEventListener("message", (event) => {
  if (event.source === window.parent && typeof event.data?.lang === "string") {
    window.__GUANQI_PARENT_LANGUAGE__ = event.data.lang;
  }
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
