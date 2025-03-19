import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const basenameProd = "/react-shadcn-starter";

export default defineConfig(({ command }) => {
  const isProd = command === "build";

  return {
    base: isProd ? basenameProd : "",
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      global: {
        basename: isProd ? basenameProd : "",
      },
    },
  };
});
