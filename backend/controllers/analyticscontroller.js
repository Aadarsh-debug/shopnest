import Order from "../models/Order.js";
import Product from "../models/Products.js"
import User from "../models/User.js"


export const getAdminStats=async(req,res)=>{
  try {
  const totalUsers=await User.countDocuments({});
  const totalProducts=await Product.countDocuments({});
  const totalOrders=await Order.countDocuments({});
  const orders=await Order.find({});
  const totalRevenue=orders.reduce((acc,order)=>acc+order.totalAmount,0)
  res.json({
    totalOrders,
    totalProducts,
    totalRevenue,
    totalUsers
  });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}