import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AppKitProvider } from "./AppKitProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppKitProvider>
      <App />
    </AppKitProvider>
  </React.StrictMode>
);
