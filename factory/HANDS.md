# Hands

Not required reading for a seat. The seat reads AGENTS, BOARD, envelope.

The control plane is judgment. Hands are a runner that does not call a model and does not read API keys. Claude Code is an optional pair of hands, not the product.

## Project manager pick

Live values: `factory/project.json`. Allowed ids: `factory/runtimes.json` `catalog`. Named bundles: `topologies`.

```
node factory/tools/hands.mjs pick
node factory/tools/hands.mjs apply-topology local-hands
node factory/tools/hands.mjs apply-topology cloud-grok
node factory/tools/hands.mjs check
```

Change one field after applying a topology. `check` fails an unknown id. Mixes are allowed; unknown ids are not.

Recommended default: Grok cloud + `hands.mjs` + Qwen Code on a live-main worktree + `ff-only`. Local Qwen needs no writer key. DeepSeek Flash is the sweep writer when a key exists.

Optional: `desktop-two-process` if the manager already runs Claude Code. Do not install it to emulate the factory.

## Commands

```
node factory/tools/hands.mjs isolate --lane F3 --base <sha>
node factory/tools/hands.mjs envelope --lane F3
node factory/tools/hands.mjs recipe
node factory/tools/hands.mjs gate --sha <sha>
node factory/tools/hands.mjs land --lane F3 --sha <sha>
```

`isolate` with `worktree` cuts a sibling directory. With `cloud-clone` it prints a clone recipe and does not touch the owner's disk.

`land` with `ff-only` fast-forwards. With `github-rebase-after-approved` it prints the merge and exits; a GitHub Action is not added until a writer secret exists.

Envelope path: `factory/envelopes/<lane>.md`. Writer recipes: `node factory/tools/seat.mjs recipe <writerHarness>`.
