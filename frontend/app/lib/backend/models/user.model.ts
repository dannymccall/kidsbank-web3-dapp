import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  emailVerified: boolean;
  address: string;
  role: string;
  transactions: mongoose.Types.ObjectId; // Define a more specific type if possible
  accounts: mongoose.Types.ObjectId;     // Same here
  avarta?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    address: { type: String, required: true },
    role: { type: String, enum: ['parent', 'admin', 'user'], default: 'user' },

    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }], // refine if you know structure
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],     // same here

    avarta: { type: String },
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reloads (important in Next.js)
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
