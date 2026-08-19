
import crypto from "crypto"
import dotenv from "dotenv"
import Razorpay from "razorpay";
dotenv.config();

export const createdOrder=async(req,res)=>{
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "A valid payment amount is required." });
    }
    const instance=new Razorpay({
      key_id:process.env.RAZORPAY_KEY_ID ,
      key_secret:process.env.RAZORPAY_KEY_SECRET,
    });
    const options={
      amount: Math.round(amount * 100),
      currency: "INR",
    }
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
     res.status(500).send(error);
  }
}

export const verifyPayment=async(req,res)=>{
   try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
