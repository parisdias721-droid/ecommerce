import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      await Order.findOneAndUpdate(
        { stripeSessionId: session.id },
        {
          status: "paid",
          stripePaymentIntentId: session.payment_intent as string,
        }
      );
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const sessionOrPI = event.data.object;
      const sessionId =
        event.type === "checkout.session.expired"
          ? sessionOrPI.id
          : (sessionOrPI as any).id;

      await Order.findOneAndUpdate(
        { stripeSessionId: sessionId },
        { status: "failed" }
      );
      break;
    }
  }

  return NextResponse.json({ received: true });
}
