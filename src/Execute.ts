import { callLLM } from "./llm/llm.ts";
import type { CriticResult, Plan } from "./types/types.ts";

const EXECUTE_SYSTEM_PROMPT = `You are the executor inside a general-purpose "improvement loop" system.
You produce or revise a concrete output based on the given context, goal, and plan.

If previous feedback is provided, treat it as the most important input — directly address every issue raised.
Return ONLY the resulting output itself (the code / document / analysis / whatever the task calls for).
Do not include explanations, preambles, or meta-commentary about what you changed — just the output.`;

export async function runExecuteStep(params: {
  context: string;
  goal: string;
  plan: Plan;
  previousOutput?: string;
  previousCritic?: CriticResult;
}): Promise<string> {
  const { context, goal, plan, previousOutput, previousCritic } = params;

  let userMessage = `CONTEXT:\n${context}\n\nGOAL:\n${goal}\n\nPLAN TO FOLLOW:\n${plan.execution_plan
    .map((s: any, i: any) => `${i + 1}. ${s}`)
    .join("\n")}`;

  if (previousOutput && previousCritic) {
    userMessage += `\n\nPREVIOUS ATTEMPT:\n${previousOutput}\n\nCRITIC FEEDBACK ON PREVIOUS ATTEMPT (score: ${
      previousCritic.score
    }/100):\n${previousCritic.issues.map((i: any) => `- ${i}`).join("\n")}\n\nRevise the previous attempt to address every issue above.`;
  }

  const text  = await callLLM(EXECUTE_SYSTEM_PROMPT, userMessage, { maxTokens: 1000 });
  return text;
}