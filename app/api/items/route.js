import { NextResponse } from "next/server";
import connectDB from "@/app/db/connectDb";
import Item from "@/app/models/Item";

export async function GET() {
  try {
    await connectDB();

    const items = await Item.find().sort({ createdAt: -1 });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      price,
      category,
      description,
      image,
      isVeg,
      isAvailable,
      quantity,
      isBestSeller,
    } = body;

    if (
      !name?.trim() ||
      price === undefined ||
      Number.isNaN(price) ||
      !category?.trim() ||
      !quantity?.trim() ||
      isAvailable === undefined ||
      isBestSeller === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const newItem = await Item.create({
      name,
      price,
      category,
      description,
      image,
      isVeg,
      isAvailable,
      quantity,
      isBestSeller,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { success: false, message: "Item's ID is required" },
        { status: 400 },
      );
    }

    const deletedItem = await Item.findOneAndDelete({ _id: id });

    if (!deletedItem) {
      return Response.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Item deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const id = body.id || body._id;

    await connectDB();

    if (body.isBestSeller !== undefined && !body.name) {
      const updatedItem = await Item.findOneAndUpdate(
        { _id: id },
        { isBestSeller: body.isBestSeller },
        { new: true },
      );

      if (!updatedItem) {
        return Response.json(
          { success: false, message: "Item not found" },
          { status: 404 },
        );
      }

      return Response.json(
        { success: true, data: updatedItem },
        { status: 200 },
      );
    }

    const {
      name,
      price,
      category,
      quantity,
      description,
      image,
      isBestSeller,
    } = body;

    if (!id || !name || price === undefined || !category || !quantity) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const updatedItem = await Item.findOneAndUpdate(
      { _id: id },
      {
        name,
        price,
        category,
        quantity,
        description,
        image,
        isBestSeller,
      },
      { new: true },
    );

    if (!updatedItem) {
      return Response.json(
        { success: false, message: "Item not found" },
        { status: 404 },
      );
    }

    return Response.json({ success: true, data: updatedItem }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    await connectDB();

    const { id, isAvailable } = await request.json();

    if (!id || typeof isAvailable !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true },
    );

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (err) {
    console.error("PATCH /api/items error:", err);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 },
    );
  }
}
