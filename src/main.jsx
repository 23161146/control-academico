import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import "./styles-vps-additions.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/t3_act8_eq05">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
