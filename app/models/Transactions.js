import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TransactionsSchema = new Schema(
  {
    oid: {
      type: String,
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Transactions ||
  model("Transactions", TransactionsSchema);
