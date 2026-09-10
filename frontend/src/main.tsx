import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import "./index.css";

// Deploy novo = recarrega sozinho. Sem isso, o service worker so troca a versao em cache
// nos bastidores e quem ja estava com a aba aberta continuava vendo o JS antigo ate fechar
// e reabrir por conta propria - ninguem sabe que precisa fazer isso.
const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(true);
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
