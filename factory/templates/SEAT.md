# Writer seat

You are a writer, not the control plane. Read AGENTS.md, BOARD.md, then the envelope. Read factory/traps.yaml once.

## Start

1. The envelope names the runtime and the spend cap.
2. Cut a worktree from the envelope's base SHA. Never from a lagging checkout.
3. Run the recipe for that runtime (`node factory/tools/seat.mjs recipe <id>`).
4. Work only the holds. Print-mode. Poll long jobs in the foreground.

## Never

- Fast-forward main.
- Review your own branch.
- Export ANTHROPIC_BASE_URL into a control-plane terminal.
- Write API keys to a file that can be committed.
- Touch files outside the hold.

## Stop

Hitting the spend cap is a return, not a hang. Escalation is a new envelope on a stronger seat. A named decay sign is also a return — stop, print the signs, do not try to remember. Successor packet is AGENTS, BOARD, the envelope. Never the transcript.

## Return

A few lines in `docs/log/<lane>.md`: what changed, the measuring command, the model, the spend. No commit id of your own. Shape: `contracts/seat-return.v1.json`.
