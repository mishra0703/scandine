import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/app/db/connectDb";
import Order from "@/app/models/Order";
import User from "@/app/models/User";
import Transactions from "@/app/models/Transactions";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { items, totalAmount, note, name, phone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid total amount" },
        { status: 400 },
      );
    }

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name and phone required" },
        { status: 400 },
      );
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ name, phone });
    }

    const order = await Order.create({
      items,
      totalAmount,
      note,
      paid: false,
      status: "pending",
      customer: user._id,
      customerName: user.name,
      customerPhone: user.phone,
    });

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: order._id.toString(),
    });

    await Transactions.create({
      oid: razorpayOrder.id,
      orderId: order._id,
      amount: totalAmount,
      done: false,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
