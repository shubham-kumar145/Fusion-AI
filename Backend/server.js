

const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Existing Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const websiteRoutes = require("./routes/websiteRoutes");
const backgroundRoutes = require("./bgremover/backgroundRoute");
const builderRoute = require("./web/builderRoute");



// New Image Converter Route
const convertRoute = require("./imgconverter/convertRoute");
// const  resumeRoute=require("./routes/resumeRoute")

// 🆕 New Website Builder Route (Gemini)
// const builderRoute = require("./web/builderRoute");

const app = express();

// Middlewares
app.set("trust proxy", 1);   // added this line 
app.use(express.json({ limit: "50mb" }));   // ⬅️ VERY IMPORTANT for req.body
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
// app.use("/api/website", websiteRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/api/image", convertRoute);
app.use("/api/builder", builderRoute);
// server.js
// app.use("/api/resume", resumeRoute);




// 🆕 Website Builder route
// app.use("/api/builder", builderRoute);   // ⬅️ Correct route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
