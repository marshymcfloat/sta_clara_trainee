import { z } from "zod";

export const authLoginSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(255, { message: "Password must be less than 255 characters" }),
});

export const authRegisterSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" }),
  fullname: z
    .string()
    .min(1, { message: "Fullname is required" })
    .max(255, { message: "Fullname must be less than 255 characters" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(255, { message: "Password must be less than 255 characters" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" })
    .max(255, { message: "Confirm password must be less than 255 characters" }),
});

export type AuthLoginTypes = z.infer<typeof authLoginSchema>;
export type AuthRegisterTypes = z.infer<typeof authRegisterSchema>;
