#!/usr/bin/env node
// Sitting close is spark close. Waivers expire. Sitting increments.
// One sitting is one class of work (T49). Help-mode plus a factory envelope is a split.
//
//   node factory/tools/sitting.mjs check
//   node factory/tools/sitting.mjs look
//   node factory/tools/sitting.mjs close
//   node factory/tools/sitting.mjs --self-test

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const kitRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const spark = join(dirname(fileURLToPath(import.meta.url)), "spark.mjs");

function fail(label, errors) {
  console.error(label);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

function classErrors(root) {
  const path = join(root, "factory/project.json");
  if (!existsSync(path)) return ["factory/project.json missing"];
  let picks;
  try {
    picks = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    return ["factory/project.json: " + String(err.message || err)];
  }
  const dir = join(root, "factory/envelopes");
  const lanes = existsSync(dir)
    ? readdirSync(dir).filter((f) => /^F\d+\.md$/i.test(f))
    : [];
  if (picks.helpMode && picks.helpMode !== "none" && lanes.length) {
    return ["second class of work: helpMode " + picks.helpMode + " with " + lanes.join(", ")];
  }
  return [];
}

function writeFixture(dir, helpMode, envelopes) {
  mkdirSync(join(dir, "factory/envelopes"), { recursive: true });
  writeFileSync(
    join(dir, "factory/project.json"),
    JSON.stringify({ helpMode }, null, 2) + "\n",
  );
  const envDir = join(dir, "factory/envelopes");
  for (const f of existsSync(envDir) ? readdirSync(envDir) : []) {
    rmSync(join(envDir, f), { force: true });
  }
  for (const name of envelopes) {
    writeFileSync(join(envDir, name), "fixture\n");
  }
}

function kitMarkers() {
  const errors = [];
  const landing = readFileSync(join(kitRoot, "factory/landing-checks.json"), "utf8");
  const traps = readFileSync(join(kitRoot, "factory/traps.yaml"), "utf8");
  if (!/sitting\.mjs --self-test/.test(landing)) {
    errors.push("landing-checks.json missing sitting self-test");
  }
  if (!/^[- ]*id: T49\b/m.test(traps)) errors.push("traps.yaml missing T49");
  return errors;
}

function selfTest() {
  const errors = kitMarkers();
  const live = classErrors(kitRoot);
  if (live.length) errors.push(...live.map((e) => "live: " + e));

  const dir = mkdtempSync(join(tmpdir(), "grok-sitting-"));
  try {
    writeFixture(dir, "none", ["F3.md"]);
    if (classErrors(dir).length) errors.push("factory envelopes with helpMode none should pass");

    writeFixture(dir, "fork-and-pr", []);
    if (classErrors(dir).length) errors.push("helpMode without factory envelopes should pass");

    writeFixture(dir, "fork-and-pr", ["F3.md"]);
    if (!classErrors(dir).some((e) => /second class/.test(e))) {
      errors.push("helpMode plus factory envelope did not fail");
    }

    writeFixture(dir, "none", []);
    if (classErrors(dir).length) errors.push("idle factory sitting should pass");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }

  if (errors.length) fail("sitting self-test failed", errors);
  console.log("self-test ok");
}

const cmd = process.argv[2];

if (cmd === "--self-test") selfTest();
else if (cmd === "check") {
  const errors = classErrors(kitRoot);
  if (errors.length) fail("sitting check failed", errors);
  console.log("sitting check ok");
} else {
  const forwarded = process.argv.slice(2);
  const args = forwarded.length ? forwarded : ["look"];
  const r = spawnSync(process.execPath, [spark, ...args], { stdio: "inherit" });
  process.exit(r.status === null ? 1 : r.status);
}
