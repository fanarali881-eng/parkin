const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
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
app.use('/admin', express.static('admin'));

// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      callback(null, origin || true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- Parkin Scraper Logic with Residential Proxy ---
async function scrapeParkinFines(plateData) {
  const { plateNumber, plateCode, plateCategory, emirate } = plateData;
  let browser;
  try {
    // Webshare Residential Proxy Configuration
    const proxyServer = "http://p.webshare.io:80";
    const proxyUsername = "rbtthqr-sa-1"; // Using the first proxy from the list
    const proxyPassword = "3opjjm7k9oh2";

    browser = await chromium.launch({ 
      headless: true,
      proxy: {
        server: proxyServer,
        username: proxyUsername,
        password: proxyPassword
      }
    });

    const context = await browser.new_context({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 720 }
    });

    const page = await context.new_page();
    
    console.log(`Starting search for plate: ${plateNumber} via Residential Proxy...`);
    
    // Navigate to Parkin Home
    await page.goto("https://www.parkin.ae/ar/home", { waitUntil: "networkidle", timeout: 60000 });
    
    // Close popup if exists
    try { await page.click(".fancybox-close-small", { timeout: 5000 }); } catch(e) {}

    // Click Pay Fines
    await page.click("text=Pay Fines");
    await page.waitForTimeout(2000);

    // Fill plate number
    await page.waitForSelector("#plate-number", { timeout: 10000 });
    await page.fill("#plate-number", plateNumber);
    
    // Trigger search
    await page.click("button:has-text('Continue')");
    
    // Wait for results or error message
    await page.waitForTimeout(5000);
    
    const content = await page.content();
    const hasNoFines = content.includes("لا توجد مخالفات") || content.includes("No fines found");
    
    console.log(`Search completed. Result: ${hasNoFines ? "No fines" : "Fines found or check required"}`);

    return {
      status: "success",
      fines: hasNoFines ? [] : [{ amount: "Unknown", description: "Check original site for details" }],
      message: hasNoFines ? "No fines found" : "Fines might exist, please check details"
    };
  } catch (error) {
    console.error("Scraping error with proxy:", error);
    return { status: "error", message: "Failed to fetch data from Parkin. Please try again later." };
  } finally {
    if (browser) await browser.close();
  }
}

// API Endpoint for Parkin Fines
app.post("/api/parkin/fines", async (req, res) => {
  const result = await scrapeParkinFines(req.body);
  res.json(result);
});

// --- Existing Socket.IO and Admin Logic ---
// [Simplified for this implementation]

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
