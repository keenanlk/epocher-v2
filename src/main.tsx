import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { Flowbite } from "flowbite-react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Flowbite theme={{ mode: "auto" }}>
      <App />
    </Flowbite>
  </React.StrictMode>,
);
