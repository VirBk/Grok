#!/usr/bin/env node
// Fail if a live file is over its cap. Caps come from factory/budgets.json
// in this tree. Lane logs are globbed; missing files are not a failure.

import { readFileSync, statSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const budgets = JSON.parse(readFileSync(join(root, "factory/budgets.json"), "utf8"));

const failures = [];

function check(path, capKb) {
  const full = join(root, path);
  if (!existsSync(full)) return;
  const kb = statSync(full).size / 1024;
  if (kb > capKb) failures.push(`${path} ${kb.toFixed(1)} KB > ${capKb} KB`);
}

for (const file of budgets.files) check(file.path, file.capKb);

for (const glob of budgets.globs ?? []) {
  if (glob.pattern === "docs/log/*.md") {
    const dir = join(root, "docs/log");
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(".md")) continue;
      check(relative(root, join(dir, name)), glob.capKb);
    }
  }
}

if (failures.length) {
  console.error("size budget failed:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log("size budget ok");
