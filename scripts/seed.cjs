const { mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    currency: { type: String, default: "usd" },
    images: [String],
    category: String,
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const products = [
  {
    name: "Wireless Headphones Pro",
    description: "Premium noise-cancelling headphones with 30h battery life, Hi-Res audio, and memory foam ear cushions. Bluetooth 5.3 with multipoint connection.",
    price: 29999,
    currency: "usd",
    category: "electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"],
  },
  {
    name: "Bluetooth Speaker Boom",
    description: "Portable waterproof speaker with 360 sound, 20h battery, and built-in microphone. IP67 rated for outdoor adventures.",
    price: 12999,
    currency: "usd",
    category: "electronics",
    images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop"],
  },
  {
    name: "Mechanical Keyboard RGB",
    description: "Full-size mechanical keyboard with hot-swappable switches, per-key RGB, aluminum frame, and PBT keycaps.",
    price: 15999,
    currency: "usd",
    category: "electronics",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop"],
  },
  {
    name: "Smart Watch Ultra",
    description: "Advanced fitness tracker with heart rate monitor, GPS, SpO2 sensor, and 14-day battery life. Water resistant to 50m.",
    price: 39999,
    currency: "usd",
    category: "electronics",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"],
  },
  {
    name: "Running Sneakers Elite",
    description: "Lightweight performance sneakers with responsive cushioning, breathable mesh upper, and carbon rubber outsole.",
    price: 13999,
    currency: "usd",
    category: "shoes",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
  },
  {
    name: "Casual Leather Loafers",
    description: "Handcrafted Italian leather loafers with memory foam insole. Perfect for both office and casual wear.",
    price: 18999,
    currency: "usd",
    category: "shoes",
    images: ["https://images.unsplash.com/photo-1531310197839-ccf546a09c2e?w=600&h=600&fit=crop"],
  },
  {
    name: "Urban Backpack 40L",
    description: "Durable water-resistant backpack with padded laptop compartment, USB charging port, and ergonomic straps.",
    price: 7999,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
  },
  {
    name: "Leather Messenger Bag",
    description: "Handcrafted genuine leather messenger bag with multiple compartments and adjustable shoulder strap.",
    price: 18999,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop"],
  },
  {
    name: "Aviator Sunglasses",
    description: "Classic aviator sunglasses with polarized UV400 lenses and lightweight titanium frame.",
    price: 15999,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"],
  },
  {
    name: "Wireless Earbuds Mini",
    description: "Compact true wireless earbuds with active noise cancellation, IPX5, and 24h battery with charging case.",
    price: 9999,
    currency: "usd",
    category: "electronics",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop"],
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable LED desk lamp with 5 color modes, 7 brightness levels, USB charging, and memory function.",
    price: 4999,
    currency: "usd",
    category: "home",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop"],
  },
  {
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back.",
    price: 49999,
    currency: "usd",
    category: "home",
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop"],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  await Product.insertMany(products);

  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
}

seed().catch(console.error);
