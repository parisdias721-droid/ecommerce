import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { captureOrder as paypalCaptureOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paypalOrderId } = body;

    if (!paypalOrderId) {
      return NextResponse.json({ error: "paypalOrderId is required" }, { status: 400 });
    }

    const capture = await paypalCaptureOrder(paypalOrderId);

    if (capture.status === "COMPLETED") {
      await connectDB();

      const payerId = capture.payer?.payer_id;
      const paymentSource = capture.payment_source
        ? Object.keys(capture.payment_source)[0]
        : undefined;

      const captureDetails = capture.purchase_units?.[0]?.payments?.captures?.[0];

      await Order.findOneAndUpdate(
        { paypalOrderId },
        {
          status: "paid",
          paypalPayerId: payerId,
          paypalPaymentSource: paymentSource,
        }
      );

      return NextResponse.json({
        status: "COMPLETED",
        captureId: captureDetails?.id,
        payerId,
        paymentSource,
      });
    }

    await connectDB();
    await Order.findOneAndUpdate(
      { paypalOrderId },
      { status: "failed" }
    );

    return NextResponse.json({
      status: capture.status,
      error: "Payment not completed",
    });
  } catch (error) {
    console.error("capture-order error:", error);

    try {
      const body = await request.json();
      if (body?.paypalOrderId) {
        await connectDB();
        await Order.findOneAndUpdate(
          { paypalOrderId: body.paypalOrderId },
          { status: "failed" }
        );
      }
    } catch {}

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
