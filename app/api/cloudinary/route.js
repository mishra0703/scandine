import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get("folder") || "";

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing Cloudinary credentials" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    let url;
    if (folder) {
      url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?asset_folder=${folder}&max_results=100`;
    } else {
      url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=100`;
    }


    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
      cache: "no-store",
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Cloudinary API failed", details: text },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    const resources = data.resources || [];

    const images = resources.map((img) => ({
      src: img.secure_url,
      alt: img.display_name || img.public_id,
      publicId: img.public_id,
      assetFolder: img.asset_folder,
    }));

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
