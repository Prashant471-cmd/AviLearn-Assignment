import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing from environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Healthcheck API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Species & Field Photo Identification API
app.post("/api/identify-bird", async (req, res) => {
  try {
    const { imageBase64, mimeType, description, location, season } = req.body;

    if (!imageBase64 && !description) {
      return res.status(400).json({ error: "Please provide either an image or a text description." });
    }

    const ai = getGenAI();
    const parts: any[] = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      });
    }

    let prompt = `You are a world-class expert ornithologist and avian taxonomy expert. Analyze this ${imageBase64 ? "bird image" : "field observation description"}.`;
    if (description) prompt += ` Additional user notes: "${description}".`;
    if (location) prompt += ` Location observed: ${location}.`;
    if (season) prompt += ` Season/Time of year: ${season}.`;

    prompt += `\n\nIdentify the top candidate species, explain key diagnostic field marks (wing bars, crown, beak shape, tail structure, plumage patterns), assess confidence level, note similar look-alike species and how to differentiate them, and describe typical habitat, diet, and vocalization cues.

Return your response strictly in valid JSON format matching this schema:
{
  "primaryMatch": {
    "commonName": "string",
    "scientificName": "string",
    "family": "string",
    "order": "string",
    "confidence": "High | Medium | Low",
    "confidencePercentage": 92,
    "summary": "string overview",
    "keyFieldMarks": ["string array of diagnostic visual features"],
    "habitat": "string",
    "diet": "string",
    "behavior": "string",
    "callDescription": "string describing song/call",
    "funFact": "string interesting biological fact"
  },
  "similarSpecies": [
    {
      "commonName": "string",
      "scientificName": "string",
      "distinguishingFeature": "How to tell it apart from the primary match"
    }
  ],
  "expertFieldTips": ["string tips for confirming this identification in the field"]
}`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
      },
    });

    const resultText = response.text || "{}";
    const data = JSON.parse(resultText);
    res.json({ success: true, result: data });
  } catch (error: any) {
    console.error("Bird identification error:", error);
    res.status(500).json({
      error: "Failed to process species identification.",
      details: error.message || String(error),
    });
  }
});

// Dynamic AI Quiz Generation API
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { category, difficulty, region, count = 5 } = req.body;

    const ai = getGenAI();
    const prompt = `Generate an interactive ${difficulty || "Intermediate"} level Ornithology and Bird Identification Quiz with ${count} questions.
Category: ${category || "General Field Identification"}
Region: ${region || "Global & North America"}

Include a mix of questions testing:
1. Field mark recognition (e.g. crown patterns, wing bars, beak adaptations).
2. Diagnostic bird calls and vocalization descriptions.
3. Habitat & behavioral habits.
4. Taxonomic relationships, ecological adaptations, or migration facts.

Return strictly valid JSON format matching this schema:
{
  "quizTitle": "string",
  "quizDescription": "string",
  "questions": [
    {
      "id": "string or number",
      "question": "string clear question text",
      "category": "string",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed ornithological explanation of why this is correct and key field tips to remember.",
      "fieldMarkHint": "A helpful clue pointing to a visual or acoustic feature.",
      "birdContext": {
        "commonName": "Primary species associated with this question if applicable",
        "scientificName": "Latin name"
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const quizData = JSON.parse(response.text || "{}");
    res.json({ success: true, quiz: quizData });
  } catch (error: any) {
    console.error("Quiz generation error:", error);
    res.status(500).json({
      error: "Failed to generate dynamic ornithology quiz.",
      details: error.message || String(error),
    });
  }
});

// Ask AI Ornithologist Field Assistant
app.post("/api/ask-ornithologist", async (req, res) => {
  try {
    const { query, conversationHistory = [] } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }

    const ai = getGenAI();
    
    // Construct chat history or single prompt
    const systemInstruction = `You are Dr. Evelyn Vance, a passionate, authoritative, and friendly Senior Ornithologist and Avian Biology Researcher.
Provide deeply informative, engaging, scientifically accurate yet accessible responses to questions about bird species, migration flyways, anatomy, nesting, acoustics, identification challenges, and bird conservation.
Use formatted Markdown with headings, bullet points, and bold text for field marks and species names. Always highlight key diagnostic traits or ecological roles.`;

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      config: {
        systemInstruction,
      },
    });

    // Replay conversation history if present
    for (const msg of conversationHistory) {
      if (msg.role === "user") {
        await chat.sendMessage({ message: msg.content });
      }
    }

    const response = await chat.sendMessage({ message: query });
    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error("Ask Ornithologist error:", error);
    res.status(500).json({
      error: "Failed to communicate with AI Ornithologist.",
      details: error.message || String(error),
    });
  }
});

// Vite middleware & Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ornithology Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
