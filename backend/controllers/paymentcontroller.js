import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Products.js";
import { sendEmail } from "../utils/sendEmail.js";

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw new Error("Razorpay is not configured on the server.");
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};

const getDiscountPercent = (couponCode) => {
  const code = String(couponCode || "").trim().toUpperCase();
  if (code === "SHOPNEST20" || code === "NEST20") return 20;
  if (code === "MINIMAL10" || code === "WELCOME10") return 10;
  return 0;
};

const sendOrderConfirmation = (order, user) => sendEmail({
  email: user.email,
  subject: `ShopNest - Order Confirmation #${order._id.toString().slice(-6)}`,
  message: `<h2>Order Confirmation</h2><p>Hello ${user.name},</p><p>Your payment was successful and your order is being prepared.</p><p>Order ID: <strong>${order._id}</strong></p><p>Total Amount Paid: ₹${Number(order.totalAmount).toLocaleString("en-IN")}</p><p>Thank you for shopping with ShopNest!</p>`,
});

export const createdOrder = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ message: "Checkout details are required." });
    }
    const { items, address, couponCode } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: "No order items provided." });

    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) return res.status(400).json({ message: "One or more items are no longer available." });

    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = productsById.get(String(item.productId));
      const qty = Number(item.qty);
      if (!product || !Number.isInteger(qty) || qty < 1 || qty > product.stock) {
        return res.status(400).json({ message: "An item quantity is invalid or exceeds available stock." });
      }
      orderItems.push({ productId: product._id, qty, price: product.price });
      subtotal += product.price * qty;
    }

    const discount = Math.round((subtotal * getDiscountPercent(couponCode)) / 100);
    const shipping = subtotal >= 999 ? 0 : 99;
    const localOrder = await Order.create({
      user: req.user._id, items: orderItems, totalAmount: subtotal - discount + shipping, address,
      paymentMethod: "Razorpay", paymentStatus: "Pending", status: "Pending",
    });

    try {
      const paymentOrder = await getRazorpay().orders.create({ amount: Math.round(localOrder.totalAmount * 100), currency: "INR", receipt: localOrder._id.toString() });
      localOrder.razorpayOrderId = paymentOrder.id;
      await localOrder.save();
      return res.status(201).json({ appOrderId: localOrder._id, paymentOrderId: paymentOrder.id, amount: paymentOrder.amount, currency: paymentOrder.currency, keyId: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
      await localOrder.deleteOne();
      throw error;
    }
  } catch (error) {
    const status = error.message === "Razorpay is not configured on the server." ? 503 : 500;
    return res.status(status).json({ message: error.message || "Could not start Razorpay checkout." });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { appOrderId, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ _id: appOrderId, user: req.user._id });
    if (!order || order.paymentMethod !== "Razorpay" || !order.razorpayOrderId) return res.status(404).json({ message: "Payment order not found." });
    if (order.paymentStatus === "Paid") return res.json({ order });
    if (!razorpay_payment_id || !razorpay_signature) return res.status(400).json({ message: "Missing Razorpay payment details." });

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${order.razorpayOrderId}|${razorpay_payment_id}`).digest("hex");
    const validSignature = razorpay_signature.length === expectedSignature.length && crypto.timingSafeEqual(Buffer.from(razorpay_signature), Buffer.from(expectedSignature));
    if (!validSignature) return res.status(400).json({ message: "Invalid payment signature." });

    order.paymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "Paid";
    order.status = "Processing";
    await order.save();
    sendOrderConfirmation(order, req.user).catch((error) => console.error("Order confirmation email failed:", error.message));
    const populatedOrder = await Order.findById(order._id).populate("items.productId");
    return res.json({ message: "Payment verified successfully.", order: populatedOrder || order });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: "This Razorpay payment has already been used." });
    return res.status(500).json({ message: error.message || "Could not verify payment." });
  }
};
