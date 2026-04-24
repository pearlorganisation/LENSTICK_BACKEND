import { z } from "zod";

class authSchema {
  static register = z
    .object({
      firstName: z.string().min(2).max(30),
      lastName: z.string().min(2).max(30),

      email: z.string().email().optional(),
      phoneNumber: z.string().min(10).max(15).optional(),

      role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: "Either email or phone number is required",
      path: ["email"],
    });

  static login = z
    .object({
      email: z.string().email().optional(),
      phoneNumber: z.string().min(10).max(15).optional(),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: "Either email or phone number is required",
      path: ["email"],
    });

  static verifyOtp = z
    .object({
      email: z.string().email().optional(),
      phoneNumber: z.string().min(10).max(15).optional(),

      otp: z.string().min(4).max(8),

      type: z
        .enum(["REGISTER", "LOGIN", "FORGOT_PASSWORD"])
        .optional()
        .default("REGISTER"),
    })
    .refine((data) => data.email || data.phoneNumber, {
      message: "Either email or phone number is required",
      path: ["email"],
    });
}

export default authSchema;
