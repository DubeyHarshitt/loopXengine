import { GoogleGenAI } from "@google/genai";
import config from "../config/config.ts";

const geminiAi = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

export interface LLMOptions {
  maxTokens?: number;
}

export async function callGemini(
  systemInstruction: string,
  input: string,
  options: LLMOptions = {}
): Promise<string> {
  const interaction = await geminiAi.interactions.create({
    model: "gemini-3.7-flash",
    system_instruction: systemInstruction,
    input,

    // Use the appropriate generation config for your SDK/API version.
    generation_config: {
      max_output_tokens: options.maxTokens ?? 4000,
    },
  });

  const outputText = interaction.output_text;

  if (!outputText) {
    throw new Error("Gemini returned no output text");
  }

  return outputText;
}