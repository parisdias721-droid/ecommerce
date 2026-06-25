import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    images: [{ type: String }],
    category: { type: String, default: "uncategorized", index: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);
