const { mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
const mongoUri = fs.readFileSync(envPath, "utf8")
  .split("\n")
  .find(l => l.startsWith("MONGODB_URI="))
  ?.trim()
  ?.replace("MONGODB_URI=", "");

async function run() {
  await mongoose.connect(mongoUri, { tls: true, tlsAllowInvalidCertificates: true, serverSelectionTimeoutMS: 10000 });
  console.log("Connected");

  const Product = mongoose.model("Product", new mongoose.Schema({ name: String, images: [String], category: String }));

  const names = ["Pixel 9 Pro", "Wall Art Canvas Set", "Desk Lamp LED", "Casual Leather Loafers", "Wireless Earbuds Mini"];
  const products = await Product.find({ name: { $in: names } }).lean();

  console.log("Products found:", products.length);
  products.forEach(p => {
    console.log(JSON.stringify({
      _id: p._id.toString(),
      name: p.name,
      category: p.category,
      hasImages: Array.isArray(p.images) && p.images.length > 0,
      imageUrl: p.images?.[0] || "NONE"
    }));
  });

  const total = await Product.countDocuments();
  const bad = await Product.countDocuments({
    $or: [{ "images.0": { $exists: false } }, { "images.0": null }, { "images.0": "" }]
  });
  console.log("Total products:", total);
  console.log("Products with no valid first image:", bad);

  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
