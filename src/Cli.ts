/**
 * Usage:
 *   bun run src/cli.ts --context ./my-context.txt --goal "Fix the retry bug and add a test"
 *   bun run src/cli.ts --context ./resume.txt --goal "Optimize this resume for the attached JD"
 *
 * Context can also be piped in:
 *   cat my-code.ts | bun run src/cli.ts --goal "Refactor for readability"
 */

import { runLoop } from "./Loop.ts";

async function readContext(args: Record<string, string>): Promise<string> {
  if (args.context) {
    const file = Bun.file(args.context);
    if (await file.exists()) return file.text();
    return args.context; // treat as raw inline text if not a file path
  }
  // fall back to stdin
  const chunks: string[] = [];
  for await (const chunk of Bun.stdin.stream()) {
    chunks.push(Buffer.from(chunk).toString());
  }
  return chunks.join("");
}

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg?.startsWith("--")) {
      const key = arg.slice(2);
      const value = argv[i + 1];

      if (value === undefined) {
        throw new Error(`Missing value for argument --${key}`);
      }

      args[key] = value;
      i++;
    }
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.goal) {
    console.error("Missing --goal. Example:\n  bun run src/cli.ts --context ./file.ts --goal \"Fix the bug\"");
    process.exit(1);
  }

  const context = await readContext(args);
  if (!context.trim()) {
    console.error("No context provided (via --context file/text or stdin).");
    process.exit(1);
  }

  console.log("=".repeat(60));
  console.log("LOOP ENGINE");
  console.log("=".repeat(60));

  const result = await runLoop(context, args.goal, (msg) => console.log(msg));

  console.log("\n" + "=".repeat(60));
  console.log("PLAN");
  console.log("=".repeat(60));
  console.log("Assumptions:");
  result.plan.assumptions.forEach((a) => console.log(`  - ${a}`));
  console.log("\nExecution plan:");
  result.plan.execution_plan.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

  console.log("\n" + "=".repeat(60));
  console.log("SCORE PROGRESSION");
  console.log("=".repeat(60));
  console.log(result.iterations.map((it) => it.critic.score).join(" -> "));
  console.log(`Exit reason: ${result.exit_reason}`);

  console.log("\n" + "=".repeat(60));
  console.log("FINAL OUTPUT");
  console.log("=".repeat(60));
  console.log(result.final_output);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});