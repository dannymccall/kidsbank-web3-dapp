import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/lib/backend/models/user.model";
import mongoose from "mongoose";
import {
  TransactionReceipt,
  TransactionReceiptSchema,
} from "@/app/lib/backend/models/transaction.model";
import { IKid, KidSchema } from "@/app/lib/backend/models/kid.model";
import { UserService } from "@/app/lib/backend/services/userService";
import { EmailPayload, sendEmail } from "@/app/lib/serverFunctions";
import { generateFileName, saveFile } from "@/app/lib/serverFunctions";
import { Kid } from "@/app/lib/backend/models/kid.model";

await connectDB();

export async function GET(req: NextRequest) {
  try {

    const searchParams = req.nextUrl.searchParams;

    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    const loginId = searchParams.get("loginId");

    const isParent = role === "parent";
    if (!mongoose.models.TransactionReceipt) {
      mongoose.model<TransactionReceipt>(
        "TransactionReceipt",
        TransactionReceiptSchema
      );
    }
   
    if (!mongoose.models.Kid) {
      mongoose.model<IKid>("Kid", KidSchema);
    }
    const data = isParent
      ? await User.findById(userId)
          .populate({
            path: "transactions",
            populate: [
              { path: "parent", model: "User" },
              { path: "child", model: "Kid" },
            ],
          })
          .populate({path: "accounts", model:"Kid"})
      : await Kid.findOne({ loginId: loginId })
          .populate({ path: "transactions" })
          .populate({
            path: "parent",
            select: ["username", "email", "address"],
          }).lean();
    console.log(data);
    if (!data) {
      return NextResponse.json({
        message: "Data not found",
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
  }
}

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const contentType = req.headers.get("content-type");
  const changePassword = searchParams.get("changePassword");
  const userId = searchParams.get("userId");
  const role = searchParams.get("role");
  const loginId = searchParams.get("loginId");
  const isParent = role === "parent";

  console.log({loginId})
  if (contentType?.includes("multipart/form-data")) {
    const body = await req.formData();
    const passport: any = body.get("profileImage");
    if (typeof passport !== "string" && !passport?.name)
      return NextResponse.json({
        success: false,
        message: "Please file path is needed",
      });

    const user = isParent
      ? await User.findById(userId)
      : await User.findOne({ loginId: loginId });
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" });

    const result = await generateFileName(passport);
    let newFileName = result.newFileName;
    await saveFile(newFileName, result.buffer);

    if (!newFileName)
      return NextResponse.json({ success: false, message: "File not saved" });

    const updatedProfilePicture = isParent
      ? await User.findOneAndUpdate(
          { _id: userId },
          { avarta: newFileName },
          { new: true } // This ensures you get the updated document
        )
      : await Kid.findOneAndUpdate(
          { loginId: loginId },
          { avarta: newFileName },
          { new: true }
        );

    if (!updatedProfilePicture)
      return NextResponse.json({
        success: false,
        message: "Something happened",
      });
    return NextResponse.json({
      success: true,
      message: "Profile picture updated successfully",
      updatedProfilePicture,
    });
  } else {
    const body = await req.json();
    if (changePassword) {
      const user = await User.findOne({ username: body.username });
      if (!user)
        return NextResponse.json({ success: false, message: "User not found" });

      const isPasswordMatch = await UserService.comparePassword(
        body.oldPassword,
        user.password
      );
      console.log({ isPasswordMatch });

      if (!isPasswordMatch)
        return NextResponse.json({
          success: false,
          message: "Old Password is Invalid",
        });

      if (body.newPassword !== body.confirmPassword) {
        return NextResponse.json({
          success: false,
          message: "Password and Confirm Password do not match",
        });
      }

      const newPassword = await UserService.generateHashPassword(
        body.newPassword
      );

      if (newPassword) {
        await User.updateOne(
          { username: body.username },
          { password: newPassword }
        );

        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Password Changed</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Dear <strong>${
              user.username
            } </strong>,</p>
            <p style="margin: 10px 0; line-height: 1.5;">Password Successfully Changed</p>
            <p>Below is your new password:</p>
            
            <!-- Credentials Section -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 16px; color: #555555;"><strong>Password:</strong> ${
                body.newPassword
              }</p>
            </div>
            
            <p style="margin: 10px 0; line-height: 1.5;">We recommend keeping your password safe and secure</p>
            <p style="margin: 10px 0; line-height: 1.5;">If you have any questions or need support, please don’t hesitate to <a href="mailto:support@yourapp.com" style="color: #007bff; text-decoration: none;">contact us</a>.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #888888;">
            <p>&copy; ${new Date().getFullYear()} KIDSBANK. All rights reserved.</p>
            <p><a href="[YourWebsiteURL]" style="color: #007bff; text-decoration: none;">Visit our website</a></p>
          </div>
        </div>
      </body>
    </html>
    `;

        const mailOptions: EmailPayload = {
          from: '"KIDSBANK" no-reply@gmail.com', // Sender address,
          to: user.email, // Recipient address
          subject: "Password Change", // Subject line
          text: "", // Plain text body
          html: html, // HTML body (optional)
        };
        await sendEmail(mailOptions);
        return NextResponse.json({
          success: true,
          message: "Password Successfully Changed",
        });
      }
    }
  }
}
