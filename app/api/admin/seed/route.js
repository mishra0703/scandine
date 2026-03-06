import Admin from "@/app/models/Admin";
import connectDB from "@/app/db/connectDb";


export async function GET() {
  await connectDB();

  const existing = await Admin.findOne({ email: "owner@cafe.com" });

  if (existing) {
    return Response.json({ message: "Already exists" });
  }

  await new Admin({
    name: "Prem Mishra",
    email: "mishraji007@gmail.com",
    password: "admin123",
    cafename: "GWM Cafe",
  }).save();

  return Response.json({ message: "Admin created" });
}
