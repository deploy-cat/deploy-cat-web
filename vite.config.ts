import solid from "solid-start/vite";
import { defineConfig, PluginOption } from "vite";
import node from "solid-start-node";

export default defineConfig({
  optimizeDeps: {
    disabled: true,
  },
  plugins: [
    solid({
      ssr: true,
      adapter: node(),
    }),
  ],
});
