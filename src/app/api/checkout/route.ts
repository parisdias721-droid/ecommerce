import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "This endpoint is deprecated. Use POST /api/payments/create-order instead." },
    { status: 410 }
  );
}
