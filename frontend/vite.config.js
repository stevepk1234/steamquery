import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, ".."), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/health": {
          target: "http://localhost:8000",
          rewrite: (path) => "/",
        },
        "/api/apps": {
          target: "http://localhost:8000",
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
        "/api": "http://localhost:8000",
        "/llm": {
          target: "https://llm-api.arc.vt.edu",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/llm/, "/api/v1"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("Authorization", `Bearer ${env.GPT_API}`);
            });
          },
        },
      },
    },
  };
});
