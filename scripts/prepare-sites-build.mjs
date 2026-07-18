import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const openNext = path.join(root, ".open-next");
const bundledWorker = path.join(root, ".sites-worker", "worker.js");
const dist = path.join(root, "dist");
const server = path.join(dist, "server");
const client = path.join(dist, "client");

await rm(dist, { recursive: true, force: true });
await mkdir(server, { recursive: true });
await mkdir(client, { recursive: true });
await cp(path.join(openNext, "assets"), client, { recursive: true });
await cp(bundledWorker, path.join(server, "index.js"));

console.log(`Prepared Sites worker at ${path.relative(root, path.join(server, "index.js"))}`);
