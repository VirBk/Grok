#!/usr/bin/env node
// Writer seat helper. Prints a recipe or cuts a worktree from live main.
//
//   node factory/tools/seat.mjs list
//   node factory/tools/seat.mjs recipe qwen-code
//   node factory/tools/seat.mjs recipe aider
//   node factory/tools/seat.mjs recipe opencode
//   node factory/tools/seat.mjs recipe goose
//   node factory/tools/seat.mjs recipe deepseek-openai
//   node factory/tools/seat.mjs recipe claude-code
//   node factory/tools/seat.mjs recipe local-hands
//   node factory/tools/seat.mjs recipe cloud-grok
//   node factory/tools/seat.mjs recipe cloud-git-bus
//   node factory/tools/seat.mjs recipe cursor-desktop
//   node factory/tools/seat.mjs recipe pc-token
//   node factory/tools/seat.mjs recipe pc-dashscope
//   node factory/tools/seat.mjs recipe cloud-dashscope
//   node factory/tools/seat.mjs worktree --lane F4 --base <sha>
//
// Does not call a model. Does not read API keys. The recipe is the launch.

import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const RECIPES = {
  "qwen-code": `# Writer seat — Qwen Code.
# Control plane stays Grok (or Claude desktop). Do not remap the CP session.

export OPENAI_BASE_URL="\${OPENAI_BASE_URL:-http://127.0.0.1:11434/v1}"
export OPENAI_API_KEY="\${OPENAI_API_KEY:-local}"

# Local:
#   ollama pull qwen3-coder
#   qwen --auth-type openai --model qwen3-coder
#
# Hosted instead:
#   export OPENAI_BASE_URL="https://dashscope.aliyuncs.com/compatible-mode/v1"
#   export OPENAI_API_KEY="\${DASHSCOPE_API_KEY}"
#
# Print-mode. Envelope on stdin. Poll long jobs in the foreground.
`,
  aider: `# Writer seat — Aider. Git-native. OpenAI-compat.
# Control plane stays Grok. Do not remap the CP session.

# Local Qwen:
#   export OPENAI_API_BASE="http://127.0.0.1:11434/v1"
#   export OPENAI_API_KEY="local"
#   aider --model ollama/qwen3-coder
#
# DeepSeek:
#   export OPENAI_API_BASE="https://api.deepseek.com/v1"
#   export OPENAI_API_KEY="\${DEEPSEEK_API_KEY}"
#   aider --model deepseek/deepseek-chat
#
# Paste the envelope. Print-mode. Worktree only.
`,
  opencode: `# Writer seat — OpenCode. Multi-model local harness.
# Point it at Qwen local or DeepSeek. Control plane stays Grok.

#   opencode run --model <the project.json writerModel>
# Envelope as stdin. Worktree only. Print-mode.
`,
  goose: `# Writer seat — Goose recipes. Local.
# Control plane stays Grok. Writer is the recipe, not the CP chat.

#   goose run --recipe <file> --path .
# Worktree only. Print-mode. Poll in the foreground.
`,
  "deepseek-openai": `# Writer seat — DeepSeek through any OpenAI-compat client.
# Not Claude Code. Control plane stays Grok.

export OPENAI_BASE_URL="https://api.deepseek.com/v1"
export OPENAI_API_KEY="\${DEEPSEEK_API_KEY}"
export OPENAI_MODEL="deepseek-chat"

# Sweep: deepseek-flash. Keystone writer: deepseek-v4-pro.
# Print-mode. Envelope on stdin. Worktree only.
`,
  "claude-code": `# Writer seat — DeepSeek through the Claude Code harness.
# Optional. Control plane stays on Anthropic in a different terminal,
# or on Grok in the browser. Never this process.

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
  "local-hands": `# Local path. Grok judges. hands.mjs runs git. Writer is the PM pick.

# 1. node factory/tools/hands.mjs check
# 2. git ls-remote origin refs/heads/main
# 3. node factory/tools/hands.mjs isolate --lane <ID> --base <sha>
# 4. node factory/tools/hands.mjs recipe
# 5. writer pushes the branch only
# 6. Grok reviews in a fresh session, lands, restamps
# Prefix: AGENTS, BOARD, envelope, tools first and byte-stable. Paste cache hits.
`,
  "cloud-grok": `# Cloud path when the autobuild PC is off.
# Grok issues and reviews. Writer is aider on a Codespace with DeepSeek/Qwen.

# 1. Owner places DEEPSEEK_API_KEY (or DASHSCOPE_API_KEY) as a Codespaces secret once.
# 2. git ls-remote origin refs/heads/main
# 3. node factory/tools/hands.mjs isolate --lane <ID> --base <sha>
#    prints: gh codespace create ... && gh codespace ssh ... recipe
# 4. Writer in that terminal. Push the branch only.
# 5. Grok reviews, lands, restamps.
#
# Do not remap this Grok session onto DeepSeek or Qwen.
# Do not add a GitHub Action until the secret exists.
# Prefix: AGENTS, BOARD, envelope, tools first. Set x-grok-conv-id only on Grok API. Paste cache hits.
`,
  "cloud-git-bus": `# Cloud CP, local autobuild host still on.
# Grok writes the envelope blob. This PC fetches and runs the same harness as local-hands.

# On the machine that already autobuilds:
#   node factory/tools/hands.mjs watch
#   node factory/tools/hands.mjs isolate --lane <ID> --base <sha>
#   node factory/tools/hands.mjs recipe
# Writer pushes the branch only. Grok reviews and lands.
`,
  "git-bus": `# See cloud-git-bus. isolate git-bus is the pick; this recipe is the PC side.
`,
  "codespace": `# See cloud-grok. isolate codespace is the pick.
`,
  "cursor-desktop": `# Optional local harness. Not a cloud writer.
# Cursor Chat/Agent may override OpenAI base URL to api.deepseek.com (no /v1) or Qwen.
# Cursor Cloud Agents, background agents, automations, and CLI cannot take that token.
# Do not install Cursor to emulate the factory. Control plane stays Grok.
`,
  "pc-token": `# No Claude Code. Grok judges. This PC runs hands. Token is DeepSeek.

# 1. git, node, python3. pipx install aider-chat
# 2. export DEEPSEEK_API_KEY=...   # never git, never VITE_
# 3. node factory/tools/hands.mjs apply-topology pc-token
# 4. git ls-remote origin refs/heads/main
# 5. node factory/tools/hands.mjs isolate --lane <ID> --base <sha>
# 6. node factory/tools/hands.mjs recipe
#    OPENAI_API_BASE=https://api.deepseek.com/v1
#    aider --model deepseek/deepseek-chat
# 7. Writer pushes the branch only. Grok reviews and lands.
# Prefix first. Paste cache hits.
`,
  "pc-dashscope": `# No Claude Code. Grok judges. This PC runs hands. Token is DashScope.

# 1. git, node. Install qwen-code.
# 2. export DASHSCOPE_API_KEY=...
# 3. node factory/tools/hands.mjs apply-topology pc-dashscope
# 4. isolate, then:
#    OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
#    qwen --auth-type openai --model qwen3-coder
# 5. Writer pushes the branch only. Grok reviews and lands.
`,
  "cloud-dashscope": `# No Claude Code. Autobuild PC is off. Token is DashScope.

# 1. Place DASHSCOPE_API_KEY as a Codespaces secret once.
# 2. node factory/tools/hands.mjs apply-topology cloud-dashscope
# 3. isolate prints gh codespace create. Recipe is qwen-code hosted.
# 4. Writer pushes the branch only. Grok reviews and lands.
# Do not add a GitHub Action until the secret exists.
`,
};

RECIPES["desktop-qwen"] = RECIPES["qwen-code"];
RECIPES["desktop-deepseek"] = RECIPES["claude-code"];

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
