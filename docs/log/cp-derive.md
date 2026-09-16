# CP-derive

- Changed: Control-plane derivation is `factory/CONTROL_PLANE.md`. `scopeSearch.mjs` is a landing-gate step. Traps T32 T33 T34. Intakes I09 I10 I11. Decision D-12. Pointer in AGENTS §8.
- Measured: `node factory/tools/landingGate.mjs` and `node factory/tools/scopeSearch.mjs --self-test` on this tree.
- Self-check changed: no SESSION_LOG; no product code; no child's board copied; intakes avoid the refuse list; BOARD regenerated from JSON.
