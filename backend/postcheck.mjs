// End-to-end smoke test for every POST (and key GET) route of the ShopNest API.
// Run while the backend is up:  node backend/postcheck.mjs
// Optional env: BASE_URL (default http://localhost:5055), MONGO_URI (to promote a test admin)
import mongoose from "mongoose";

const BASE = process.env.BASE_URL || "http://localhost:5055";
const stamp = Date.now();
let failures = 0;

const check = (name, cond, extra = "") => {
  console.log(`${cond ? "PASS" : "FAIL"} - ${name}${extra ? ` :: ${extra}` : ""}`);
  if (!cond) failures++;
};

async function call(method, path, { body, token, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (form) {
    payload = form.body;
    headers["Content-Type"] = form.contentType;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, { method, headers, body: payload });
  let data = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

function multipart(fields, file) {
  const boundary = `----shopnest${stamp}`;
  const parts = [];
  for (const [key, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
    );
  }
  if (file) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${file.field}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`
    );
    const head = Buffer.from(parts.join(""), "utf8");
    const tail = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
    return {
      contentType: `multipart/form-data; boundary=${boundary}`,
      body: Buffer.concat([head, file.data, tail]),
    };
  }
  parts.push(`--${boundary}--\r\n`);
  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: Buffer.from(parts.join(""), "utf8"),
  };
}

async function main() {
  // 1. Server + SPA shell -------------------------------------------------
  const root = await call("GET", "/");
  check("GET / is up", root.status === 200 && String(root.data).includes("server running"), `status=${root.status}`);

  const spa = await call("GET", "/products");
  check("GET /products returns SPA html", spa.status === 200 && String(spa.data).includes("<div id=\"root\">"), `status=${spa.status}`);

  const missing = await call("GET", "/api/does-not-exist");
  check("unknown /api route returns JSON 404", missing.status === 404 && typeof missing.data === "object", `status=${missing.status}`);

  // 2. Auth POSTs ---------------------------------------------------------
  const reg = await call("POST", "/api/auth/register", {
    body: { name: "Render Tester", email: `render.tester${stamp}@example.com`, password: "secret123" },
  });
  check("POST /api/auth/register", reg.status === 201 && !!reg.data.token, `status=${reg.status} ${JSON.stringify(reg.data).slice(0, 120)}`);

  const dup = await call("POST", "/api/auth/register", {
    body: { name: "Render Tester", email: `render.tester${stamp}@example.com`, password: "secret123" },
  });
  check("duplicate register rejected with 400", dup.status === 400, `status=${dup.status}`);

  const badLogin = await call("POST", "/api/auth/login", {
    body: { email: `render.tester${stamp}@example.com`, password: "wrong" },
  });
  check("bad password rejected with 400", badLogin.status === 400, `status=${badLogin.status}`);

  const login = await call("POST", "/api/auth/login", {
    body: { email: `render.tester${stamp}@example.com`, password: "secret123" },
  });
  check("POST /api/auth/login", login.status === 200 && !!login.data.token, `status=${login.status}`);
  const token = login.data.token;

  const noAuth = await call("GET", "/api/orders/myorders");
  check("protected route rejects missing token with 401", noAuth.status === 401, `status=${noAuth.status}`);

  // 3. Product POSTs (JSON + multipart upload) ----------------------------
  let adminToken = token;
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    const User = mongoose.connection.collection("users");
    await User.updateOne(
      { email: `render.tester${stamp}@example.com` },
      { $set: { role: "admin", verified: true } }
    );
    const relogin = await call("POST", "/api/auth/login", {
      body: { email: `render.tester${stamp}@example.com`, password: "secret123" },
    });
    if (relogin.status === 200 && relogin.data.token) adminToken = relogin.data.token;
    else check("admin re-login", false, `status=${relogin.status}`);
  }

  const product = await call("POST", "/api/products", {
    token: adminToken,
    body: {
      name: `Render Check Product ${stamp}`,
      description: "Created by postcheck smoke test",
      price: 999,
      category: "Electronics",
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
    },
  });
  check("POST /api/products (JSON)", product.status === 201 && product.data._id, `status=${product.status} ${JSON.stringify(product.data).slice(0, 160)}`);

  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const upload = await call("POST", "/api/products", {
    token: adminToken,
    form: multipart(
      { name: `Render Upload Product ${stamp}`, description: "multipart", price: "499", category: "Electronics", stock: "3" },
      { field: "image", filename: "pixel.png", contentType: "image/png", data: tinyPng }
    ),
  });
  check("POST /api/products (multipart image)", upload.status === 201 && upload.data._id, `status=${upload.status} ${JSON.stringify(upload.data).slice(0, 160)}`);

  const list = await call("GET", "/api/products");
  check(
    "GET /api/products returns created product",
    list.status === 200 && Array.isArray(list.data) && list.data.some((p) => p.name === `Render Check Product ${stamp}`),
    `status=${list.status} count=${Array.isArray(list.data) ? list.data.length : "n/a"}`
  );

  // 4. Order POST ---------------------------------------------------------
  const orderId = product.data._id || "";
  const order = await call("POST", "/api/orders", {
    token,
    body: {
      items: [{ productId: orderId, qty: 1, price: 999 }],
      totalAmount: 999,
      address: { fullName: "Render Tester", street: "1 Test Lane", city: "Bengaluru", postalCode: "560001", country: "India" },
    },
  });
  check("POST /api/orders", order.status === 201 && order.data._id, `status=${order.status} ${JSON.stringify(order.data).slice(0, 160)}`);

  const myOrders = await call("GET", "/api/orders/myorders", { token });
  check("GET /api/orders/myorders", myOrders.status === 200 && Array.isArray(myOrders.data), `status=${myOrders.status}`);

  // 5. Payment POST (no Razorpay keys locally -> clean JSON error) --------
  const pay = await call("POST", "/api/payments/order", {
    token,
    body: {
      items: [{ productId: orderId, qty: 1 }],
      address: { fullName: "Render Tester", street: "1 Test Lane", city: "Bengaluru", postalCode: "560001", country: "India" },
    },
  });
  const razorpayReady = pay.status === 201 && !!pay.data.paymentOrderId;
  const razorpayMissingKeys = pay.status === 503 && /razorpay/i.test(String(pay.data?.message || ""));
  check(
    "POST /api/payments/order (201 when Razorpay keys set, clean 503 when not)",
    razorpayReady || razorpayMissingKeys,
    `status=${pay.status} ${JSON.stringify(pay.data).slice(0, 160)}`
  );

  if (process.env.MONGO_URI) await mongoose.disconnect();
  console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("postcheck crashed:", err);
  process.exit(1);
});
