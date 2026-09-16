# CP-otto

- Changed: Closed owner-ask list `factory/owner-ask.json`. Hands `launch`. CONTROL_PLANE.md forbids waiting on a tool-policy refusal. Traps T35-T38. Intakes I12-I15. Decision D-13.
- Measured: `node factory/tools/ownerAsk.mjs --self-test` and `node factory/tools/landingGate.mjs` on this tree.
- Self-check changed: no write to Otto; no handoff.md; no remap of the control plane onto a cheaper model; Start-Process is not in AGENTS.md as an ask.
