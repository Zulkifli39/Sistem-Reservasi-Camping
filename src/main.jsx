import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.jsx";
import {AuthProvider} from "./componentsAdmin/AuthProvider.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* Bungkus App dengan AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);
