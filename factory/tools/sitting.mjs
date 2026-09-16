#!/usr/bin/env node
// Sitting close is spark close. Waivers expire. Sitting increments.
//
//   node factory/tools/sitting.mjs close
//   node factory/tools/sitting.mjs look

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const spark = join(dirname(fileURLToPath(import.meta.url)), "spark.mjs");
const args = process.argv.slice(2);
const forwarded = args.length ? args : ["look"];
const r = spawnSync(process.execPath, [spark, ...forwarded], { stdio: "inherit" });
process.exit(r.status === null ? 1 : r.status);
