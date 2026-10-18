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

// SQLite Database Setup
const db = new Database("spacevault.db");
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

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SpaceVault Intelligence API with External Feeds" });
});

// ==========================================
// 1. NASA OPEN APIS ENDPOINT (APOD / NeoWs)
// ==========================================
app.get("/api/space/nasa", async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
    const apodResponse = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
    const apodData = await apodResponse.json();

    res.json({
      success: true,
      source: "NASA Open API",
      data: apodData,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from NASA API." });
  }
});

// ==========================================
// 2. LAUNCH LIBRARY 2 ENDPOINT (Upcoming Rockets)
// ==========================================
app.get("/api/space/launches", async (_req, res) => {
  try {
    const response = await fetch("https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=5");
    const data = await response.json();

    res.json({
      success: true,
      source: "Launch Library 2 (The Space Devs)",
      launches: data.results || [],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch upcoming launches." });
  }
});

// ==========================================
// 3. CELESTRAK ENDPOINT (Satellite TLE Data)
// ==========================================
app.get("/api/space/celestrak", async (_req, res) => {
  try {
    const response = await fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json");
    const data = await response.json();

    res.json({
      success: true,
      source: "CelesTrak GP Element Sets",
      satellites: data.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TLE data from CelesTrak." });
  }
});

// ==========================================
// 4. N2YO ENDPOINT (Satellite Tracking Positions)
// ==========================================
app.get("/api/space/n2yo/:noradId", async (req, res) => {
  const { noradId } = req.params; 
  const apiKey = process.env.N2YO_API_KEY;

  if (!apiKey || apiKey === "YOUR_N2YO_API_KEY_HERE") {
    return res.status(400).json({ error: "N2YO API Key not configured in server .env file." });
  }

  try {
    const response = await fetch(`https://api.n2yo.com/rest/v1/satellite/tle/${noradId}&apiKey=${apiKey}`);
    const data = await response.json();

    res.json({
      success: true,
      source: "N2YO Satellite Database",
      tracking: data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to connect to N2YO tracking service." });
  }
});

// AI Space Intelligence Endpoint
app.post("/api/ai/query", (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt format." });
  }

  const cleanPrompt = prompt.trim();
  let aiAnswer = `Telemetry analysis for query: "${cleanPrompt}". All orbital parameters remain nominal with standard solar radiation pressure variance.`;
  
  if (cleanPrompt.toLowerCase().includes("mars")) {
    aiAnswer = "Mars telemetry shows Perseverance operating normally in Jezero Crater. Atmospheric dust optical depth (tau) is measured at 0.65.";
  } else if (cleanPrompt.toLowerCase().includes("launch")) {
    aiAnswer = "Checking Launch Library 2 feeds... Several orbital class missions are scheduled for liftoff within the current 72-hour window.";
  }

  try {
    insertQueryLog.run({ prompt: cleanPrompt, response: aiAnswer });
    res.json({ success: true, answer: aiAnswer });
  } catch (err) {
    res.status(500).json({ error: "Failed to process AI telemetry log." });
  }
});

app.listen(port, () => {
  console.log(`SpaceVault Backend running at http://localhost:${port} with External Space Feeds Active.`);
});