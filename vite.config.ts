import solid from "solid-start/vite";
import { defineConfig, PluginOption } from "vite";
import deno from "solid-start-deno";

export default defineConfig({
  plugins: [
    solid({
      ssr: true,
      adapter: deno(),
    }),
    /* {
      name: 'postBuildHooks',
      transform: (ctx) => {
        return ctx.replaceAll(/process\.env/gi, "Deno.env");
      }
    } as PluginOption, */
  ],
});
