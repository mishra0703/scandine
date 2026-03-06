import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDb";
import Order from "@/app/models/Order";

export async function POST(req) {
  try {
    await connectDB();

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone required" },
        { status: 400 },
      );
    }

    const orders = await Order.find({ customerPhone: phone }).populate({
      path: "items.itemId",
      select: "name quantity price image isVeg",
    });

    const now = new Date();

    for (let order of orders) {
      const createdDiff = (now - new Date(order.createdAt)) / 1000;

      const updatedDiff = (now - new Date(order.updatedAt)) / 1000;

      if (order.status === "placed" && order.paid && createdDiff > 120) {
        order.status = "preparing";
        await order.save();
      }

      if (order.status === "completed" && updatedDiff > 120) {
        order.status = "served";
        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
