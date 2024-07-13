import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  output: "server",
  security: {
    checkOrigin: true,
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    db(),
  ],
  vite: {
    optimizeDeps: {
      exclude: ["astro:db"],
    },
  },
});
