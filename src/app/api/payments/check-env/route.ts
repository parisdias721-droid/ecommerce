export async function GET() {
  return Response.json({
    env: process.env.PAYPAL_ENVIRONMENT,
    clientExists: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    secretExists: !!process.env.PAYPAL_CLIENT_SECRET,
    clientStart:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10),
  });
}
