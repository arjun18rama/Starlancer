import { build } from "esbuild";
import { readdir } from "fs/promises";
import path from "path";

async function getFiles(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await getFiles(res, ext)));
    else if (res.endsWith(ext) && !res.endsWith(`.min${ext}`)) files.push(res);
  }
  return files;
}

async function minify(file) {
  const outFile = file.replace(/\.js$/, ".min.js").replace(/\.css$/, ".min.css");
  await build({
    entryPoints: [file],
    outfile: outFile,
    minify: true,
    bundle: false,
    loader: {
      ".js": "js",
      ".css": "css",
    },
  });
}

async function main() {
  const jsFiles = await getFiles("static/assets/js", ".js");
  const cssFiles = await getFiles("static/assets/css", ".css");
  for (const file of [...jsFiles, ...cssFiles]) {
    await minify(file);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
