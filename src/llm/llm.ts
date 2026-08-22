import { callGemini } from "./gemini.ts";

type Provider = "gemini" | "openai" | "anthropic";

export async function callLLM(
  systemInstruction: string,
  input: string,
  provider: Provider
): Promise<string> {
  if (provider === "gemini") {
    return await callGemini(systemInstruction, input);
  }

  throw new Error(`Unsupported LLM provider: ${provider}`);
}