#!/usr/bin/env node
// Landing gate. Runs factory/landing-checks.json from a fresh git archive
// of the commit under test. Does not fall back to this tree's copy.
//
//   node factory/tools/landingGate.mjs
//   node factory/tools/landingGate.mjs --sha HEAD
//
// Every step's exit code is captured. A pipe must not swallow failure:
// steps run through bash -e from a file.

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");
const shaArg = process.argv.includes("--sha")
  ? process.argv[process.argv.indexOf("--sha") + 1]
  : "HEAD";

function git(args) {
  const r = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
  if (r.status !== 0) throw new Error("git " + args.join(" ") + " failed");
  return (r.stdout || "").trim();
}

const sha = git(["rev-parse", shaArg]);
const short = sha.slice(0, 7);
const workDir = join(tmpdir(), "grok-gate-" + short + "-" + randomBytes(4).toString("hex"));
const logDir = workDir + "-logs";
mkdirSync(workDir, { recursive: true });
mkdirSync(logDir, { recursive: true });

const archive = spawnSync("bash", ["-lc", `git archive ${sha} | tar -x -C "${workDir}"`], {
  cwd: repoRoot,
  encoding: "utf8",
});
if (archive.status !== 0) {
  console.error("archive failed");
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(join(workDir, "factory/landing-checks.json"), "utf8"));
} catch (err) {
  console.error("commit", sha, "has no parseable factory/landing-checks.json");
  console.error(String(err.message || err));
  console.error("The gate does not fall back to this tree.");
  process.exit(1);
}

const steps = Array.isArray(manifest.steps) ? manifest.steps : [];
const results = [];

console.log("grok landing gate");
console.log("  commit   " + sha);
console.log("  archive  " + workDir);
console.log("  steps    " + steps.length);
console.log("");

for (const [i, step] of steps.entries()) {
  const n = i + 1;
  if (!step.run) {
    console.log("  --  " + String(n).padStart(2, "0") + "  " + step.name + "  (no run)");
    results.push({ name: step.name, status: null });
    continue;
  }
  process.stdout.write("  ..  " + String(n).padStart(2, "0") + "  " + step.name + " ... ");
  const scriptPath = join(logDir, String(n).padStart(2, "0") + ".sh");
  writeFileSync(scriptPath, step.run.endsWith("\n") ? step.run : step.run + "\n");
  const r = spawnSync("bash", ["-e", scriptPath], {
    cwd: workDir,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  const status = r.status === null ? 1 : r.status;
  results.push({ name: step.name, status });
  console.log(status === 0 ? "ok" : "FAILED");
  writeFileSync(join(logDir, String(n).padStart(2, "0") + ".txt"), (r.stdout || "") + (r.stderr || ""));
}

const failed = results.filter((r) => r.status !== null && r.status !== 0);
console.log("");
if (failed.length === 0) {
  rmSync(workDir, { recursive: true, force: true });
  rmSync(logDir, { recursive: true, force: true });
  console.log("GATE PASSED");
  process.exit(0);
}
console.log("GATE FAILED");
for (const f of failed) console.log("  " + f.name + " exit " + f.status);
console.log("  archive " + workDir);
process.exit(1);
