import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await connectDB();
  const [products, categories] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).lean(),
    Product.distinct("category"),
  ]);

  const productsData: ProductData[] = JSON.parse(JSON.stringify(products));
  const { category: activeCategory } = await searchParams;

  const filtered = activeCategory
    ? productsData.filter((p) => p.category === activeCategory)
    : productsData;

  return (
    <>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premium Products, Best Prices
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover our curated collection. Fast shipping, secure payments,
            and exceptional customer service.
          </p>
          <Link
            href="#products"
            className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/?category=${cat}`}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {activeCategory ? (
            <span className="capitalize">{activeCategory}</span>
          ) : (
            "Featured Products"
          )}
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-500">
            No products in this category.{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              View all products
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
