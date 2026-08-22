import { callLLMForJSON } from "./llm/llm.ts";
import type { CriticResult, Plan } from "./types/types.ts";

const CRITIC_SYSTEM_PROMPT = `You are the critic inside a general-purpose "improvement loop" system.
You did NOT produce the output you're reviewing — a separate executor did. Judge it honestly and
independently; do not assume it's good just because it exists. Be specific and skeptical.

You must return ONLY valid JSON, no preamble, no markdown fences, matching exactly this shape:

{
  "score": number,          // 0-100. Judge strictly against the rubric below, not vibes.
  "issues": string[],       // Concrete, actionable problems. Empty array only if score is very high.
  "verdict": "approved" | "needs_revision"
}`;

export async function runCriticStep(params: {
  context: string;
  goal: string;
  plan: Plan;
  output: string;
}): Promise<CriticResult> {
  const { context, goal, plan, output } = params;

  const userMessage = `ORIGINAL CONTEXT:\n${context}\n\nGOAL:\n${goal}\n\nRUBRIC TO EVALUATE AGAINST:\n${plan.critic_rubric
    .map((r) => `- ${r}`)
    .join("\n")}\n\nOUTPUT TO EVALUATE:\n${output}`;

  return callLLMForJSON<CriticResult>(CRITIC_SYSTEM_PROMPT, userMessage, { maxTokens: 1000 });
}