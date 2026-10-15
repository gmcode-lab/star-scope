import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "20kb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// SQLite Database Setup (auto-creates starscope.db)
const db = new Database("starscope.db");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS telemetry_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    mission_name TEXT NOT NULL,
    status TEXT NOT NULL,
    health TEXT NOT NULL,
    recorded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS ai_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const insertQueryLog = db.prepare(`
  INSERT INTO ai_queries (prompt, response) VALUES (@prompt, @response)
`);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "StarScope API Server is running!" });
});



// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "StarScope Intelligence API" });
});

// AI Space Intelligence Endpoint (Mock/Extensible LLM orchestrator)
app.post("/api/ai/query", (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt format." });
  }

  const cleanPrompt = prompt.trim();
  let aiAnswer = `Telemetry analysis for query: "${cleanPrompt}". All orbital parameters remain nominal with standard solar radiation pressure variance.`;
  
  if (cleanPrompt.toLowerCase().includes("mars")) {
    aiAnswer = "Mars telemetry shows Perseverance operating normally in Jezero Crater. Atmospheric dust optical depth (tau) is measured at 0.65.";
  } else if (cleanPrompt.toLowerCase().includes("jwst") || cleanPrompt.toLowerCase().includes("webb")) {
    aiAnswer = "JWST is stable at the Sun-Earth L2 Lagrangian point. Primary mirror segment alignment adjustments completed successfully.";
  }

  try {
    insertQueryLog.run({ prompt: cleanPrompt, response: aiAnswer });
    res.json({ success: true, answer: aiAnswer });
  } catch (err) {
    res.status(500).json({ error: "Failed to process AI telemetry log." });
  }
});

app.listen(port, () => {
  console.log(`StarScope Backend running at http://localhost:5000`);
});