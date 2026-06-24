"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amountTotal: number;
  currency: string;
  status: string;
  createdAt: string;
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success");

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const formatPrice = (price: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(price / 100);
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {justPaid && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-4 mb-8 text-green-700 font-semibold">
          Payment successful! Your order has been placed.
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-6">No orders yet.</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-xl p-6 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : order.status === "failed"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {item.image && (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatPrice(order.amountTotal, order.currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-24 text-center text-gray-500">Loading...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
