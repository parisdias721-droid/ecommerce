const { mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    currency: { type: String, default: "usd" },
    images: [String],
    category: String,
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const products = [
  // ===== ELECTRONICS (5) =====
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

  // ===== FURNITURE (5) =====
  {
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back. Supports up to 300 lbs.",
    price: 49999,
    currency: "usd",
    category: "furniture",
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop"],
  },
  {
    name: "Minimalist Desk",
    description: "Modern wooden desk with clean lines, cable management, and a spacious 60x30 inch work surface.",
    price: 34999,
    currency: "usd",
    category: "furniture",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=600&fit=crop"],
  },
  {
    name: "Bookshelf 5-Tier",
    description: "Sturdy industrial-style bookshelf with 5 spacious shelves. Each shelf holds up to 50 lbs. Perfect for home office.",
    price: 18999,
    currency: "usd",
    category: "furniture",
    images: ["https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=600&fit=crop"],
  },
  {
    name: "Night Stand with Drawer",
    description: "Compact nightstand with one smooth-glide drawer and open shelf. Solid pine wood construction with matte finish.",
    price: 12999,
    currency: "usd",
    category: "furniture",
    images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop"],
  },
  {
    name: "TV Stand Media Console",
    description: "Low-profile TV stand for screens up to 65 inches. Two drawers, two open shelves, and cable management ports.",
    price: 27999,
    currency: "usd",
    category: "furniture",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"],
  },
  // ===== FASHION (5) =====
  {
    name: "Running Sneakers Elite",
    description: "Lightweight performance sneakers with responsive cushioning, breathable mesh upper, and carbon rubber outsole.",
    price: 13999,
    currency: "usd",
    category: "fashion",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"],
  },

  {
    name: "Denim Jacket Classic",
    description: "Timeless denim jacket with a modern slim fit. 100% cotton with brass hardware and button-front closure.",
    price: 8999,
    currency: "usd",
    category: "fashion",
    images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop"],
  },
  {
    name: "Wool Blend Overcoat",
    description: "Elegant long overcoat in charcoal grey. Made from a premium wool blend with satin lining and notch lapels.",
    price: 24999,
    currency: "usd",
    category: "fashion",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"],
  },
  {
    name: "Cotton T-Shirt Pack",
    description: "Pack of 3 premium cotton t-shirts in neutral colors. Pre-shrunk fabric with reinforced neckline and double stitching.",
    price: 3999,
    currency: "usd",
    category: "fashion",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"],
  },
  // ===== ACCESSORIES (5) =====
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
    description: "Classic aviator sunglasses with polarized UV400 lenses and lightweight titanium frame. Includes hard case.",
    price: 15999,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop"],
  },
  {
    name: "Minimalist Wallet",
    description: "Slim RFID-blocking wallet with 6 card slots and a bill compartment. Made from premium Horween leather.",
    price: 4999,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
  },
  {
    name: "Smart Watch Band",
    description: "Interchangeable silicone watch band compatible with most smart watches. Soft, sweat-resistant, and available in 5 colors.",
    price: 2499,
    currency: "usd",
    category: "accessories",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop"],
  },
  // ===== HOME (5) =====

  {
    name: "Scented Candle Set",
    description: "Set of 3 hand-poured soy wax candles in premium glass jars. Scents: vanilla, lavender, and eucalyptus.",
    price: 3499,
    currency: "usd",
    category: "home",
    images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop"],
  },
  {
    name: "Throw Blanket Premium",
    description: "Ultra-soft microfiber throw blanket. Perfect for cozy evenings on the couch. Machine washable and fade resistant.",
    price: 3999,
    currency: "usd",
    category: "home",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop"],
  },

  {
    name: "Plant Pot Ceramic",
    description: "Minimalist ceramic plant pot with drainage hole and bamboo stand. Perfect for indoor plants and succulents.",
    price: 2499,
    currency: "usd",
    category: "home",
    images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop"],
  },
  // ===== SPORTS (5) =====
  {
    name: "Yoga Mat Premium",
    description: "Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material with carrying strap included.",
    price: 3999,
    currency: "usd",
    category: "sports",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop"],
  },
  {
    name: "Adjustable Dumbbells",
    description: "Space-saving adjustable dumbbells from 5 to 52.5 lbs each. Quick-change weight dial with secure locking mechanism.",
    price: 34999,
    currency: "usd",
    category: "sports",
    images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop"],
  },
  {
    name: "Resistance Bands Set",
    description: "Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and ankle straps.",
    price: 2499,
    currency: "usd",
    category: "sports",
    images: ["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop"],
  },
  {
    name: "Water Bottle Stainless",
    description: "Double-wall insulated water bottle. Keeps drinks cold 24h or hot 12h. BPA-free with leak-proof lid.",
    price: 2999,
    currency: "usd",
    category: "sports",
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop"],
  },
  {
    name: "Jump Rope Speed",
    description: "Professional speed jump rope with ball bearings. Adjustable cable length with comfortable foam handles.",
    price: 1499,
    currency: "usd",
    category: "sports",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"],
  },
  // ===== BEAUTY (5) =====
  {
    name: "Face Moisturizer",
    description: "Lightweight daily face moisturizer with hyaluronic acid and vitamin C. Suitable for all skin types. SPF 30.",
    price: 2499,
    currency: "usd",
    category: "beauty",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop"],
  },
  {
    name: "Hair Dryer Professional",
    description: "Ionic hair dryer with 3 heat settings and 2 speed settings. Includes concentrator and diffuser attachments.",
    price: 5999,
    currency: "usd",
    category: "beauty",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop"],
  },
  {
    name: "Perfume Eau de Parfum",
    description: "Long-lasting floral fragrance with notes of jasmine, rose, and vanilla. 50ml bottle in elegant glass packaging.",
    price: 7999,
    currency: "usd",
    category: "beauty",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop"],
  },
  {
    name: "Makeup Brush Set",
    description: "Complete set of 12 premium makeup brushes with synthetic bristles. Includes carrying case and brush cleaning pad.",
    price: 3499,
    currency: "usd",
    category: "beauty",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop"],
  },
  {
    name: "Nail Polish Collection",
    description: "Set of 6 long-lasting gel nail polishes in trendy colors. UV/LED cured. Each bottle 15ml with precision brush.",
    price: 1999,
    currency: "usd",
    category: "beauty",
    images: ["https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop"],
  },
  // ===== BOOKS (5) =====
  {
    name: "The Art of Coding",
    description: "A comprehensive guide to writing clean, maintainable code. Covers design patterns, testing, and architecture best practices.",
    price: 3999,
    currency: "usd",
    category: "books",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
  },
  {
    name: "Financial Freedom",
    description: "Practical guide to personal finance, investing, and building wealth. Learn budgeting, saving, and passive income strategies.",
    price: 2499,
    currency: "usd",
    category: "books",
    images: ["https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=600&fit=crop"],
  },
  {
    name: "World Atlas 2025",
    description: "Comprehensive hardcover world atlas with detailed maps, population data, and geographical information for every country.",
    price: 4499,
    currency: "usd",
    category: "books",
    images: ["https://images.unsplash.com/photo-1587876931567-564ce588bfbd?w=600&h=600&fit=crop"],
  },
  {
    name: "Cookbook: Global Flavors",
    description: "Explore 200+ recipes from 30 countries. Beautifully photographed with step-by-step instructions and cultural notes.",
    price: 2999,
    currency: "usd",
    category: "books",
    images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=600&fit=crop"],
  },
  {
    name: "Mindfulness Journal",
    description: "Guided journal with daily prompts, gratitude exercises, and meditation tracking. 365 days of mindfulness practice.",
    price: 1999,
    currency: "usd",
    category: "books",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop"],
  },
  // ===== COMPUTERS (5) =====
  {
    name: "Ultrabook Pro 15",
    description: "Thin and light laptop with Intel Core i7, 16GB RAM, 512GB SSD, and 15.6-inch 4K OLED display. Aluminum unibody design.",
    price: 129999,
    currency: "usd",
    category: "computers",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop"],
  },
  {
    name: "Gaming Laptop Xtreme",
    description: "High-performance gaming laptop with RTX 4070, AMD Ryzen 9, 32GB RAM, 1TB NVMe, and 165Hz QHD display.",
    price: 189999,
    currency: "usd",
    category: "computers",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop"],
  },
  {
    name: "All-in-One Desktop",
    description: "Sleek 27-inch all-in-one PC with Intel Core i5, 8GB RAM, 256GB SSD, and full HD IPS touchscreen.",
    price: 89999,
    currency: "usd",
    category: "computers",
    images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop"],
  },
  {
    name: "Tablet Pro 12.9",
    description: "Powerful tablet with 12.9-inch Liquid Retina XDR display, M3 chip, 256GB storage, and Apple Pencil support.",
    price: 109999,
    currency: "usd",
    category: "computers",
    images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop"],
  },
  {
    name: "External SSD 1TB",
    description: "Portable solid-state drive with 1TB capacity, USB-C, read speeds up to 1050MB/s, and rugged water-resistant casing.",
    price: 11999,
    currency: "usd",
    category: "computers",
    images: ["https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop"],
  },
  // ===== CELLPHONES (5) =====
  {
    name: "Phone X Pro Max",
    description: "6.9-inch OLED display, A18 chip, 48MP triple camera, 256GB storage, and all-day battery with fast wireless charging.",
    price: 119999,
    currency: "usd",
    category: "cellphones",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop"],
  },
  {
    name: "Galaxy S Ultra",
    description: "6.8-inch Dynamic AMOLED, Snapdragon 8 Gen 3, 200MP camera, S Pen support, and 5000mAh battery.",
    price: 129999,
    currency: "usd",
    category: "cellphones",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop"],
  },

  {
    name: "Foldable Phone Z",
    description: "Innovative foldable phone with 7.6-inch inner display, 6.2-inch cover screen, 12GB RAM, and dual 12MP cameras.",
    price: 179999,
    currency: "usd",
    category: "cellphones",
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop"],
  },
  {
    name: "Moto G Power 5G",
    description: "Affordable 5G phone with 50MP camera, 5000mAh battery lasting 3 days, 6.5-inch 120Hz display, and 128GB storage.",
    price: 29999,
    currency: "usd",
    category: "cellphones",
    images: ["https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=600&h=600&fit=crop"],
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

  const productsWithStock = products.map((p, i) => ({
    ...p,
    stock: [25, 10, 50, 15, 8, 20, 12, 45, 35, 18, 60, 5, 22, 7, 55, 28, 42, 14, 48, 9, 38, 3, 65, 21, 11, 19, 27, 6, 52, 17, 31, 13, 44, 4, 58, 36, 10, 5, 7, 3, 15, 20, 8, 6, 18][i] || 25,
  }));
  await Product.insertMany(productsWithStock);

  const categories = [...new Set(products.map((p) => p.category))];
  console.log(`Seeded ${products.length} products across ${categories.length} categories:`);
  categories.forEach((cat) => {
    const count = products.filter((p) => p.category === cat).length;
    console.log(`  - ${cat}: ${count} products`);
  });
  await mongoose.disconnect();
}

seed().catch(console.error);
