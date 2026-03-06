import mongoose from "mongoose";

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: String, required: true , trim: true},
    category: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String },
    isVeg: { type: Boolean },
    isAvailable: { type: Boolean, required: true },
    isBestSeller: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
);

export default mongoose.models?.Item || mongoose.model("Item", ItemSchema);
