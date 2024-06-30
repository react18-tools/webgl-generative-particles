import fs from "node:fs";
import { defineConfig, type Options } from "tsup";
import react18Plugin from "esbuild-plugin-react18";
import cssPlugin from "esbuild-plugin-react18-css";
import { rdiPlugin } from "esbuild-plugin-rdi";

export default defineConfig(
  (options: Options) =>
    ({
      format: ["cjs", "esm"],
      target: "es2019",
      entry: ["./src"],
      sourcemap: false,
      clean: !options.watch,
      bundle: true,
      minify: !options.watch,
      esbuildPlugins: [
        {
          name: "webgl",
          setup(build) {
            if (!options.watch)
              build.onLoad({ filter: /utils\.ts$/, namespace: "file" }, args => {
                const text = fs.readFileSync(args.path, "utf8");
                const contents = text
                  .replace(/if \(!gl[^}]*}/gm, "")
                  .replace(/;\s*if \(![^;]*;/gm, "!;")
                  .trim();
                return { contents, loader: "ts" };
              });
            // eslint-disable-next-line prefer-named-capture-group -- ok
            build.onLoad({ filter: /\.glsl$/, namespace: "file" }, args => {
              const text = fs.readFileSync(args.path, "utf8");
              const lines = text
                // remove comments
                .replace(/\/\*.*\*\//gm, "")
                // remove white spaces around =
                // .replace(/ = /g, "=")
                .split("\n")
                .map(line => line.trim())
                .filter(Boolean);
              const contents = `export default \`${lines[0]}\n${lines.slice(1).join("")}\``;
              return { contents, loader: "ts" };
            });
          },
        },
        react18Plugin({ disableJSXRequireDedup: true }),
        cssPlugin({ generateScopedName: "[folder]__[local]" }),
        rdiPlugin(),
      ],
      ...options,
    }) as Options,
);
