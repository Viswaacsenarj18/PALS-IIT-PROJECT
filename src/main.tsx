import React from "react";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";
import App from "./App";
import "./index.css";
import { debugEnv } from "./config/api";

// ✅ Debug environment on app startup
if (typeof window !== "undefined") {
  console.log("🚀 HillSmart App Starting...");
  debugEnv();
}

// ✅ Global Error Handling
window.addEventListener("error", (event) => {
  console.error("❌ Uncaught Error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("❌ Unhandled Promise Rejection:", event.reason);
});

// ✅ Root render
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("❌ Root element not found!");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);