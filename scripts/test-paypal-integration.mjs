/**
 * Prueba de integración PayPal
 *
 * Uso:
 *   PAYPAL_CLIENT_ID=... PAYPAL_CLIENT_SECRET=... PAYPAL_ENVIRONMENT=sandbox node scripts/test-paypal-integration.mjs
 */

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const ENVIRONMENT = process.env.PAYPAL_ENVIRONMENT || "sandbox";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("ERROR: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET must be set");
  process.exit(1);
}

const API_BASE = ENVIRONMENT === "live"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  const data = await res.json();
  console.log("✓ Access token obtained");
  return data.access_token;
}

async function testCreateOrder(accessToken) {
  const res = await fetch(`${API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: "10.00",
              },
            },
          },
          items: [
            {
              name: "Test Product",
              quantity: "1",
              unit_amount: {
                currency_code: "USD",
                value: "10.00",
              },
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) throw new Error(`Create order failed: ${await res.text()}`);
  const data = await res.json();
  console.log(`✓ Order created: ${data.id} (status: ${data.status})`);
  return data.id;
}

async function run() {
  console.log(`PayPal Integration Test (${ENVIRONMENT})`);
  console.log("---");

  try {
    const token = await getAccessToken();
    await testCreateOrder(token);
    console.log("---");
    console.log("✓ All tests passed!");
  } catch (err) {
    console.error("✗ Test failed:", err.message);
    process.exit(1);
  }
}

run();
