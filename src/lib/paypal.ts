interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const environment = process.env.PAYPAL_ENVIRONMENT === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${environment}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PayPal auth failed: ${res.status} ${errBody}`);
  }

  const data: PayPalAccessToken = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return data.access_token;
}

function getApiBase(): string {
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export interface PayPalOrderRequest {
  amount: number;
  currency: string;
  items: { name: string; quantity: number; price: number }[];
}

export interface PayPalCreateOrderResponse {
  id: string;
  status: string;
}

export async function createOrder(data: PayPalOrderRequest): Promise<PayPalCreateOrderResponse> {
  const accessToken = await getAccessToken();
  const apiBase = getApiBase();

  const amountDecimal = (data.amount / 100).toFixed(2);

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: data.currency.toUpperCase(),
          value: amountDecimal,
          breakdown: {
            item_total: {
              currency_code: data.currency.toUpperCase(),
              value: amountDecimal,
            },
          },
        },
        items: data.items.map((item) => ({
          name: item.name,
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: data.currency.toUpperCase(),
            value: (item.price / 100).toFixed(2),
          },
        })),
      },
    ],
  };

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${errBody}`);
  }

  return res.json();
}

export interface PayPalCaptureResponse {
  id: string;
  status: string;
  payer: { payer_id: string; email_address?: string; name?: { given_name: string; surname: string } };
  payment_source?: { [key: string]: unknown };
  purchase_units: {
    payments: {
      captures: {
        id: string;
        status: string;
        amount: { currency_code: string; value: string };
      }[];
    };
  }[];
}

export async function captureOrder(orderId: string): Promise<PayPalCaptureResponse> {
  const accessToken = await getAccessToken();
  const apiBase = getApiBase();

  const res = await fetch(`${apiBase}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PayPal capture order failed: ${res.status} ${errBody}`);
  }

  return res.json();
}
