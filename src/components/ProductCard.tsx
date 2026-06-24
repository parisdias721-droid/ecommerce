import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price / 100);
  };

  return (
    <Link href={`/product/${product._id}`}>
      <div className="group rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {product.category && (
            <span className="absolute top-2 left-2 bg-white/90 text-xs font-medium px-2 py-1 rounded-full capitalize">
              {product.category}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <p className="mt-2 text-lg font-bold text-blue-600">
            {formatPrice(product.price, product.currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}
