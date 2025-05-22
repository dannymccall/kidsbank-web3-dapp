import { NextResponse, NextRequest } from "next/server";
import { UserService } from "@/app/lib/backend/services/userService";
import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
import {
  EmailPayload,
  emailVerification,
  sendEmail,
} from "@/app/lib/serverFunctions";
import { generateToken } from "@/app/lib/helperFunctions";
import { createSession } from "@/app/lib/session/sessions";
import { getNewAddress } from "@/app/lib/web3";
const userService = new UserService();

await connectDB();
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = new URL(req.url);

    const searchParams = url.searchParams;
    const sendEmailVerification = searchParams.get("email");

    if (sendEmailVerification) {
      const verificationtoken = generateToken({ email: body.email }, "1d",  process.env.NEXT_PUBLIC_JWT_SECRET!);
      await emailVerification(verificationtoken, body.username, body.email);
      return NextResponse.json({ success: true });
    }
    
    const filter = {
      $or: [{ username: body.username }, { email: body.email }],
    };
    const existingUser = await userService.findOne(filter);

    if (existingUser) {
      let errorMessage = "User already exists.";

      if (existingUser.username === body.username) {
        errorMessage = "Username is already taken.";
      } else if (existingUser.email === body.email) {
        errorMessage = "Email is already registered.";
      }

      return NextResponse.json({ success: false, message: errorMessage });
    }

    const hashedPassword = await UserService.generateHashPassword(
      body.password
    );

    console.log({hashedPassword})

    const address = await getNewAddress();
    const newUser = {
      username: body.username,
      email: body.email,
      password: hashedPassword,
      address,
    };

    const registeredUser = await userService.create(newUser);

    const verificationtoken = generateToken({ email: body.email }, "1d", process.env.NEXT_PUBLIC_JWT_SECRET!);
    console.log(registeredUser)
    if (registeredUser) {
      await createSession(registeredUser);
      await emailVerification(verificationtoken, body.username, body.email);
    }

    return NextResponse.json({ success: true, user: registeredUser });
  } catch (error) {
    console.log(error);
  }
}
