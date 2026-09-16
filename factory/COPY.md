# Copy this factory

The kit is the thing you copy. The product is not.

## Do

1. Copy `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, and the `factory/` directory into the new repository.
2. Copy empty `contracts/README.md` and empty `docs/log/`.
3. Start a new `factory/board.json`. Do not copy BOARD contents, ledger novels, or any `SESSION_LOG`.
4. Fill AGENTS §1 with one product paragraph whose acceptance is an owner walk of a closed loop.
5. Add the product’s never-move rules to AGENTS §5.
6. Name keystones and single-writer holds on the board. Closed lists.
7. Name gates. G0 is synthetic only. No envelope opens a gate.
8. Point `factory/landing-checks.json` at this stack’s real commands.
9. Score the empty factory against `factory/ASSESSMENT.md`. Below 8 is a kit defect. Fix the kit first.
10. Wait for a spec. Idle is success.

Writer seats: `node factory/tools/seat.mjs recipe desktop-deepseek`. Do not remap the control-plane session.

## Do not

- Copy Otto or Virbos product code, boards, or session logs.
- Start a documentation lane to “bring the docs over.”
- Type counts into README.
- Open a second remote.
- Fill seats because they exist.

## After the first landing

Run `node factory/tools/landingGate.mjs` from a fresh archive of the commit. If the gate cannot parse its checks from that archive, it fails — it does not fall back to this tree.
