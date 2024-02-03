import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
);
