import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const festivalSchema = z.object({
  name: z.string().min(1, "Festival name is required"),
  year: z.number().min(1, "Year is required"),
});

export type Festival = z.infer<typeof festivalSchema>;

export const contributorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  // phoneNumber: z
  //   .string()
  //   .min(10, "Phone number must be 10 digits")
  //   .regex(/^\d{10}$/, "Invalid phone number"),
  // address: z.string().min(1, "Address is required"),
  category: z.string().min(1, "Category is required"),
});
