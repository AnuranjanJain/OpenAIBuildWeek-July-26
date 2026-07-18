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
// bundling pass. OpenNext's generated handler retains Node-style require calls
// for built-ins, so convert those built-ins into an explicit ESM module map.
const handlerPath = path.join(server, "server-functions", "default", "handler.mjs");
const handler = await readFile(handlerPath, "utf8");
const requiredSpecs = [
  ...new Set([...handler.matchAll(/(?<![_\w])require\("([^"]+)"\)/g)].map((match) => match[1])),
];
const canonicalSpecs = [...new Set(requiredSpecs.map((spec) =>
  spec.startsWith("node:") ? spec : `node:${spec}`,
))];
const moduleIdentifier = (spec) => `__builtin_${spec.replace(/[^a-zA-Z0-9]/g, "_")}`;
const imports = canonicalSpecs.map(
  (spec) => `import * as ${moduleIdentifier(spec)} from "${spec}";`,
);
const moduleEntries = requiredSpecs.map((spec) => {
  const canonical = spec.startsWith("node:") ? spec : `node:${spec}`;
  return `  "${spec}": { ...${moduleIdentifier(canonical)} },`;
});
const requireBridge = [
  ...imports,
  "const __builtinModules = {",
  ...moduleEntries,
  "};",
  "const require = (specifier) => {",
  "  const module = __builtinModules[specifier];",
  "  if (module) return module;",
  "  throw new Error(`Unsupported dynamic require: ${specifier}`);",
  "};",
  "",
].join("\n");
await writeFile(handlerPath, `${requireBridge}${handler}`, "utf8");

console.log(`Prepared Sites worker at ${path.relative(root, path.join(server, "index.js"))}`);
