import { NextResponse, NextRequest } from "next/server";
import { web3, contract, getNewAddress } from "@/app/lib/web3";
import { formatTransaction } from "@/app/lib/helperFunctions";
import { TransactionReceipt } from "web3";
import { Kid } from "@/app/lib/backend/models/kid.model";
import { generateLoginId } from "@/app/lib/helperFunctions";
import { getUserId } from "@/app/lib/serverFunctions";
import { UserService } from "@/app/lib/backend/services/userService";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";
import { sendEmail, EmailPayload } from "@/app/lib/serverFunctions";
import { User } from "@/app/lib/backend/models/user.model";
// import Web3 from "web3";

// const web3 = new Web3("http://127.0.0.1:9545");

await connectDB();
export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const newWallat = web3.eth.wallet?.create(1);
    // console.log("block-number", await web3.eth.getAccounts())
    const loginId = generateLoginId()
    // const loginId = await UserService.generateHashPassword(generatedLoginId);
    const address = await getNewAddress();
    // const userId = await getUserId();

    console.log("userId", new mongoose.Types.ObjectId(body.userId));

    const account = web3.eth.accounts.wallet.add(
      "0xe215703dd0a8f2c621439818cc25b345e39b441f80c594d70e80616454753943"
    );

    const parent = await User.findById(body.userId)

    // console.log(account[0].address);

    const accounts = await web3.eth.getAccounts();
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
            <h1 style="margin: 0; font-size: 24px;">Kidsbank!</h1>
          </div>
          
          <!-- Body -->
          <div style="padding: 20px; color: #333333;">
            <p style="margin: 10px 0; line-height: 1.5;">Dear faithful user,</p>
            <p style="margin: 10px 0; line-height: 1.5;">Below is your kids login Id details, please make sure you don't loose it</p>
            
            <!-- Credentials Section -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p>Login Id:<strong>${loginId}</strong></p>           
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
       const kid = await contract.methods.getKid("0xa4D83855dc90D2F6c6415f09763A155c7CED61Ed").call()
    console.log({kid})

    // console.log(await web3.eth.getAccounts());
    const gasEstimate = await contract.methods
      .createAccount(address, body.childName, 15, "Dorcas Larbi")
      .estimateGas({ from: parent?.address }); // Always specify `from`

      const receipt: TransactionReceipt = await new Promise((resolve, reject) => {
        contract.methods
          .createAccount(address, body.childName, 15, "Dorcas Larbi")
          .send({
            from: parent?.address,
            gas: gasEstimate as unknown as bigint | any,
          })
          .on("receipt", async (res: TransactionReceipt) => {
            const newKid = await Kid.create({
              childAddress: address,
              loginId: loginId,
              parent: new mongoose.Types.ObjectId(body.userId),
              childName: body.childName,
              age: body.age,
            });
            
            await User.updateOne({_id: new mongoose.Types.ObjectId(body.userId)}, {$push: {accounts: newKid._id}});
            
            const mailOptions: EmailPayload = {
              from: '"Kidsbank" no-reply@gmail.com', // Sender address
              to: body.email, // Recipient address
              subject: "Login Id", // Subject line
              text: "", // Plain text body
              html: html, // HTML body (optional)
            };
            await sendEmail(mailOptions);
            resolve(res);
          })
          .on("error", (err) => {
            console.error("Transaction failed:", err);
      
            let errorMessage = "Transaction failed";  
      
            console.log("Revert Reason:", errorMessage); // Log for debugging
            reject(new Error(errorMessage)); // Reject with meaningful error
          });
      });
      

    console.log(receipt);
    const formatedTransaction = formatTransaction(receipt);

    return NextResponse.json({
      success: true,
      transaction: formatedTransaction,
    });
    // const kid = await contract.methods.getKid(accounts[1]).call()
    // console.log({kid})
  } catch (error: any) {
    console.error("Transaction failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Transaction failed",
        error: error.message || "An unknown error occurred",
      },
      { status: 400 }
    );
  }
}
