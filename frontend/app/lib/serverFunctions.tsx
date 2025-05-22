"import server-only";

import { v2 as cloudinary } from "cloudinary";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import nodemailer, { Transporter } from "nodemailer";
import { cookies } from "next/headers";
import { decrypt } from "./session/security";
import { User } from "@/app/lib/backend/models/user.model";
import { Kid } from "@/app/lib/backend/models/kid.model";
import { ChildData, GetUserDataOptions, GetUserDataResult, ParentData } from "./types";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getArrayBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};


export const saveFile = async (fileName: string, buffer: Buffer) => {
  try {
    // Define the directory and file path
    const uploadDir = join(process.cwd(), "public", "uploads");
    // const uploadDir = "/uploads";
    const filePath = join(uploadDir, fileName);

    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write the file
    await writeFile(filePath, buffer);

    console.log(`File saved to ${filePath}`);
  } catch (error) {
    console.error("Error saving file:", error);
    throw error;
  }
};


export interface EmailPayload {
  from: string;
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(mailOptions: EmailPayload) {
  try {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g., 'smtp.gmail.com'
      port: parseInt(process.env.NEXT_PUBLIC_SMTP_PORT || "465", 10), // Port (default: 587)
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER, // SMTP username
        pass: process.env.NEXT_PUBLIC_SMTP_PASS, // SMTP password
      },
    });

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info);
    return info;
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}


export async function emailVerification(verificationtoken: string, username: string, email: string){

  const verificaionUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationtoken}`;

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
              <h1 style="margin: 0; font-size: 24px;">Welcome to Kidsbank!</h1>
            </div>
            
            <!-- Body -->
            <div style="padding: 20px; color: #333333;">
              <p style="margin: 10px 0; line-height: 1.5;">Dear <strong>${username}</strong>,</p>
              <p style="margin: 10px 0; line-height: 1.5;">Thank you for joining <strong>Kidsbank</strong>. Please verify your email:</p>
              
              <!-- Credentials Section -->
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                  <a href="${verificaionUrl}">here</a> to verify your email. This link is valid for 24 hours.</p>           
              </div>
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
        from: '"Kidsbank" no-reply@gmail.com', // Sender address,
        to: email, // Recipient address
        subject: "Welcome on Board", // Subject line
        text: "", // Plain text body
        html: html, // HTML body (optional)
      };
      await sendEmail(mailOptions);
}

export async function getUserId(){
  const session = (await cookies()).get("session")?.value;
  const payload:any = (await decrypt(session)) as | {user: {_id: string}} | undefined;
  console.log(payload)
  return payload?.user._id;
}

export async function generateFileName(passport: File | null) {
  const bytes = await passport?.arrayBuffer();
  if (!bytes) {
    throw new Error("Failed to read file bytes");
  }
  const buffer = Buffer.from(bytes);
  const originalName = passport?.name;
  const fileExtension = originalName?.substring(originalName.lastIndexOf("."));
  console.log(fileExtension);
  const newFileName = `${Date.now()}${fileExtension}`;
  return { newFileName, buffer };
}



export async function getUserData({
  userId,
  childAddress,
  isParent,
}: GetUserDataOptions): Promise<GetUserDataResult> {
  let parent: ParentData | undefined;
  let child: ChildData | undefined;

  if(!userId?.trim() || !childAddress.trim()){
    return {error: "Missing fileds"}
  }
  if (isParent) {
    const [foundParent, foundChild] = await Promise.all([
      User.findById(userId).select("_id address email").lean(),
      Kid.findOne({ childAddress }).select("_id address parent").lean(),
    ]);

    if (!foundParent) {
      return { error: "Parent not found" };
    }

    if (!foundChild) {
      return { error: "Child not found" };
    }

    parent = {
      _id: foundParent._id.toString(),
      address: foundParent.address,
      email: foundParent.email,
      child: {
        _id: foundChild._id.toString(),
        address: foundChild.childAddress,
      },
    };
  } else {
    const foundChild = await Kid.findOne({ childAddress })
      .select("_id childAddress parent")
      .populate("parent", "_id address email")
      .lean();

    if (!foundChild) {
      return { error: "Invalid child address" };
    }

    const populatedParent = foundChild.parent as any;

    child = {
      _id: foundChild._id.toString(),
      address: foundChild.childAddress,
      parent: populatedParent
        ? {
            _id: populatedParent._id.toString(),
            address: populatedParent.address,
            email: populatedParent.email,
          }
        : undefined,
    };
  }

  return { parent, child };
}
