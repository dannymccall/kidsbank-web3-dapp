import { NextResponse, NextRequest } from "next/server";
import { web3, contract } from "@/app/lib/web3";
import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
import { formatTransaction } from "@/app/lib/helperFunctions";
import TransactionReceiptModel from "@/app/lib/backend/models/transaction.model";
import {
  sendEmail,
  EmailPayload,
  getUserData,
} from "@/app/lib/serverFunctions";
import { Kid } from "@/app/lib/backend/models/kid.model";
import { TransactionService } from "@/app/lib/backend/services/TransactionService";
await connectDB();

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body", body);
  try {
    const { childAddress, amount, userId, email, role } = body;

    const isParent = role === "parent";
    const { parent, child, error } = await getUserData({
      userId,
      childAddress,
      isParent,
    });

    console.log({ child, parent });
    if (error) {
      return NextResponse.json({ success: false, message: error });
    }
    const account = isParent ? parent?.address : child?.parent?.address;
    console.log("account", account);
    const kid: any = await contract.methods.getKid(childAddress).call();
    console.log("kid", kid);
    const estimateGas = await contract.methods
      .deposit(childAddress)
      .estimateGas({
        from: account,
        value: web3.utils.toWei(amount, "ether"),
      });
    console.log("estimateGas", estimateGas);

    const receipt = new Promise((resolve, reject) => {
      contract.methods
        .deposit(childAddress)
        .send({
          from: account,
          gas: estimateGas as unknown as bigint | any,
          value: web3.utils.toWei(amount, "ether"),
        })
        .on("receipt", async (receipt) => {
          const formattedTransaction = formatTransaction(receipt);
          console.log("formattedTransaction", { formattedTransaction });
          await TransactionService.createTransaction(
            formattedTransaction,
            "Deposit",
            isParent ? parent?._id as string  : child?.parent?._id as string,
            child?._id as string,
            async (newTransactionReceipt) => {
              await Promise.all([
                User.updateOne(
                  { _id: isParent ? parent?._id : child?.parent?._id },
                  { $push: { transactions: newTransactionReceipt._id } }
                ),
                Kid.updateOne(
                  { childAddress: childAddress },
                  { $push: { transactions: newTransactionReceipt._id } }
                ),
              ]);
              const html = `
                       <!DOCTYPE html>
                       <html>
                       <head>
                           <meta charset="UTF-8">
                           <meta name="viewport" content="width=device-width, initial-scale=1.0">
                           <title>Transaction</title>
                       </head>
                       <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                           <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                           <!-- Header -->
                           <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                               <h1 style="margin: 0; font-size: 24px;">Transaction Details!</h1>
                           </div>
                           
                           <!-- Body -->
                           <div style="padding: 20px; color: #333333;">
                               <p style="margin: 10px 0; line-height: 1.5;">Dear faithful user,</p>
                               <p style="margin: 10px 0; line-height: 1.5;">Below is the details of your transaction!</p>
                               
                               <!-- Credentials Section -->
                               <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                                   <p>Transaction Hash:<strong>${
                                     formattedTransaction.Transaction_ID
                                   }</strong></p>    
                                   <p>Transaction Status:<strong>${
                                     formattedTransaction.Status
                                   }</strong></p>    
                                   <p>From:<strong>${
                                     formattedTransaction.From
                                   }</strong></p>    
                                   <p>To:<strong>${
                                     formattedTransaction.To
                                   }</strong></p>    
   
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
                from: '"Kidsbank" no-reply@gmail.com', // Sender address
                to: email, // Recipient address
                subject: "Transaction Details", // Subject line
                text: "", // Plain text body
                html: html, // HTML body (optional)
              };
              await sendEmail(mailOptions);
              resolve(receipt);
            }
          );
          // Update the user's transactions array with the new transaction ID
        })
        .on("error", (error) => {
          reject(error);
        });
    });

    return NextResponse.json({
      message: "Deposit successful",
      transaction: formatTransaction(await receipt),
    });
  } catch (error) {
    console.error("Error in deposit:", error);
    return NextResponse.json(
      { message: "Deposit failed", error },
      { status: 500 }
    );
  }
}
