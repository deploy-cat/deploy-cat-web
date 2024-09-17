import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  // },
});
