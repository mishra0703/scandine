import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Admin from "@/app/models/Admin";
import connectDB from "@/app/db/connectDb";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = await Admin.findById(session.user.id).select("-password");

  return Response.json(admin);
}
