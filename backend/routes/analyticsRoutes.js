import express from "express"
import { getAdminStats } from "../controllers/analyticscontroller.js";
import { protect } from "../middlewares/authmiddleware.js";
import { admin } from "../middlewares/adminmiddleware.js";
const router=express.Router()

router.get("/",protect,admin, getAdminStats);
export default router