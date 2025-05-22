import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/app/lib/backend/models/user.model";


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const token = searchParams.get("token");
  console.log(token)
  if (!token) return NextResponse.json({ error: "Invalid request" });

  try {
    // Verify JWT
    const decoded = jwt.verify(token as string, process.env.NEXT_PUBLIC_JWT_SECRET!);
    const email = (decoded as { email: string }).email;

    // Find and verify user
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({success:false, message: "User not found" });

    if (user.emailVerified)
      return NextResponse.json({success:false, message: "User already verified" });

    user.emailVerified = true;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Invalid or expired token" });
  }
}
