# Copy this factory

The kit is the thing you copy. The product is not. Grok stays the parent.

## Do

1. Copy `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, and the `factory/` directory into the new repository.
2. Copy `contracts/` (schemas, not a child's board) and empty `docs/log/`.
3. Start a new `factory/board.json`. Do not copy BOARD contents, ledger novels, or any `SESSION_LOG`.
4. Keep `factory/lineage.json` as the parent register. Do not append this child's board to it.
5. Fill AGENTS §1 with one product paragraph whose acceptance is an owner walk of a closed loop.
6. Add the product’s never-move rules to AGENTS §5. Keep: a child never writes VirBk/Grok.
7. Name keystones and single-writer holds on the board. Closed lists.
8. Name gates. G0 is synthetic only. No envelope opens a gate.
9. Point `factory/landing-checks.json` at this stack’s real commands.
10. Score the empty factory against `factory/ASSESSMENT.md`. Below 8 is a kit defect. Fix the kit first.
11. Wait for a spec. Idle is success.
12. When this child pays for a lesson, file an intake (`factory/templates/INTAKE.md`). Validate with `node factory/tools/intake.mjs`. Absorbing is a Grok envelope.

Writer seats: `node factory/tools/seat.mjs recipe desktop-deepseek`. Do not remap the control-plane session.

## Do not

- Copy Otto or Virbos product code, boards, or session logs.
- Start a documentation lane to “bring the docs over.”
- Type counts into README.
- Open a second remote.
- Fill seats because they exist.
- Push to VirBk/Grok from this child.
- Merge this child's BOARD into the parent.

## After the first landing

Run `node factory/tools/landingGate.mjs` from a fresh archive of the commit. If the gate cannot parse its checks from that archive, it fails — it does not fall back to this tree.
