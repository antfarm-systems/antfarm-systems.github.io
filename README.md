# antfarm.systems

Opinion blog. No thought leadership. No hustle porn.

## Setup

After cloning, enable the tracked git hooks:

```sh
git config core.hooksPath .githooks
```

This activates a pre-commit hook that auto-updates the warrant canary date on every commit.

## Agent Guidelines

Any commit that was written or co-written by an AI agent must include attribution in the commit message:

- Use `Co-Authored-By:` with the model name and a noreply address (e.g. `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`)
- If the agent or model is known, name it specifically. Don't use generic labels like "AI assistant".
- All agent-authored changes are reviewed by a human before commit.
