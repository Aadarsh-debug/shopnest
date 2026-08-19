import express from "express"
import { createdOrder, verifyPayment } from "../controllers/paymentcontroller.js";
import { protect } from "../middlewares/authmiddleware.js";
const router=express.Router();
router.post('/order',protect,createdOrder);
router.post("/verify",protect,verifyPayment);
export default router
