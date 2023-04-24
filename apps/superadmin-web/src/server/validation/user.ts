import { z } from "zod";

import { UI_CONFIG } from "@/lib/config";

export const UpdateUserNameZodSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(UI_CONFIG.max_user_name_length, "Too long"),
});
export type UpdateUserNameZodSchemaType = z.infer<
  typeof UpdateUserNameZodSchema
>;

export const UpdateUserEmailZodSchema = z.object({
  email: z.string().email().min(1, "Required").max(254, "Too long"),
});
export type UpdateUserEmailZodSchemaType = z.infer<
  typeof UpdateUserEmailZodSchema
>;

export const UpdateUserInfoZodSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Required")
    .max(UI_CONFIG.max_user_name_length, "Too long"),
  email: z.string().email().min(1, "Required").max(254, "Too long"),
  role: z.enum(["admin", "developer"]).default("admin"),
});
export type UpdateUserInfoZodSchemaType = z.infer<
  typeof UpdateUserInfoZodSchema
>;

export const CreateUserZodSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(UI_CONFIG.max_user_name_length, "Too long"),
  email: z.string().email().min(1, "Required").max(254, "Too long"),
  role: z.enum(["admin", "developer"]).default("admin"),
});
export type CreateUserZodSchemaType = z.infer<typeof CreateUserZodSchema>;
