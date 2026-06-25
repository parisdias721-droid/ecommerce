"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import PayPalCheckout from "@/components/PayPalCheckout";

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const { user } = useAuth();

  const formatPrice = (price: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price / 100);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.image || "/images/product-placeholder.svg"}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/product-placeholder.svg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(item.price * item.quantity, item.currency)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-xl text-blue-600">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm text-yellow-800">
          Checkout as guest.{" "}
          <Link href="/login" className="underline font-medium">Login</Link>{" "}
          to track your orders.
        </div>
      )}

      <PayPalCheckout />
    </div>
  );
}
