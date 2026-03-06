import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDb";
import Item from "@/app/models/Item";

export async function GET() {
  try {
    await connectDB();

    const items = await Item.distinct("category");

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
