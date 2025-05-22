import { Kid } from "@/app/lib/backend/models/kid.model";
import { User } from "@/app/lib/backend/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { web3, contract } from "@/app/lib/web3";
import { formatTransaction } from "@/app/lib/helperFunctions";
import { getUserData } from "@/app/lib/serverFunctions";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    // Perform your withdrawal logic here
    const { childAddress, amount, userId, email, role } = body;
    console.log(body);
    // Simulate a successful withdrawal response
      const isParent = role === "parent";
         const { parent, child, error } = await getUserData({
           userId,
           childAddress,
           isParent,
         });
     
         console.log({child, parent})
         if (error) {
           return NextResponse.json({success: false, message: error });
         }
         const account = isParent ? parent?.address : child?.parent?.address;
        const estimateGas = await contract.methods.setAllowance(childAddress, web3.utils.toWei(amount, "ether")).estimateGas({
          from: account});
        console.log("estimateGas", estimateGas);


        const receipt = await new Promise((resolve, reject) => {
            contract.methods.setAllowance(childAddress, web3.utils.toWei(amount, "ether")).send({
                from: account,
                gas: estimateGas as unknown as bigint | any,
            })
            .on("receipt", async (receipt) => {
                const formattedTransaction = formatTransaction(receipt);
                resolve(formattedTransaction);
            })
            .on("error", (err) => {
                console.error("Transaction failed:", err);
                reject(err);
            });
        })
    return NextResponse.json({
      success: true,
      message: "Withdrawal successful",
      data: { childAddress, amount, userId },
    });
  } catch (error) {
    console.error("Error in withdrawal:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred during withdrawal",
    });
  }
}