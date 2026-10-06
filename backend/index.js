import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {connectDB} from "./config/db.js"
import authroutes from "./routes/authroutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import cors from "cors"
dotenv.config();

const app=express();
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// Health endpoint for Render's healthCheckPath (independent of static assets)
app.get("/api/health",(req,res)=>{
  res.send("server running properly")
})
app.use("/api/auth",authroutes);
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)

// Unknown API routes answer with JSON instead of an HTML error page
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Serve the built React app (production / single-service deployment, e.g. Render)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendBuild = path.resolve(__dirname, "..", "frontend", "build");
const indexHtml = path.join(frontendBuild, "index.html");

if (fs.existsSync(indexHtml)) {
  app.use(express.static(frontendBuild));
  // SPA fallback: every other GET (including /) returns the React index.html
  app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html")) {
      return res.sendFile(indexHtml);
    }
    next();
  });
} else {
  // Local development without a production build: plain-text root response
  app.get("/", (req, res) => {
    res.send("server running properly");
  });
}

app.listen(process.env.PORT||5000,()=>{
  console.log(`server is running on port :${process.env.PORT||5000}`);
})
connectDB();
