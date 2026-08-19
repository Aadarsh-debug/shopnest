import React, { createContext, useEffect, useMemo, useState, useContext } from "react";
import { useToast } from "./ToastContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } catch (e) {
      console.warn("Could not persist cart", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem("shopnest_coupon", JSON.stringify(coupon));
    } catch (e) {
      console.warn("Could not persist coupon", e);
    }
  }, [coupon]);

  const addToCart = (product, quantity = 1) => {
    const addQty = Math.max(1, Number(quantity) || 1);
    setItems((current) => {
      const existingIndex = current.findIndex((item) => item._id === product._id);
      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + addQty,
        };
        return updated;
      }
      return [...current, { ...product, qty: addQty }];
    });

    addToast(`Added ${quantity > 1 ? `${quantity} × ` : ""}"${product.name}" to your cart`, "success", "Cart Updated");
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setItems((current) =>
      current.map((item) => (item._id === id ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (id) => {
    setItems((current) => {
      const target = current.find((i) => i._id === id);
      if (target) {
        addToast(`Removed "${target.name}" from cart`, "info");
      }
      return current.filter((item) => item._id !== id);
    });
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === "SHOPNEST20" || clean === "NEST20") {
      setCoupon({ code: clean, discountPercent: 20, description: "20% Exclusive Member Discount" });
      addToast("Coupon applied! 20% discount added to your order.", "success", "Coupon Active");
      return { success: true };
    }
    if (clean === "MINIMAL10" || clean === "WELCOME10") {
      setCoupon({ code: clean, discountPercent: 10, description: "10% Welcome Discount" });
      addToast("Welcome coupon applied! 10% discount added.", "success", "Coupon Active");
      return { success: true };
    }
    addToast("Invalid promotional code. Try 'NEST20' or 'MINIMAL10'", "error", "Invalid Code");
    return { success: false, message: "Invalid promotional code" };
  };

  const removeCoupon = () => {
    setCoupon(null);
    addToast("Promotional code removed", "info");
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1), 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    return Math.round((subtotal * coupon.discountPercent) / 100);
  }, [subtotal, coupon]);

  const freeShippingThreshold = 999;
  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const count = items.reduce((total, item) => total + (Number(item.qty) || 1), 0);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      discountAmount,
      shippingFee,
      freeShippingThreshold,
      finalTotal,
      coupon,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
    }),
    [items, count, subtotal, discountAmount, shippingFee, finalTotal, coupon]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
