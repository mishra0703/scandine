import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Admin from "@/app/models/Admin";
import connectDB from "@/app/db/connectDb";

export async function PATCH(req) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const admin = await Admin.findById(session.user.id);

  if (!admin) {
    return Response.json({ error: "Admin not found" }, { status: 404 });
  }

  admin.profilepic = body.profilepic || admin.profilepic;
  admin.name = body.name || admin.name;
  admin.email = body.email || admin.email;
  admin.cafename = body.cafename || admin.cafename;

  if (body.password) {
    admin.password = body.password;
  }

  await admin.save();

  return Response.json({ success: true });
}
