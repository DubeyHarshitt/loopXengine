import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const geminiAi = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

export async function callGemini(
  systemInstruction: string,
  input: string
): Promise<string> {
  const interaction = await geminiAi.interactions.create({
    model: "gemini-3.7-flash",
    system_instruction: systemInstruction,
    input,
  });

  const outputText = interaction.output_text;
  if(!outputText){
    throw new Error("Gemini returned no output text");
  }

  return outputText;
}