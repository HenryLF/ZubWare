import { build } from "esbuild";

import { umdWrapper } from "esbuild-plugin-umd-wrapper";

await build({
  entryPoints: ["ts/*.ts"],
  outdir: "static/lib",
  bundle: true,
  format: "umd",
  platform: "browser",
  minify: false,
  sourcemap: false,
  target: ["es2015"],
  loader: {
    ".ts": "ts", // Process TypeScript files
  },
  plugins: [umdWrapper()],
});
