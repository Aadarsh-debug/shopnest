import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {connectDB} from "./config/db.js"
import authroutes from "./routes/authroutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import analyticsRoutes from "./routes/analyticsRoutes.js"
import cors from "cors"
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
  res.send("server running properly")
})
app.use("/api/auth",authroutes);
app.use("/api/products",productRoutes)
app.use("/api/orders",orderRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/analytics",analyticsRoutes)

app.listen(process.env.PORT||5000,()=>{
  console.log(`server is running on port :${process.env.PORT}`);
})
connectDB();

