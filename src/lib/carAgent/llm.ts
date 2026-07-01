import { ChatGroq } from "@langchain/groq";

export const llm = new ChatGroq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  model: "qwen/qwen3-32b", // Or your preferred Groq model
  temperature: 0,
});