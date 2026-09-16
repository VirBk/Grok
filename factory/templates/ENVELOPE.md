ENVELOPE: <LANE> — <TITLE>
Authorization: this envelope, issued by the control plane. Read AGENTS.md, then BOARD.md, then factory/traps.yaml once. Then do the work. Nothing else is required reading.

Work
  <one line: a verb and an object>

Acceptance
  <what a command or the owner can prove>

Base
  <sha from git ls-remote origin refs/heads/main>
  Worktree from that SHA. Rebase onto live main before push. Push the branch only.

Holds
  <paths this seat may write>
  Changed file set equals this list. A stray file is a stop.

Must stay true
  <standing rules plus this lane>
  A false sentence in the diff is a blocking defect.

Verification
  <commands the reviewer re-runs>
  Paste counts from the command that produced them. Long jobs: detached log, rc marker, poll in the foreground, never end the turn between polls.

Look hardest at
  <the ways this lane usually lies>

Self-check
  Before returning, drive the list a reviewer of this lane would be given and fix what you find. Record in docs/log/<lane>.md what the self-check changed.

Return
  A few lines in docs/log/<lane>.md: what changed, the measuring command, no commit id of your own.

You run in print mode: the end of your turn is the end of your process, and nothing wakes you. Never end a turn waiting on a background task or a monitor; wait in the foreground with a bounded sleep loop, then print the full return.
