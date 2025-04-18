import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";
// import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  // plugins: [tsconfigPaths()],
  test: {
    root: __dirname,
    workspace: ["src/libraries/*"],
    setupFiles: [path.join(__dirname, "./vitest.setup.ts")],
  },
});

console.log(path.join(__dirname, "./vitest.setup.ts"));
