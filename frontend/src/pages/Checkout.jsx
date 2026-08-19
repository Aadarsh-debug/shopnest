import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { authHeader, request } from "../services/api";
import { IconShield, IconTruck, IconCheck, IconLock, IconArrowRight } from "../components/Icons";

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart, finalTotal, subtotal, discountAmount, shippingFee, coupon } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "Sophia Reynolds",
    street: "42 Greenway Boulevard, Apt 4B",
    city: "Bengaluru",
    postalCode: "560001",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState("instant"); // 'instant' | 'razorpay'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!items.length) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-hairline)", maxWidth: "500px", margin: "2rem auto" }}>
        <h2 style={{ marginBottom: "1rem" }}>Your Bag is Empty</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (paymentMethod === "razorpay") {
        if (!window.Razorpay) {
          throw new Error("Razorpay checkout could not be loaded. Please check your connection and try again.");
        }

        const paymentOrder = await request("/payments/order", {
          method: "POST",
          headers: authHeader(user),
          body: JSON.stringify({
            items: items.map(({ _id, qty }) => ({ productId: _id, qty })),
            address,
            couponCode: coupon?.code,
          }),
        });

        if (!paymentOrder.keyId || !paymentOrder.paymentOrderId) {
          throw new Error("Payment setup is incomplete. Please restart the backend and confirm the Razorpay test keys are configured.");
        }

        const result = await new Promise((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: paymentOrder.keyId,
            amount: paymentOrder.amount,
            currency: paymentOrder.currency || "INR",
            name: "ShopNest Studio",
            description: "ShopNest Order Fulfillment",
            order_id: paymentOrder.paymentOrderId,
            prefill: {
              name: address.fullName || user?.name,
              email: user?.email,
            },
            handler: resolve,
            modal: { ondismiss: () => reject(new Error("Payment window was dismissed.")) },
          });
          rzp.open();
        });

        const verifiedPayment = await request("/payments/verify", {
          method: "POST",
          headers: authHeader(user),
          body: JSON.stringify({ ...result, appOrderId: paymentOrder.appOrderId }),
        });

        clearCart();
        addToast("Your payment was successful and your order is being prepared!", "success", "Order Placed");
        navigate(`/orders/${verifiedPayment.order._id}`);
        return;
      }

      const newOrder = await request("/orders", {
        method: "POST",
        headers: authHeader(user),
        body: JSON.stringify({
          items: items.map(({ _id, qty, price }) => ({ productId: _id, qty, price })),
          totalAmount: finalTotal,
          address,
          paymentId: "INSTANT_PAY_" + Date.now(),
        }),
      });

      clearCart();
      addToast("Your order has been confirmed and is being prepared!", "success", "Order Placed");
      navigate(newOrder._id ? `/orders/${newOrder._id}` : "/orders", {
        state: { notice: "Order successfully confirmed." },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not complete order processing.");
      addToast(err.message || "Order placement failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow">FINAL STEP</div>
        <h1>Frictionless Checkout</h1>
      </div>

      {error && (
        <div style={{ background: "#fcf1ed", color: "var(--accent-earth)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "2rem", border: "1px solid #f3d4ca" }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: "grid", gridTemplateColumns: "1.3fr 0.9fr", gap: "3.5rem", alignItems: "start" }}>
        {/* Left Column: Shipping & Payment Method */}
        <div>
          {/* Shipping Address Box */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconTruck size={20} style={{ color: "var(--accent-pine)" }} />
              <span>1. Delivery Address</span>
            </h2>

            <div className="form-group">
              <label className="form-label">Full Recipient Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="input-field"
                value={address.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & Apartment</label>
              <input
                type="text"
                name="street"
                required
                className="input-field"
                value={address.street}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="input-field"
                  value={address.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal / PIN Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  className="input-field"
                  value={address.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                required
                className="input-field"
                value={address.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Payment Mode Selector */}
          <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconShield size={20} style={{ color: "var(--accent-pine)" }} />
              <span>2. Payment Method</span>
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Option 1: Instant Checkout (Recommended for frictionless test & simulated pay) */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "1.15rem",
                  border: "1px solid",
                  borderColor: paymentMethod === "instant" ? "var(--text-primary)" : "var(--border-hairline)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  background: paymentMethod === "instant" ? "var(--bg-subtle)" : "var(--bg-surface)",
                  transition: "all var(--transition-fast)",
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="instant"
                  checked={paymentMethod === "instant"}
                  onChange={() => setPaymentMethod("instant")}
                  style={{ marginTop: "3px", accentColor: "var(--text-primary)" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                    Instant Express Settlement (Zero Friction)
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    Immediately confirm order and create tracking record without third-party redirection.
                  </div>
                </div>
              </label>

              {/* Option 2: Razorpay Gateway */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.85rem",
                  padding: "1.15rem",
                  border: "1px solid",
                  borderColor: paymentMethod === "razorpay" ? "var(--text-primary)" : "var(--border-hairline)",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  background: paymentMethod === "razorpay" ? "var(--bg-subtle)" : "var(--bg-surface)",
                  transition: "all var(--transition-fast)",
                }}
              >
                <input
                  type="radio"
                  name="paymentMode"
                  value="razorpay"
                  checked={paymentMethod === "razorpay"}
                  onChange={() => setPaymentMethod("razorpay")}
                  style={{ marginTop: "3px", accentColor: "var(--text-primary)" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)" }}>
                    Razorpay Secure Online Gateway
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                    Pay via UPI, Cards, NetBanking, and Digital Wallets with 256-bit SSL encryption.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation Button */}
        <aside style={{ background: "var(--bg-surface)", border: "1px solid var(--border-hairline)", borderRadius: "var(--radius-md)", padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.25rem", borderBottom: "1px solid var(--border-hairline)", paddingBottom: "0.85rem" }}>
            Order Manifest
          </h2>

          {/* Items breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "280px", overflowY: "auto", marginBottom: "1.5rem", paddingRight: "0.5rem" }}>
            {items.map((item) => (
              <div key={item._id} style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "var(--radius-xs)" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</div>
                  <div style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>
                  ₹{(item.price * item.qty).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border-hairline)", paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.86rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {coupon && (
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-earth)" }}>
                <span>Discount ({coupon.code})</span>
                <span style={{ fontWeight: 600 }}>−₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-secondary)" }}>Delivery Courier</span>
              <span style={{ fontWeight: 600, color: shippingFee === 0 ? "var(--accent-pine)" : "inherit" }}>
                {shippingFee === 0 ? "Complimentary" : `₹${shippingFee}`}
              </span>
            </div>

            <div style={{ borderTop: "1px solid var(--border-hairline)", margin: "0.5rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)" }}>
              <span>Total Payable</span>
              <span>₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: "1.75rem" }}
          >
            <IconLock size={16} />
            <span>{loading ? "Processing Payment…" : `Confirm & Pay ₹${finalTotal.toLocaleString("en-IN")}`}</span>
          </button>

          <p style={{ fontSize: "0.72rem", textAlign: "center", color: "var(--text-muted)", marginTop: "1rem" }}>
            Your transaction is encrypted with end-to-end security protocols.
          </p>
        </aside>
      </form>
    </div>
  );
}
