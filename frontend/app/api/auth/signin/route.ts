import { NextResponse, NextRequest } from "next/server";
import { UserService } from "@/app/lib/backend/services/userService";
import { Kid, KidSchema } from "@/app/lib/backend/models/kid.model";
// import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
// import {
//   EmailPayload,
//   emailVerification,
//   sendEmail,
// } from "@/app/lib/serverFunctions";
// import { generateToken } from "@/app/lib/helperFunctions";
import { createSession } from "@/app/lib/session/sessions";
const userService = new UserService();

await connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const isParent = body.entity === "parent";
    // const url = new URL(req.url);

    // const searchParams = url.searchParams;
    // const sendEmailVerification = searchParams.get("email");

    // if (sendEmailVerification) {
    //   try{
    //     const verificationtoken = generateToken({ email: body.email });
    //     await emailVerification(verificationtoken, body.username, body.email);
    //     return NextResponse.json({ success: true });

    //   }catch(error){
    //     console.log(error)
    //   }
    // }
    // const filter = {
    //   $or: [{ username: body.username }, { email: body.email }],
    // };
    console.log({body})
    let existingUser;

    existingUser = isParent
      ? await userService.findOne({ email: body.email })
      : await Kid.findOne({ loginId: body.loginId });

      console.log({existingUser})
    if ( !existingUser) {
      return NextResponse.json({ success: false, message: "Invalid Detials" });
    }
    const isPasswordValid = isParent
      ? await UserService.comparePassword(body.password, existingUser.password)
      : await existingUser.compareLoginId(body.loginId);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid Detials" });
    }

    console.log(existingUser);
    await createSession(existingUser);
    return NextResponse.json({ success: true, user: existingUser });
  } catch (error) {
    console.log(error);
  }
}
