"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import StripePaymentForm from "@/components/StripePaymentForm";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [mode, setMode] = useState<"redirect" | "card" | null>(null);
  const [message, setMessage] = useState("");

  const formatPrice = (price: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(price / 100);
  };

  const handleRedirectCheckout = async () => {
    setMode("redirect");

    const cartItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      currency: item.currency,
      image: item.image,
      quantity: item.quantity,
    }));

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();

    if (data.url) {
      clearCart();
      window.location.href = data.url;
    } else {
      setMessage(data.error ?? "Something went wrong");
      setMode(null);
    }
  };

  const handleCardSuccess = () => {
    clearCart();
    setMessage("Payment successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "/orders?success=true";
    }, 1500);
  };

  const handleCardError = (msg: string) => {
    setMessage(msg);
    setMode(null);
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
                {item.image && (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
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

      {message && (
        <div className={`rounded-xl px-4 py-3 mb-6 text-sm ${
          message.includes("successful")
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
        </div>
      )}

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm text-yellow-800">
          Checkout as guest.{" "}
          <Link href="/login" className="underline font-medium">Login</Link>{" "}
          to track your orders.
        </div>
      )}

      {mode === "card" ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pay with Card</h3>
          <StripePaymentForm
            amount={totalPrice}
            onSuccess={handleCardSuccess}
            onError={handleCardError}
          />
          <button
            onClick={() => setMode(null)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to payment options
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handleRedirectCheckout}
            disabled={mode === "redirect"}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {mode === "redirect" ? "Redirecting..." : "Pay with Stripe Checkout"}
          </button>
          <button
            onClick={() => setMode("card")}
            className="w-full border-2 border-blue-600 text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Pay with Card (Inline Form)
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-3">
        Secure payment via Stripe. Your card details are encrypted.
      </p>
    </div>
  );
}
