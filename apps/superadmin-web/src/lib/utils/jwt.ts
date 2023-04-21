import * as jwt from "jsonwebtoken";

import { env } from "@/env.mjs";

type GenerateJwtPayload = {
  accountId: string;
  role: "admin" | "super_admin";
};
export function generateJwt(payload: GenerateJwtPayload) {
  return jwt.sign(
    { accountId: payload.accountId, role: payload.role },
    env.SAP_SECRET,
    { expiresIn: "1d", subject: payload.accountId },
  );
}
