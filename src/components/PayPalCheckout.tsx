"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import type { CardFieldsOnApproveData } from "@paypal/paypal-js";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const CURRENCY = "USD";

function CardFieldsForm({
  onCaptureError,
}: {
  onCaptureError: (err: string) => void;
}) {
  const { cardFieldsForm } = usePayPalCardFields();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!cardFieldsForm || submitting) return;
    setSubmitting(true);
    try {
      await cardFieldsForm.submit();
    } catch (err) {
      onCaptureError(err instanceof Error ? err.message : String(err));
      setSubmitting(false);
    }
  }, [cardFieldsForm, submitting, onCaptureError]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
        <PayPalNameField className="paypal-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <PayPalNumberField className="paypal-field" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
          <PayPalExpiryField className="paypal-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
          <PayPalCVVField className="paypal-field" />
        </div>
      </div>
      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {submitting ? "Processing..." : "Pay with Card"}
      </button>
    </div>
  );
}

function PayPalContent() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const [{ isPending, isRejected, isResolved, options }] = usePayPalScriptReducer();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [sdkErrorMessage, setSdkErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log("[PayPal] SDK state:", { isPending, isResolved, isRejected });
    console.log("[PayPal] Options:", JSON.stringify(options, null, 2));
  }, [isPending, isResolved, isRejected, options]);

  useEffect(() => {
    if (isRejected) {
      const msg = "The PayPal SDK script failed to load. Open DevTools > Network tab and check if the request to paypal.com was blocked.";
      setSdkErrorMessage(msg);
    }
  }, [isRejected]);

  const createOrder = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create order");
      return data.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create order";
      setError(msg);
      throw err;
    }
  }, [items]);

  const captureOrder = useCallback(
    async (paypalOrderId: string) => {
      setError(null);
      try {
        const res = await fetch("/api/payments/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paypalOrderId }),
        });

        const result = await res.json();
        if (!res.ok || result.status !== "COMPLETED") {
          throw new Error(result.error || "Payment failed");
        }

        setSuccess(true);
        clearCart();
        setTimeout(() => router.push("/orders?success=true"), 1500);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Payment capture failed";
        setError(msg);
        throw err;
      }
    },
    [clearCart, router]
  );

  const onPayPalApprove = useCallback(
    async (data: { orderID: string }) => { await captureOrder(data.orderID); },
    [captureOrder]
  );

  const onCardApprove = useCallback(
    async (data: CardFieldsOnApproveData) => { await captureOrder(data.orderID); },
    [captureOrder]
  );

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">&#10003;</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
        <p className="text-green-600">Redirecting to your orders...</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <p className="text-gray-500">Loading PayPal SDK...</p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <p className="text-red-700 font-medium">Failed to load PayPal SDK</p>
        {sdkErrorMessage && (
          <p className="text-red-500 text-sm mt-2">{sdkErrorMessage}</p>
        )}
        <div className="mt-4 text-left text-xs text-red-400 space-y-1">
          <p className="font-semibold">Pasos para diagnosticar:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Abre DevTools (F12) → pestaña Network</li>
            <li>Recarga la página</li>
            <li>Busca &quot;paypal.com/sdk/js&quot; en la lista</li>
            <li>Mira si la petición fue bloqueada (status &quot;(blocked)&quot; o error CORS)</li>
            <li>Si ves el status 200, dime el client-id que aparece en la URL</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <h3 className="font-semibold text-gray-900">Pay with PayPal</h3>
        <PayPalButtons
          style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
          createOrder={createOrder}
          onApprove={onPayPalApprove}
          onError={(err) => setError(String(err))}
        />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-4 text-gray-500">or pay with card</span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Pay with Credit Card</h3>
        <p className="text-xs text-gray-500 mb-4">Visa, Mastercard, American Express accepted</p>

        {cardError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 mb-4">
            {cardError}
          </div>
        )}

        <PayPalCardFieldsProvider
          createOrder={createOrder}
          onApprove={onCardApprove}
          onError={(err) => {
            const msg = String(err?.message || err || "Unknown card fields error");
            setCardError(msg);
            setError(msg);
            console.error("[PayPal] CardFields error:", err);
          }}
        >
          <CardFieldsForm
            onCaptureError={(msg) => {
              setCardError(msg);
              setError(msg);
            }}
          />
        </PayPalCardFieldsProvider>
      </div>
    </div>
  );
}

export default function PayPalCheckout() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    console.log("[PayPal] Client ID from env:", clientId ? clientId.substring(0, 15) + "..." : "UNDEFINED");
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
        PayPal client ID is not configured. Set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your environment.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: CURRENCY,
        intent: "capture",
        components: "buttons,card-fields",
      }}
    >
      <PayPalContent />
    </PayPalScriptProvider>
  );
}
