import bcrypt from "bcryptjs";
import mongoose, { Schema, Document } from "mongoose";

export interface IKid {
  parent: mongoose.Types.ObjectId;
  childName: string;
  age: number;
  avarta: string;
  childAddress: string;
  isAccountActive: boolean;
  lastDeposit?: Date;
  loginId: string;
  role?: string;
  loginIdHash?: string; // Hashed login ID for security
  compareLoginId(candidateId: string): Promise<boolean>;
  transactions?: mongoose.Types.ObjectId;
  
}

export const KidSchema = new Schema<IKid>(
  {
    childAddress: {
      type: String,
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    childName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    avarta: {
      type: String,
      required: false,
    },
    lastDeposit: { type: Date, default: null },
    isAccountActive: { type: Boolean, default: true },
    role: {
      type: String,
      default: "kid",
    },
    loginId: { type: String, required: true, unique: true }, // Plain login ID for querying
    loginIdHash: { type: String, required: false }, // Hashed login ID for authentication
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "TransactionReceipt",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash login ID before saving
KidSchema.pre("save", async function (next) {
  if (!this.isModified("loginId")) return next();

  const salt = await bcrypt.genSalt(10);
  this.loginIdHash = await bcrypt.hash(this.loginId, salt);
  next();
});

// Method to compare login IDs
KidSchema.methods.compareLoginId = async function (candidateId: string) {
  return await bcrypt.compare(candidateId, this.loginIdHash);
};
if (mongoose.models.Kid) delete mongoose.models.Kid;

export const Kid = mongoose.model<IKid>("Kid", KidSchema);
