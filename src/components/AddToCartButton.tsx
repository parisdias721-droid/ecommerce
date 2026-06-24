"use client";

import { useCart } from "@/context/CartContext";

interface Props {
  productId: string;
  name: string;
  price: number;
  currency: string;
  image: string;
}

export default function AddToCartButton({
  productId,
  name,
  price,
  currency,
  image,
}: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() =>
        addItem({ productId, name, price, currency, image, quantity: 1 })
      }
      className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Add to Cart
    </button>
  );
}
