import Order from "../models/Order.js";
import { sendEmail } from "../utils/sendEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentId: paymentId || "MOCK_PAY_" + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: "Processing",
    });

    const createdOrder = await order.save();

    // Send confirmation email asynchronously without blocking the response
    try {
      const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
        <p>Total Amount Paid: ₹${Number(totalAmount).toLocaleString("en-IN")}</p>
        <p>Shipping to: ${address?.street || ""}, ${address?.city || ""}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;
      sendEmail({
        email: req.user.email,
        subject: "ShopNest - Order Confirmation #" + createdOrder._id.toString().slice(-6),
        message,
      }).catch((err) => console.log("Email notification error (safe fallback):", err.message));
    } catch (e) {
      // safe fallback
    }

    const populated = await Order.findById(createdOrder._id).populate("items.productId");
    res.status(201).json(populated || createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Allow user if owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .populate("items.productId")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedStatus = await order.save();
      const populated = await Order.findById(updatedStatus._id)
        .populate("user", "id name email")
        .populate("items.productId");
      res.json(populated || updatedStatus);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
