import React from "react";
window.React = React;

import { createRoot } from "react-dom/client";
import { Application } from "./app";


const root = createRoot(document.querySelector("#root"));
root.render(<Application />);