import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";

import {
  SUPER_ADMIN_ADMIN_ROLE,
  SUPER_ADMIN_ROLES,
} from "@craftyfoodz/db/enums";

import { env } from "@/env.mjs";

type GenerateJwtPayload = {
  accountId: string;
  role: (typeof SUPER_ADMIN_ROLES)[number];
};
export async function generateJwt(payload: GenerateJwtPayload) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24; // one day

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .setSubject(payload.accountId)
    .sign(new TextEncoder().encode(env.SAP_SECRET));
}

const JwtDecodePayload = z.object({
  sub: z.string().min(1),
  accountId: z.string().min(1),
  role: z.enum(SUPER_ADMIN_ROLES).default(SUPER_ADMIN_ADMIN_ROLE),
});

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(env.SAP_SECRET),
    );
    if (!payload) {
      throw new Error("payload is null");
    }

    const parse = JwtDecodePayload.parse(payload);

    return parse;
  } catch (error) {
    return null;
  }
}
