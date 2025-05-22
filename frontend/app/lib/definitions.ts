import { z } from "zod";

export const authSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});
export const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});

export const addKidSchema = z.object({
  childAddress: z.string().min(1, "Ethereum address is required"),
  childName: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(1, "Age is required"),
});

export const kidSchema = z.object({
  loginId: z.string().min(2, "Login ID must be at least 2 characters!"),
});

export const DepositSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0.01!"),
  childAddress: z.string().min(1, "Ethereum address is required"),
});
export const ActivateSchema = z.object({
  childAddress: z.string().min(1, "Ethereum address is required"),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(2, "Password must be atleast 2 characters"),
  newPassword: z.string().min(8, "New Password must be atleast 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password must be atleast 8 characters"),
})
