import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openNext = path.join(root, ".open-next");
const dist = path.join(root, "dist");
const server = path.join(dist, "server");
const client = path.join(dist, "client");

await rm(dist, { recursive: true, force: true });
await mkdir(server, { recursive: true });
await mkdir(client, { recursive: true });
await cp(openNext, server, { recursive: true });
await cp(path.join(openNext, "assets"), client, { recursive: true });
await cp(path.join(openNext, "worker.js"), path.join(server, "index.js"));

// Sites accepts an already-built ESM worker instead of running Wrangler's
// bundling pass. OpenNext's generated Next.js handler still contains a few
// Node-style built-in imports, so provide the same require bridge Wrangler
// normally injects when nodejs_compat is enabled.
const handlerPath = path.join(server, "server-functions", "default", "handler.mjs");
const handler = await readFile(handlerPath, "utf8");
const requireBridge = [
  'import { createRequire as __createNodeRequire } from "node:module";',
  'const require = __createNodeRequire("file:///worker.js");',
  "",
].join("\n");
await writeFile(handlerPath, `${requireBridge}${handler}`, "utf8");

console.log(`Prepared Sites worker at ${path.relative(root, path.join(server, "index.js"))}`);
