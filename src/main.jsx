import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/colors_and_type.css";
import "./styles/site-shared.css";
import "./styles/site-a.css";
import "./styles/a11y.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App/>);
