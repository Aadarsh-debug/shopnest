import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Product from './models/Products.js';
import Order from './models/Order.js';

dotenv.config();

await connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create 3 demo users
    const adminUser = await User.create({
      name: 'Elena Vance',
      email: 'admin@shopnest.com',
      password: hashedPassword,
      role: 'admin',
      verified: true,
    });

    const demoUser = await User.create({
      name: 'Sophia Reynolds',
      email: 'demo@shopnest.com',
      password: hashedPassword,
      role: 'user',
      verified: true,
    });

    const alexUser = await User.create({
      name: 'Alex Chen',
      email: 'alex@shopnest.com',
      password: hashedPassword,
      role: 'user',
      verified: true,
    });

    // 24 Curated High-End Minimalist Products
    const productsData = [
      {
        name: 'Acoustic Studio ANC Headphones',
        description: 'Precision-tuned active noise cancellation headphones with brushed aluminum accents, 38-hour battery life, and ultra-soft memory foam ear cushions for sublime acoustic clarity.',
        price: 18990,
        category: 'Electronics',
        stock: 18,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 84,
      },
      {
        name: 'Nordic Oak Lounge Armchair',
        description: 'Sculpted solid white oak frame upholstered in Belgian linen. Minimalist geometry engineered for ergonomic lumbar posture and timeless interior warmth.',
        price: 24500,
        category: 'Furniture',
        stock: 9,
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 32,
      },
      {
        name: 'Ceramic Pour-Over & Kettle Set',
        description: 'Handcrafted matte ceramic dripper coupled with a precision gooseneck electric kettle. Calibrated flow control for pour-over coffee perfection.',
        price: 5490,
        category: 'Kitchen',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 46,
      },
      {
        name: 'Full-Grain Leather Work Tote',
        description: 'Sustainably tanned vegetable leather bag with padded 15-inch laptop sleeve, Swiss brass hardware, and waterproof magnetic quick-latch closure.',
        price: 11990,
        category: 'Accessories',
        stock: 14,
        imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 67,
      },
      {
        name: 'Analog Heritage Chronograph Watch',
        description: 'Minimalist Bauhaus-inspired dial with sapphire crystal lens, Japanese Miyota movement, and interchangeable horween leather strap.',
        price: 14200,
        category: 'Accessories',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 53,
      },
      {
        name: 'Heavyweight Raw Selvedge Jacket',
        description: '14.5oz Japanese selvedge denim woven on vintage shuttle looms. Unwashed indigo finish that develops custom character over time.',
        price: 7890,
        category: 'Clothing',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.6,
        numReviews: 41,
      },
      {
        name: 'Ambient Magnetic Floating Lamp',
        description: 'Levitating warm LED globe powered by magnetic induction. Touch-sensitive dimming with hand-turned walnut wooden base.',
        price: 8990,
        category: 'Home Decor',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 39,
      },
      {
        name: 'Organic Merino Knit Sweater',
        description: 'Superfine 19.5-micron New Zealand merino wool. Breathable thermal insulation with seamless 3D knit construction.',
        price: 6490,
        category: 'Clothing',
        stock: 28,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 58,
      },
      {
        name: 'Mirrorless 4K Compact Creator Camera',
        description: '24.2 MP APS-C sensor with real-time eye tracking autofocus, 4K 60fps video, and tactile analog exposure dials.',
        price: 68500,
        category: 'Electronics',
        stock: 7,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 92,
      },
      {
        name: 'Ergonomic Standing Walnut Desk',
        description: 'Dual-motor electric standing desk with solid American walnut tabletop, anti-collision sensor, and programmable 4-height memory.',
        price: 36900,
        category: 'Furniture',
        stock: 6,
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 44,
      },
      {
        name: 'SoundSphere 360 Spatial Speaker',
        description: 'Omnidirectional room-filling acoustic architecture with room-calibration sensor, AirPlay 2, Spotify Connect, and 24-hour battery.',
        price: 12490,
        category: 'Electronics',
        stock: 22,
        imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 61,
      },
      {
        name: 'Hand-blown Ribbed Glass Carafe Set',
        description: 'Set of two borosilicate glasses and matching 1.2L carafe with spherical cork stopper. Thermal shock resistant.',
        price: 2990,
        category: 'Kitchen',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.6,
        numReviews: 29,
      },
      {
        name: 'Natural Cork High-Grip Yoga Mat',
        description: '6mm eco-friendly natural Portuguese cork surface fused with non-slip natural tree rubber base. Naturally antimicrobial and grippy.',
        price: 3490,
        category: 'Fitness',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 73,
      },
      {
        name: 'Minimalist Low-Top Leather Sneakers',
        description: 'Italian nappa leather upper paired with durable Margom rubber sole and recycled waxed cotton laces.',
        price: 8490,
        category: 'Clothing',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 110,
      },
      {
        name: 'Titanium Thermal Travel Flask',
        description: 'Ultralight grade-1 titanium double-wall vacuum insulated canteen. Imparts zero metallic taste and keeps cold for 36 hours.',
        price: 4290,
        category: 'Accessories',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 52,
      },
      {
        name: 'Sculptural Ceramic Pedestal Table',
        description: 'Matte terracotta ceramic accent table with gentle hourglass fluting. Weatherproof for indoor lounge or covered terrace.',
        price: 16800,
        category: 'Furniture',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.5,
        numReviews: 18,
      },
      {
        name: 'Smart Health & Sleep Tracker Ring',
        description: 'Ultra-durable titanium smart ring tracking HRV, sleep stages, body temperature, and recovery metrics with 7-day battery.',
        price: 19990,
        category: 'Electronics',
        stock: 16,
        imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.6,
        numReviews: 38,
      },
      {
        name: 'Japanese Cast Iron Teapot Set',
        description: 'Traditional Nanbu Tekki hand-cast iron teapot with enamel interior, stainless steel infuser, and two matching cups.',
        price: 4890,
        category: 'Kitchen',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 64,
      },
      {
        name: 'Polarized Titanium Frame Sunglasses',
        description: 'Ultralight Japanese titanium wireframe with scratch-resistant polarized CR-39 gradient lenses and 100% UV400 shield.',
        price: 6200,
        category: 'Accessories',
        stock: 35,
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 43,
      },
      {
        name: 'Cast Iron Dutch Oven 5.5L',
        description: 'Heavy gauge enameled cast iron Dutch oven with brass knob lid. Exceptional heat retention for artisan breads and slow braises.',
        price: 7490,
        category: 'Kitchen',
        stock: 19,
        imageUrl: 'https://images.unsplash.com/photo-1585515656973-7d30b5f52d0e?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 59,
      },
      {
        name: 'Linen Weighted Relaxation Blanket',
        description: '7kg weighted blanket filled with micro glass beads and wrapped in breathable washed French flax linen cover.',
        price: 6990,
        category: 'Home Decor',
        stock: 20,
        imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.7,
        numReviews: 35,
      },
      {
        name: 'Precision Mechanical Keyboard 75%',
        description: 'CNC anodized aluminum case with hot-swappable tactile switches, gasket mount acoustic foam, and PBT dye-sub keycaps.',
        price: 10990,
        category: 'Electronics',
        stock: 24,
        imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.9,
        numReviews: 76,
      },
      {
        name: 'Handmade Stoneware Planter Set',
        description: 'Set of three textured ceramic pots with drainage holes and saucers. Organic earthy glazes in sand, charcoal, and terracotta.',
        price: 3200,
        category: 'Home Decor',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.5,
        numReviews: 22,
      },
      {
        name: 'Adjustable Quick-Select Dumbbell Set',
        description: 'Compact dumbbell pair with rapid dial weight selection from 2.5kg to 24kg per hand. Knurled steel grip and rubberized plates.',
        price: 18500,
        category: 'Fitness',
        stock: 11,
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1000&q=80',
        ratings: 4.8,
        numReviews: 49,
      }
    ];

    const insertedProducts = await Product.insertMany(productsData);

    // Create 3 realistic sample orders for Demo Customer
    await Order.create([
      {
        user: demoUser._id,
        items: [
          { productId: insertedProducts[0]._id, qty: 1, price: insertedProducts[0].price },
          { productId: insertedProducts[3]._id, qty: 1, price: insertedProducts[3].price }
        ],
        totalAmount: insertedProducts[0].price + insertedProducts[3].price,
        address: {
          fullName: 'Sophia Reynolds',
          street: '42 Greenway Boulevard, Apt 4B',
          city: 'Bengaluru',
          postalCode: '560001',
          country: 'India'
        },
        paymentId: 'PAY_DEMO_019284',
        status: 'Delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        user: demoUser._id,
        items: [
          { productId: insertedProducts[2]._id, qty: 1, price: insertedProducts[2].price },
          { productId: insertedProducts[11]._id, qty: 2, price: insertedProducts[11].price }
        ],
        totalAmount: insertedProducts[2].price + (insertedProducts[11].price * 2),
        address: {
          fullName: 'Sophia Reynolds',
          street: '42 Greenway Boulevard, Apt 4B',
          city: 'Bengaluru',
          postalCode: '560001',
          country: 'India'
        },
        paymentId: 'PAY_DEMO_028491',
        status: 'Shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        user: demoUser._id,
        items: [
          { productId: insertedProducts[7]._id, qty: 1, price: insertedProducts[7].price }
        ],
        totalAmount: insertedProducts[7].price,
        address: {
          fullName: 'Sophia Reynolds',
          street: '42 Greenway Boulevard, Apt 4B',
          city: 'Bengaluru',
          postalCode: '560001',
          country: 'India'
        },
        paymentId: 'PAY_DEMO_039102',
        status: 'Processing',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        user: alexUser._id,
        items: [
          { productId: insertedProducts[1]._id, qty: 1, price: insertedProducts[1].price },
          { productId: insertedProducts[6]._id, qty: 1, price: insertedProducts[6].price }
        ],
        totalAmount: insertedProducts[1].price + insertedProducts[6].price,
        address: {
          fullName: 'Alex Chen',
          street: '18 Lotus Court, Bandra West',
          city: 'Mumbai',
          postalCode: '400050',
          country: 'India'
        },
        paymentId: 'PAY_DEMO_041920',
        status: 'Delivered',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('✅ ShopNest Database Seeded Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin Account:     admin@shopnest.com  / password123');
    console.log('👤 Demo Customer:     demo@shopnest.com   / password123');
    console.log('👤 Secondary User:    alex@shopnest.com   / password123');
    console.log(`📦 Seeded Products:    ${insertedProducts.length} items`);
    console.log('🛍️ Seeded Orders:      4 sample customer orders');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    process.exit(1);
  }
};

importData();