// Copies the site's static files into dist/ after the Tailwind build:
//   - index.html        -> dist/index.html
//   - public/*          -> dist/*
// styles.css is written by tailwindcss -i/-o in the build:css step.

import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)) + "/..";

function copyTree(src, dest) {
  for (const entry of readdirSync(src)) {
    const from = join(src, entry);
    const to = join(dest, entry);
    if (statSync(from).isDirectory()) {
      mkdirSync(to, { recursive: true });
      copyTree(from, to);
    } else {
      mkdirSync(dirname(to), { recursive: true });
      copyFileSync(from, to);
      console.log(`copied ${relative(root, to)}`);
    }
  }
}

mkdirSync(join(root, "dist"), { recursive: true });
copyFileSync(join(root, "index.html"), join(root, "dist", "index.html"));
copyTree(join(root, "public"), join(root, "dist"));
console.log("static files -> dist/ (done)");