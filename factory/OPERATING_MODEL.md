# Operating model

Not required reading for a seat. The seat reads AGENTS, BOARD, envelope.

## Loop

Authorize → Isolate → Build → Review → Land → Record.

An envelope is the only start. A writer self-checks. A reviewer who is not the author covers behaviour and coherence. The control plane verifies at the objects, runs the landing gate from a fresh archive, fast-forwards main, restamps, deletes the envelope.

## Roles

- Control plane: envelopes, landing, board, docs. Never product code.
- Writer: one envelope, one worktree, one branch.
- Reviewer: same tier as the writer. Verdict on line one. Edit nothing.
- Challenger: named keystone, owner word, leads not verdicts. Never Fable.
- Owner: money, names, live effects, gates, release.

## Why the board is JSON

Hand-edited markdown tables were a carrier class in Otto and Virbos: invented clocks, backticks in bash, f-string braces, PII-shaped literals that trip sweeps, and files that grew past a megabyte. `factory/board.json` is the source. `BOARD.md` is generated.

## Why the landing gate is local

Hosted CI that cannot pass taught people to stop reading badges. Minutes ran out. Runs failed in three seconds with zero steps. The gate that remains parses its steps from the commit under test. A Linux compile remains the only platform adversary, and the board names when it has not run.

## Why idle is success

Filling seats created overlapping holds. Conflict resolution is unreviewed code. Two writers is a ceiling.

## Why the control plane is not the writer

The money is the tool loop. Remapping the Claude Code window to DeepSeek keeps the harness and replaces the judgment. Spawn a second seat. Leave the control plane on Claude Code (desktop) or Grok (cloud). Sweep writers are DeepSeek Flash or local Qwen. Reviewers are never weaker than the writer. Recipes: `node factory/tools/seat.mjs`.
