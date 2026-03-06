import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDb";
import Settings from "@/app/models/Settings";

export async function GET() {
  await connectDB();

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      cafeName: "ScanDine",
    });
  }

  return NextResponse.json(settings);
}

export async function PATCH(req) {
  await connectDB();

  const body = await req.json();

  const updated = await Settings.findOneAndUpdate(
    {},
    body,
    { new: true }
  );

  return NextResponse.json(updated);
}