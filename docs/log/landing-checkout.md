# Landing checkout optimization

- The landing Action fetches only the commit under test instead of the full repository history and tags. `landingGate.mjs --sha HEAD` uses `git rev-parse` and `git archive`; its checks run from that archive and do not require checkout ancestry.
- Verification command: `node factory/tools/landingGate.mjs --sha HEAD`, run by the pull request's Ubuntu/Node 22 landing job. Its checkout log records `git fetch --depth=1`; the gate still runs every manifest step. The PR check is the execution record.
- Local execution was unavailable because the Windows sandbox helper failed to start. No elapsed-time improvement is claimed.
