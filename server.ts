import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Improve Prompt with Gemini AI
app.post("/api/improve", async (req, res) => {
  try {
    const { prompt, category, description } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt content is required" });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are Promptary's resident Elite Prompt Engineer and Data Science Architect. 
Your goal is to optimize and rewrite user-submitted prompts to make them highly structured, professional, and clear.

Follow the Gold Standard structure for Prompt Engineering:
1. **Role / Persona**: Explicitly declare who the AI should act as (e.g., Senior Machine Learning Engineer, Expert Database Administrator, etc.).
2. **Context / Objective**: State the core objective clearly and outline the dataset/problem constraints.
3. **Key Guidelines / Requirements**: Provide a numbered or bulleted list of strict requirements (performance optimizations, libraries, metrics, outputs).
4. **Expected Output Format**: Explicitly specify how the response should be formatted (e.g., modular OOP Python classes with docstrings, CTE-based SQL with partition details, or markdown tables).
5. **Detailed comments**: Instruct the model to include educational comments detailing statistical or database architectural assumptions.

Make the output prompt incredibly detailed, clean, and direct. Return ONLY the improved prompt content in clear markdown, ready to be copied. Do not add conversational wrap-around text or say "Sure, here is the improved prompt". Just start directly with the improved prompt text itself.`;

    const contents = `Optimize the following prompt:
Category: ${category || "General Data Science"}
Description: ${description || "General optimization request"}
Raw Prompt to improve:
---
${prompt}
---`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const improvedText = response.text || "Failed to generate improved prompt.";
    res.json({ improvedPrompt: improvedText });
  } catch (error: any) {
    console.error("Error in /api/improve:", error);
    res.status(500).json({ 
      error: error.message || "An error occurred while communicating with the Gemini API. Please make sure GEMINI_API_KEY is configured in Settings > Secrets." 
    });
  }
});

// 2. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 3. Vite development middleware or static production serving
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to initialize server:", err);
});
