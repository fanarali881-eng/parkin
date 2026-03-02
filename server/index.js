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

// CORS Configuration
const corsOptions = {
  origin: function(origin, callback) {
    callback(null, origin || true);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- Fast Parkin API Integration (Under 10 Seconds) ---
async function getParkinFinesFast(plateData) {
  const { plateNumber, plateCode, plateCategory, emirate } = plateData;
  
  // Webshare Residential Proxy Configuration
  const proxyUrl = "http://rbtthqr-sa-1:3opjjm7k9oh2@p.webshare.io:80";
  const agent = new HttpsProxyAgent(proxyUrl);

  try {
    console.log(`Fetching fines for ${plateNumber} via Direct API (Fast Mode)...`);
    
    // Parkin Internal API Endpoint for Fines
    const response = await axios.post("https://api.parkin.ae/api/fines/get-fines-v2", {
      plate_no: plateNumber,
      plate_source_id: emirate || "1", // Default to Dubai
      plate_type_id: plateCategory || "1", // Default to Private
      plate_color_id: plateCode || "",
      language: "ar"
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer m3EGd2NT8ypR4e9MjYBvKwJhLCgnqUZ5sbXrcHaDQSkPAfzx6F", // Public Bearer Token from Parkin
        "User-Agent": "Parkin/1.0.0 (iPhone; iOS 17.0; Scale/3.00)",
        "Origin": "https://www.parkin.ae",
        "Referer": "https://www.parkin.ae/"
      },
      httpsAgent: agent,
      timeout: 8000 // 8 seconds timeout to ensure speed
    });

    const data = response.data;
    console.log("Parkin API Response:", JSON.stringify(data).substring(0, 100));

    if (data.statusCode === 10000) {
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
    return { status: "error", message: "Service temporarily unavailable. Please try again." };
  }
}

// API Endpoint for Parkin Fines (Fast)
app.post("/api/parkin/fines", async (req, res) => {
  const result = await getParkinFinesFast(req.body);
  res.json(result);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
