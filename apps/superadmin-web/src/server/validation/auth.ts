import { z } from "zod";

export const EmailLoginZodSchema = z.object({
  email: z.string().email().min(1, "Required"),
});
export type EmailLoginZodSchemaType = z.infer<typeof EmailLoginZodSchema>;

export const ConfirmLoginAccessCodeZodSchema = z.object({
  identifier: z.string().min(1, "Required"),
  accessCode: z.string().min(1, "Required"),
});
export type ConfirmLoginAccessCodeZodSchemaType = z.infer<
  typeof ConfirmLoginAccessCodeZodSchema
>;
