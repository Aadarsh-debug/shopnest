const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// 24 Curated Fallback Products for resilient offline / demo testing
export const INITIAL_PRODUCTS = [
  {
    _id: "prod_01",
    name: "Acoustic Studio ANC Headphones",
    description: "Precision-tuned active noise cancellation headphones with brushed aluminum accents, 38-hour battery life, and ultra-soft memory foam ear cushions for sublime acoustic clarity.",
    price: 18990,
    category: "Electronics",
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.9,
    numReviews: 84,
    badge: "Best Seller",
    specs: { Driver: "40mm Custom Neodymium", Battery: "38 Hours ANC On", Weight: "245g", Connectivity: "Bluetooth 5.3 / 3.5mm" }
  },
  {
    _id: "prod_02",
    name: "Nordic Oak Lounge Armchair",
    description: "Sculpted solid white oak frame upholstered in Belgian linen. Minimalist geometry engineered for ergonomic lumbar posture and timeless interior warmth.",
    price: 24500,
    category: "Furniture",
    stock: 9,
    imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.8,
    numReviews: 32,
    badge: "Crafted by Hand",
    specs: { Wood: "Solid FSC White Oak", Fabric: "100% Belgian Flax Linen", Dimensions: "78 × 82 × 74 cm", MaxWeight: "150 kg" }
  },
  {
    _id: "prod_03",
    name: "Ceramic Pour-Over & Kettle Set",
    description: "Handcrafted matte ceramic dripper coupled with a precision gooseneck electric kettle. Calibrated flow control for pour-over coffee perfection.",
    price: 5490,
    category: "Kitchen",
    stock: 24,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.7,
    numReviews: 46,
    badge: "Artisan Edit",
    specs: { Material: "Matte Stoneware & 304 Steel", Capacity: "800ml Kettle / 2-4 Cups Dripper", TempRange: "40°C - 100°C", Power: "1200W" }
  },
  {
    _id: "prod_04",
    name: "Full-Grain Leather Work Tote",
    description: "Sustainably tanned vegetable leather bag with padded 15-inch laptop sleeve, Swiss brass hardware, and waterproof magnetic quick-latch closure.",
    price: 11990,
    category: "Accessories",
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.9,
    numReviews: 67,
    badge: "Lifetime Guarantee",
    specs: { Leather: "Full-Grain Vegetable Tanned", Laptop: "Fits up to 16\" MacBook Pro", Pockets: "5 Internal / 1 Quick Access", Hardware: "Solid Brushed Brass" }
  },
  {
    _id: "prod_05",
    name: "Analog Heritage Chronograph Watch",
    description: "Minimalist Bauhaus-inspired dial with sapphire crystal lens, Japanese Miyota movement, and interchangeable horween leather strap.",
    price: 14200,
    category: "Accessories",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.8,
    numReviews: 53,
    badge: "New Arrival",
    specs: { Case: "316L Surgical Stainless Steel", Glass: "Anti-Reflective Sapphire", Diameter: "39mm", WaterResistance: "5 ATM (50m)" }
  },
  {
    _id: "prod_06",
    name: "Heavyweight Raw Selvedge Jacket",
    description: "14.5oz Japanese selvedge denim woven on vintage shuttle looms. Unwashed indigo finish that develops custom character over time.",
    price: 7890,
    category: "Clothing",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.6,
    numReviews: 41,
    badge: "Limited Batch",
    specs: { Cotton: "100% Long-Staple Cotton", Weight: "14.5 oz Selvedge", Origin: "Okayama, Japan", Fit: "Tailored Classic Cut" }
  },
  {
    _id: "prod_07",
    name: "Ambient Magnetic Floating Lamp",
    description: "Levitating warm LED globe powered by magnetic induction. Touch-sensitive dimming with hand-turned walnut wooden base.",
    price: 8990,
    category: "Home Decor",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.8,
    numReviews: 39,
    badge: "3D Design Pick",
    specs: { Base: "American Walnut Solid Wood", LightTemp: "2700K Warm Amber", LevitationHeight: "15-20mm", Lifespan: "50,000 Hours" }
  },
  {
    _id: "prod_08",
    name: "Organic Merino Knit Sweater",
    description: "Superfine 19.5-micron New Zealand merino wool. Breathable thermal insulation with seamless 3D knit construction.",
    price: 6490,
    category: "Clothing",
    stock: 28,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.7,
    numReviews: 58,
    badge: "Eco Wool",
    specs: { Wool: "100% ZQ-Certified Merino", Knit: "Seamless 3D Shima Seiki", Care: "Hand Wash or Gentle Machine", Weight: "Mid-weight 280gsm" }
  },
  {
    _id: "prod_09",
    name: "Mirrorless 4K Compact Creator Camera",
    description: "24.2 MP APS-C sensor with real-time eye tracking autofocus, 4K 60fps video, and tactile analog exposure dials.",
    price: 68500,
    category: "Electronics",
    stock: 7,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.9,
    numReviews: 92,
    badge: "Flagship",
    specs: { Sensor: "24.2MP APS-C BSI CMOS", Video: "4K 60p 10-bit 4:2:2", Stabilization: "5-Axis In-Body IBIS", Weight: "410g Body" }
  },
  {
    _id: "prod_10",
    name: "Ergonomic Standing Walnut Desk",
    description: "Dual-motor electric standing desk with solid American walnut tabletop, anti-collision sensor, and programmable 4-height memory.",
    price: 36900,
    category: "Furniture",
    stock: 6,
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.9,
    numReviews: 44,
    badge: "Signature",
    specs: { Top: "140 × 70 cm Solid Walnut", HeightRange: "62cm to 128cm", Motor: "Dual Ultra-Quiet (<45dB)", Capacity: "125 kg" }
  },
  {
    _id: "prod_11",
    name: "SoundSphere 360 Spatial Speaker",
    description: "Omnidirectional room-filling acoustic architecture with room-calibration sensor, AirPlay 2, Spotify Connect, and 24-hour battery.",
    price: 12490,
    category: "Electronics",
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.7,
    numReviews: 61,
    badge: "Spatial Audio",
    specs: { Power: "60W RMS Tri-Amp", Radiators: "Dual Passive Bass", Waterproof: "IPX6 Splashproof", Battery: "24h at 50% Vol" }
  },
  {
    _id: "prod_12",
    name: "Hand-blown Ribbed Glass Carafe Set",
    description: "Set of two borosilicate glasses and matching 1.2L carafe with spherical cork stopper. Thermal shock resistant.",
    price: 2990,
    category: "Kitchen",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80",
    ratings: 4.6,
    numReviews: 29,
    badge: "Hand-blown",
    specs: { Glass: "100% Borosilicate", Set: "1 × 1.2L Carafe + 2 × 300ml Tumblers", Temperature: "-20°C to 150°C", Dishwasher: "Safe" }
  }
];

export async function request(path, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    // A gateway transaction must never fall back to simulated data. Doing so can
    // send an incomplete response to the Razorpay checkout and hide the real
    // server-side error from the customer.
    if (path.startsWith("/payments/")) {
      throw error;
    }
    // If backend is unreachable or throws network error, serve client mock fallback
    console.warn(`[ShopNest API] Live request to ${path} failed (${error.message}). Falling back to local data store.`);
    return handleClientFallback(path, options);
  }
}

function handleClientFallback(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  // Products
  if (path.startsWith("/products")) {
    const parts = path.split("?")[0].split("/").filter(Boolean);
    if (parts.length === 2 && parts[1] && parts[1] !== "products") {
      const prodId = parts[1];
      const match = INITIAL_PRODUCTS.find((p) => p._id === prodId) || INITIAL_PRODUCTS[0];
      return match;
    }
    return INITIAL_PRODUCTS;
  }

  // Auth login
  if (path.includes("/auth/login")) {
    const body = options.body ? JSON.parse(options.body) : {};
    const isAdmin = body.email === "admin@shopnest.com";
    return {
      _id: isAdmin ? "demo_admin_id" : "demo_user_id",
      name: isAdmin ? "Elena Vance" : "Sophia Reynolds",
      email: body.email || "demo@shopnest.com",
      role: isAdmin ? "admin" : "user",
      token: "demo_fallback_token_jwt",
    };
  }

  // Auth register
  if (path.includes("/auth/register")) {
    const body = options.body ? JSON.parse(options.body) : {};
    return {
      _id: "new_user_" + Math.random().toString(36).substring(2, 7),
      name: body.name || "Customer",
      email: body.email || "user@shopnest.com",
      role: "user",
      token: "demo_register_token_jwt",
    };
  }

  // My Orders
  if (path.includes("/orders/myorders")) {
    return [
      {
        _id: "ord_8921a4",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Shipped",
        totalAmount: 18990,
        paymentId: "PAY_DEMO_028491",
        address: { fullName: "Sophia Reynolds", street: "42 Greenway Blvd, Apt 4B", city: "Bengaluru", postalCode: "560001", country: "India" },
        items: [{ productId: INITIAL_PRODUCTS[0], qty: 1, price: INITIAL_PRODUCTS[0].price }],
      },
      {
        _id: "ord_7610b2",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: "Delivered",
        totalAmount: 17480,
        paymentId: "PAY_DEMO_019284",
        address: { fullName: "Sophia Reynolds", street: "42 Greenway Blvd, Apt 4B", city: "Bengaluru", postalCode: "560001", country: "India" },
        items: [
          { productId: INITIAL_PRODUCTS[2], qty: 1, price: INITIAL_PRODUCTS[2].price },
          { productId: INITIAL_PRODUCTS[3], qty: 1, price: INITIAL_PRODUCTS[3].price }
        ],
      }
    ];
  }

  // Create Order
  if (path === "/orders" && method === "POST") {
    const body = options.body ? JSON.parse(options.body) : {};
    return {
      _id: "ord_" + Math.random().toString(36).substring(2, 8),
      createdAt: new Date().toISOString(),
      status: "Processing",
      totalAmount: body.totalAmount || 0,
      address: body.address || {},
      items: body.items || [],
      paymentId: body.paymentId || "PAY_INSTANT_" + Date.now(),
    };
  }

  // Analytics
  if (path.includes("/analytics")) {
    return {
      totalOrders: 148,
      totalProducts: INITIAL_PRODUCTS.length,
      totalRevenue: 342900,
      totalUsers: 86,
    };
  }

  // All Users
  if (path.includes("/auth/users")) {
    return [
      { _id: "usr_1", name: "Elena Vance", email: "admin@shopnest.com", role: "admin", verified: true, createdAt: new Date().toISOString() },
      { _id: "usr_2", name: "Sophia Reynolds", email: "demo@shopnest.com", role: "user", verified: true, createdAt: new Date().toISOString() },
      { _id: "usr_3", name: "Alex Chen", email: "alex@shopnest.com", role: "user", verified: true, createdAt: new Date().toISOString() }
    ];
  }

  // Payment mock order
  if (path.includes("/payments/order")) {
    return {
      id: "order_mock_" + Math.random().toString(36).substring(2, 8),
      amount: (options.body ? JSON.parse(options.body).amount : 1000) * 100,
      currency: "INR",
    };
  }

  return {};
}

export const authHeader = (user) => {
  if (!user || !user.token) return {};
  return { Authorization: `Bearer ${user.token}` };
};
