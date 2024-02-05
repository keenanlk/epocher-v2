import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";
import { Flowbite } from "flowbite-react";
import { TimezoneProvider } from "./context/timezone.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Flowbite theme={{ mode: "auto" }}>
      <TimezoneProvider>
        <App />
      </TimezoneProvider>
    </Flowbite>
  </React.StrictMode>,
);
