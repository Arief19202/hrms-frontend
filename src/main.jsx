import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        },
      }}
    />
  </StrictMode>
);