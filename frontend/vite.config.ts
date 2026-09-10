import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // Registro manual em main.tsx (abaixo) para poder recarregar a pagina sozinho quando
      // sair versao nova - com injectRegister automatico nao da pra encaixar esse callback.
      injectRegister: false,
      // So o app shell (html/css/js/icones) fica em cache - nenhuma resposta de /api entra
      // aqui. Sem isso o service worker cacheava dado de trabalho (ordem, ativo, indicador)
      // e a tela mais recente as vezes mostrava numero de ontem sem avisar ninguem.
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallbackDenylist: [/^\/api\//],
        // O novo service worker assume na hora (nao espera todas as abas fecharem) - e' o
        // que faz o recarregamento automatico do main.tsx realmente pegar a versao nova.
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        name: "RLP Maintenance CMMS",
        short_name: "RLP Maintenance",
        description: "Gestao de manutencao industrial - ativos, planos, ordens, almoxarifado e lubrificacao.",
        lang: "pt-BR",
        theme_color: "#0b1e3a",
        background_color: "#0b1e3a",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/brand/favicon.png", sizes: "180x180", type: "image/png" },
          { src: "/brand/favicon.png", sizes: "192x192", type: "image/png" },
          { src: "/brand/favicon.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
