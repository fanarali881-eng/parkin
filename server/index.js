const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// CORS Configuration - Allow All for Debugging
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// --- Fast Parkin API Integration (Under 10 Seconds) ---
async function getParkinFinesFast(plateData) {
  const { plateNumber, plateCode, plateCategory, emirate } = plateData;
  
  // Webshare Residential Proxy Configuration
  const proxyUrl = "http://rbtthqr-sa-1:3opjjm7k9oh2@p.webshare.io:80";
  let agent;
  try {
    agent = new HttpsProxyAgent(proxyUrl);
    console.log("[DEBUG] Proxy Agent Created Successfully");
  } catch (e) {
    console.error("[DEBUG] Proxy Agent Creation Error:", e.message);
  }

  try {
    console.log(`[DEBUG] Requesting fines for: ${plateNumber}, Emirate: ${emirate}, Code: ${plateCode}`);
    
    // Parkin Internal API Endpoint for Fines
    const response = await axios.post("https://api.parkin.ae/api/fines/get-fines-v2", {
      plate_no: plateNumber,
      plate_source_id: emirate || "1", 
      plate_type_id: plateCategory || "1", 
      plate_color_id: plateCode || "",
      language: "ar"
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer m3EGd2NT8ypR4e9MjYBvKwJhLCgnqUZ5sbXrcHaDQSkPAfzx6F",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Origin": "https://www.parkin.ae",
        "Referer": "https://www.parkin.ae/"
      },
      // Temporarily disable proxy to test connection stability
      // httpsAgent: agent, 
      timeout: 10000 
    });

    console.log("[DEBUG] Parkin API Response Status:", response.status);
    const data = response.data;
    console.log("[DEBUG] Parkin API Response Data:", JSON.stringify(data).substring(0, 200));
    if (data && data.statusCode === 10000) {
      const fines = data.data?.fines || [];
      return {
        status: "success",
        fines: fines,
        totalAmount: data.data?.total_amount || 0,
        message: fines.length > 0 ? "Fines found" : "No fines found"
      };
    } else {
      return { status: "success", fines: [], message: "No fines found" };
    }
  } catch (error) {
    console.error("Fast API Error:", error.message);
    // Return a structured error instead of crashing
    return { 
      status: "error", 
      message: "Parkin service is busy or proxy failed. Please try again in a moment.",
      details: error.message 
    };
  }
}

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Endpoint for Parkin Fines (Fast)
app.post("/api/parkin/fines", async (req, res) => {
  console.log("Received search request for:", req.body.plateNumber);
  try {
    const result = await getParkinFinesFast(req.body);
    res.json(result);
  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
