#!/usr/bin/env node
// The owner-ask list is closed. A tool-policy refusal is not on it.
//
//   node factory/tools/ownerAsk.mjs --self-test

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function load(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function fail(label, errors) {
  console.error(label);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

const cmd = process.argv[2];
if (cmd !== "--self-test") {
  console.error("usage: node factory/tools/ownerAsk.mjs --self-test");
  process.exit(1);
}

const list = JSON.parse(load("factory/owner-ask.json"));
const agents = load("AGENTS.md");
const cp = load("factory/CONTROL_PLANE.md");
const errors = [];

if (!Array.isArray(list.ask) || list.ask.length < 4) {
  errors.push("ask list too small");
}
if (!Array.isArray(list.notAsk) || list.notAsk.length < 4) {
  errors.push("notAsk list too small");
}

const agentsLower = agents.toLowerCase();
for (const item of ["money", "real people", "gate", "release", "destructive"]) {
  if (!agentsLower.includes(item)) {
    errors.push("AGENTS.md missing closed-list marker: " + item);
  }
}

if (!/tool[- ]policy/i.test(cp)) {
  errors.push("CONTROL_PLANE.md does not name tool-policy");
}
if (!/not an owner ask/i.test(cp)) {
  errors.push("CONTROL_PLANE.md does not say a refusal is not an owner ask");
}
if (!/launch the writer/i.test(cp)) {
  errors.push("CONTROL_PLANE.md does not name launching the writer");
}

if (/start-process/i.test(agents)) {
  errors.push("AGENTS.md names Start-Process; that is a control-plane act, not an ask");
}

const notAskJoined = (list.notAsk || []).join(" ").toLowerCase();
for (const must of ["start-process", "tool-policy"]) {
  if (!notAskJoined.includes(must)) {
    errors.push("owner-ask.json notAsk missing " + must);
  }
}

if (errors.length) fail("ownerAsk self-test failed", errors);
console.log("ownerAsk self-test ok");
