import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId?: string;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  amountTotal: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  customerEmail?: string;
  paypalOrderId?: string;
  paypalPayerId?: string;
  paypalPaymentSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    amountTotal: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    customerEmail: { type: String },
    paypalOrderId: { type: String, index: true },
    paypalPayerId: { type: String },
    paypalPaymentSource: { type: String },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);
