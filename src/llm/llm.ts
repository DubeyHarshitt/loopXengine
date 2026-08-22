import { callGemini, type LLMOptions } from "./gemini.ts";

type Provider = "gemini" | "openai" | "anthropic";

export interface LLMCallOptions extends LLMOptions {
  provider?: Provider;
}

export async function callLLM(
  systemInstruction: string,
  input: string,
  options: LLMCallOptions = {}
): Promise<string> {
  const provider = options.provider ?? "gemini";

  if (provider === "gemini") {
    return await callGemini(
      systemInstruction,
      input,
      options
    );
  }

  throw new Error(`Unsupported LLM provider: ${provider}`);
}

/**
 * Helper for steps that must return strict JSON (planner, critic).
 * Strips markdown code fences if the model adds them despite instructions.
 */

export async function callLLMForJSON<T>(
  systemPrompt: string,
  userMessage: string,
  options: LLMCallOptions = {}
): Promise<T> {
  const text = await callLLM(
    systemPrompt,
    userMessage,
    options
  );

  const cleaned = text
    .replace(/```json\s*|\s*```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse JSON from LLM response.\nRaw text:\n${text}\n\nParse error: ${err}`
    );
  }
}