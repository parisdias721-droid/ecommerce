import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { verifyToken, getTokenFromCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = getTokenFromCookies(request);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ userId: payload.userId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ orders });
}
