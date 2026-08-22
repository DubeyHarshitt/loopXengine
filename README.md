# Loop Engine (Phase 1)

General-purpose Context + Goal → improvement loop. Works on code, writing, research notes,
resumes, or anything else you paste in — the planner figures out the plan/rubric per task.

## Setup

```bash
bun install          # no deps yet, just sets up bun's lockfile
cp .env.example .env # then fill in your ANTHROPIC_API_KEY
```

## Run

```bash
# From a file
bun run src/cli.ts --context ./my-code.ts --goal "Fix the retry bug and add a test"

# Inline text
bun run src/cli.ts --context "Draft: AI is changing..." --goal "Make this 800 words, beginner friendly"

# Piped
cat notes.md | bun run src/cli.ts --goal "Turn this into a structured blog post"
```

## How it works

```
Context + Goal
      |
      v
  [Planner]  -> assumptions, execution_plan, critic_rubric, exit_condition
      |
      v
  ┌─────────────────────────────┐
  │  loop (until score >= threshold, or max_iterations hit)
  │                              │
  │   [Execute] -> new output    │
  │        |                     │
  │   [Critic]  -> score + issues│
  │        |                     │
  │   score >= threshold? -------┼--> yes: stop
  │        |                     │
  │        no: feed issues back into next Execute call
  └─────────────────────────────┘
      |
      v
  Final output + score history
```

Execute and Critic are deliberately **separate LLM calls** — the model that wrote the
output never grades its own homework.

## Files

- `src/llm.ts` — thin Anthropic API wrapper, used by every step
- `src/planner.ts` — turns context+goal into a structured plan (LLM call #1)
- `src/execute.ts` — produces/revises the output (LLM call per iteration)
- `src/critic.ts` — scores the output against the rubric (separate LLM call per iteration)
- `src/loop.ts` — the controller that wires planner → execute ⇄ critic together
- `src/cli.ts` — command-line entry point

## Next steps (not built yet)

- Rules injection (project-specific conventions file, e.g. a `RULES.md` you point it at)
- Web UI instead of CLI
- Persist iteration history to SQLite instead of just printing it
- "Re-plan" if user disagrees with the planner's assumptions