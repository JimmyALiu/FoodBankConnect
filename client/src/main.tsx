import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from '@auth0/auth0-react';



createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain="dev-i32hsfdjh4urw1cg.us.auth0.com"
    clientId="IbkKcyGoUeTWnqcPHGPElCOAggWSQZgW"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>
);
