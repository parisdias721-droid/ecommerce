import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { createOrder as paypalCreateOrder } from "@/lib/paypal";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { Product } from "@/models/Product";

export async function POST(request: Request) {
  try {
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

    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 });
    }

    await connectDB();

    const productIds = items.map((i: { productId: string }) => i.productId);
    const validIds = productIds.filter((id: string) => /^[a-f\d]{24}$/i.test(id));
    const products = await Product.find({ _id: { $in: validIds } }).lean();

    const productMap = new Map(products.map((p) => [String(p._id), p]));

    let serverTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }

      const qty = Math.floor(Number(item.quantity));
      if (qty < 1) {
        return NextResponse.json({ error: `Invalid quantity for ${item.productId}` }, { status: 400 });
      }

      const unitPrice = product.price;
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: unitPrice,
        quantity: qty,
        image: product.images?.[0] || "",
      });

      serverTotal += unitPrice * qty;
    }

    const currency = "USD";

    const order = await Order.create({
      userId,
      items: validatedItems,
      amountTotal: serverTotal,
      currency,
      status: "pending",
      customerEmail,
    });

    const paypalOrder = await paypalCreateOrder({
      amount: serverTotal,
      currency,
      items: validatedItems.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
    });

    order.paypalOrderId = paypalOrder.id;
    await order.save();

    return NextResponse.json({
      id: paypalOrder.id,
      orderId: String(order._id),
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
