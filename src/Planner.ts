import { callLLMForJSON } from "@/llm/llm.ts";
import type { Plan } from "@/types/types.ts";

const PLANNER_SYSTEM_PROMPT = `You are a planning module inside a general-purpose "improvement loop" system.
 
The system works like this: a user gives a CONTEXT (raw material — code, a document, research notes, anything)
and a GOAL (what they want done to it). Your job is ONLY to turn that into a structured plan that later
steps (an "executor" and a "critic") will follow. You do not do the actual work yourself.
 
You must return ONLY valid JSON, no preamble, no markdown fences, matching exactly this shape:
 
{
  "assumptions": string[],       // Anything you had to assume because the goal/context was ambiguous.
                                   // Be specific, e.g. "Assuming target is ATS keyword match, not human tone."
  "execution_plan": string[],    // Ordered, concrete steps the executor should follow. 3-7 steps.
  "critic_rubric": string[],     // Concrete, checkable questions the critic should evaluate the output against.
                                   // These should be specific to THIS context+goal, not generic advice.
  "exit_condition": {
    "score_threshold": number,   // 0-100. Pick based on how high-stakes the task is (correctness-critical
                                   // tasks like code fixes deserve 90+, subjective tasks like writing can be 75-85).
    "max_iterations": number     // Hard cap, 2-5. Prevents infinite loops if the score plateaus.
  }
}
 
Rules:
- Never leave execution_plan or critic_rubric empty.
- If the context is thin or the goal is vague, do NOT ask a clarifying question — make the most reasonable
  assumption, state it clearly in "assumptions", and proceed. The user can see and correct assumptions.
- Tailor the plan and rubric to the actual domain implied by the context (code / writing / research /
  analysis / anything else) — do not use a generic one-size-fits-all plan.
- Keep each plan/rubric item to one sentence.`;

export async function generatePlan( context: string, goal: string): Promise<Plan>{
  const userMessage = `CONTEXT:\n${context}\n\nGOAL:\n${goal}`;
  return callLLMForJSON<Plan>(PLANNER_SYSTEM_PROMPT, userMessage, { provider: "gemini", maxTokens: 1000 });
}