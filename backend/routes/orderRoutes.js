import express from "express";
import { protect } from "../middlewares/authmiddleware.js";
import { admin } from "../middlewares/adminmiddleware.js";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/ordercontroller.js";

const router = express.Router();

router.route("/").post(protect, createOrder).get(protect, admin, getOrders);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getSingleOrder);
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;