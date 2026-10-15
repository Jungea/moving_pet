import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const directory = new URL("../dist-test/tests/", import.meta.url);
const files = (await readdir(directory))
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => new URL(name, directory).pathname.replace(/^\/(.:\/)/, "$1"));

const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
process.exitCode = result.status ?? 1;
