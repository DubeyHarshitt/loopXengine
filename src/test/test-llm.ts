import { callLLM } from "../llm/llm.ts";

type Provider = "gemini" | "openai" | "anthropic";

const systemInstruction = "You are a helpful assistant.";
const input = "Explain what an API and Postman.";
const provider = "gemini";

async function llmTest(
  systemInstruction: string,
  input: string,
  provider: Provider
): Promise<void>{
    const result = await callLLM(systemInstruction, input, provider)

    console.log("LLM Response: " + result)
}

llmTest(systemInstruction, input, provider);