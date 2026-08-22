const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    throw new Error("GEMINI API Key is not defined");
}

const config = {
    GEMINI_API_KEY,
}

export default config;