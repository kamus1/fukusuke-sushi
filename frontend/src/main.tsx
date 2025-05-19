import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import "./index.css";
import App from "./App.tsx";
import 'bootstrap/dist/css/bootstrap.min.css' // importacion de bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // js de bootstrap

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/fukusuke-sushi">
      <App />
    </BrowserRouter>
  </StrictMode>
);
