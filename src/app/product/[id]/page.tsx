import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import ProductActions from "./ProductActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id);

  if (!product) notFound();

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price / 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
  <nav className="flex mb-8 text-sm text-gray-400">
    <a href="/" className="hover:text-blue-600">Home</a>
    <span className="mx-2">/</span>
    <a href={`/?category=${product.category}`} className="hover:text-blue-600">{product.category}</a>
    <span className="mx-2">/</span>
    <span className="text-gray-900">{product.name}</span>
  </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
            {product.category}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">{product.description}</p>
          <p className="mt-6 text-4xl font-bold text-blue-600">
            {formatPrice(product.price, product.currency)}
          </p>

          <ProductActions
            productId={product._id.toString()}
            name={product.name}
            price={product.price}
            currency={product.currency}
            image={product.images?.[0] ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
