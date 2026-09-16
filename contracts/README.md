# contracts

Versioned interfaces as files, not as code.

- `seat-return.v1.json` — what a writer seat returns. Spend is a number from the meter, not a story.
- `intake.v1.json` — what a child returns to Grok. A child's BOARD is not an intake. A rule with no check is a diary.
- `project.v1.json` — the project manager's live picks. Allowed ids live in `factory/runtimes.json`. `hands.mjs check` is the gate.

When a schema lands: semantic version in the filename, tests beside the file, generated clients never edited by hand. A path the OpenAPI describes must exist in the tree. `$id` is an identifier, not an address.
