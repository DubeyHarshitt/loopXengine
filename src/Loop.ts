import { generatePlan } from "./Planner.ts";
import { runExecuteStep } from "./Execute.ts";
import { runCriticStep } from "./Critic.ts";
import type { Iteration, LoopResult } from "./types/types.ts";

export async function runLoop(
  context: string,
  goal: string,
  onProgress?: (msg: string) => void
): Promise<LoopResult> {
  const log = onProgress ?? (() => {});

  log("Planning...");
  const plan = await generatePlan(context, goal);
  log(`Plan ready. Threshold: ${plan.exit_condition.score_threshold}, max iterations: ${plan.exit_condition.max_iterations}`);

  const iterations: Iteration[] = [];
  let currentOutput = "";
  let exitReason: LoopResult["exit_reason"] = "max_iterations_reached";

  for (let i = 1; i <= plan.exit_condition.max_iterations; i++) {
    log(`\nIteration ${i}: executing...`);

    const previous = iterations[iterations.length - 1];
    currentOutput = await runExecuteStep({
      context,
      goal,
      plan,
      previousOutput: previous?.output,
      previousCritic: previous?.critic,
    });

    log(`Iteration ${i}: critiquing...`);
    const critic = await runCriticStep({ context, goal, plan, output: currentOutput });

    iterations.push({ iteration_number: i, output: currentOutput, critic });
    log(`Iteration ${i}: score = ${critic.score}/100`);

    if (critic.score >= plan.exit_condition.score_threshold) {
      exitReason = "score_threshold_met";
      break;
    }
  }

  return {
    plan,
    iterations,
    final_output: currentOutput,
    exit_reason: exitReason,
  };
}