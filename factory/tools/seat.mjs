#!/usr/bin/env node
// Writer seat helper. Prints a recipe or cuts a worktree from live main.
//
//   node factory/tools/seat.mjs list
//   node factory/tools/seat.mjs recipe desktop-deepseek
//   node factory/tools/seat.mjs recipe desktop-qwen
//   node factory/tools/seat.mjs recipe cloud-grok
//   node factory/tools/seat.mjs worktree --lane F4 --base <sha>
//
// Does not call a model. Does not read API keys. The recipe is the launch.

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const RECIPES = {
  "desktop-deepseek": `# Writer seat — DeepSeek through the Claude Code harness.
# Control plane stays on Anthropic in a different terminal.

export ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
export ANTHROPIC_API_KEY="\${DEEPSEEK_API_KEY}"
export ANTHROPIC_MODEL="deepseek-flash"
export ANTHROPIC_SMALL_FAST_MODEL="deepseek-flash"
export ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro"
export ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-flash"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-flash"
export CLAUDE_CODE_SUBAGENT_MODEL="deepseek-flash"

# Cut the worktree from live main, then start Claude Code in that tree.
# Paste the envelope. Print-mode. Poll long jobs in the foreground.
`,
  "desktop-qwen": `# Writer seat — Qwen Code in the worktree.
# Control plane stays Claude Code on Anthropic.

export OPENAI_BASE_URL="\${OPENAI_BASE_URL:-http://127.0.0.1:11434/v1}"
export OPENAI_API_KEY="\${OPENAI_API_KEY:-local}"

# Local:
#   ollama pull qwen3-coder
#   qwen --auth-type openai --model qwen3-coder
#
# Hosted instead:
#   export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
#   export OPENAI_API_KEY="\${DASHSCOPE_API_KEY}"
`,
  "cloud-grok": `# Cloud path. Grok issues the envelope and reviews the return.
# Writer runs on a clone, same recipe as desktop-deepseek or desktop-qwen.

# 1. git ls-remote origin refs/heads/main
# 2. clone that SHA into a throwaway worktree (cloud machine, not the owner's disk)
# 3. run the writer recipe there, print-mode, envelope as stdin
# 4. writer pushes the branch only
# 5. Grok reviews, lands, restamps
#
# Do not add a GitHub Action until the secret exists.
# A permanently red workflow is a hard fail.
`,
};

const cmd = process.argv[2] || "list";

if (cmd === "list") {
  console.log("seat recipes");
  for (const id of Object.keys(RECIPES)) console.log("  " + id);
  console.log("worktree --lane <id> --base <sha>");
  process.exit(0);
}

if (cmd === "recipe") {
  const id = process.argv[3];
  const body = id ? RECIPES[id] : null;
  if (!body) {
    console.error("unknown recipe. try: " + Object.keys(RECIPES).join(", "));
    process.exit(1);
  }
  process.stdout.write(body);
  process.exit(0);
}

if (cmd === "worktree") {
  const laneIdx = process.argv.indexOf("--lane");
  const baseIdx = process.argv.indexOf("--base");
  const lane = laneIdx >= 0 ? process.argv[laneIdx + 1] : "";
  const base = baseIdx >= 0 ? process.argv[baseIdx + 1] : "";
  if (!lane || !base) {
    console.error("usage: node factory/tools/seat.mjs worktree --lane F4 --base <sha>");
    process.exit(1);
  }
  const dest = resolve(root, "..", "grok-" + lane.toLowerCase());
  const r = spawnSync("git", ["worktree", "add", dest, base], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    process.stderr.write(r.stderr || r.stdout || "worktree add failed\n");
    process.exit(r.status === null ? 1 : r.status);
  }
  console.log("worktree " + dest);
  process.exit(0);
}

console.error("usage: node factory/tools/seat.mjs list|recipe|worktree");
process.exit(1);
