import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { stripe } from "@/lib/stripe";
import { Order } from "@/models/Order";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    await connectDB();

    const token = getTokenFromCookies(request);
    let userId: string | undefined;
    let customerEmail: string | undefined;

    if (token) {
      try {
        const payload = verifyToken(token);
        userId = payload.userId;
        customerEmail = payload.email;
      } catch {}
    }

    const lineItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      lineItems.push({
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            images: product.images,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart?canceled=true`,
    });

    await Order.create({
      stripeSessionId: session.id,
      userId: userId ?? null,
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image ?? "",
      })),
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "pending",
      customerEmail,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
