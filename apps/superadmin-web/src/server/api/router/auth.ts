import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";

import { Exps } from "@craftyfoodz/db";
import {
  SuperAdminAccount,
  SuperAdminLoginAttempt,
} from "@craftyfoodz/db/schema";
import {
  generateDbId,
  generateSixDigitAccessCode,
} from "@craftyfoodz/db/utils";

import { generateJwt } from "@/lib/utils/jwt";
import { AUTH_CONFIG } from "@/lib/config";
import { wait } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  ConfirmLoginAccessCodeZodSchema,
  EmailLoginZodSchema,
} from "@/server/validation/auth";

const ID_NO_USER = "no-user";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  login: publicProcedure
    .input(EmailLoginZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const lowerCaseEmail = email.toLowerCase();
      const users = await ctx.db
        .select()
        .from(SuperAdminAccount)
        .where(Exps.eq(SuperAdminAccount.email, lowerCaseEmail));

      if (users.length === 0 || !users[0]) {
        await wait(2000);
        return { identifier: ID_NO_USER };
      }

      const user = users[0];

      const accessCode = generateSixDigitAccessCode();

      const loginAttemptId = generateDbId("sala");
      await ctx.db.insert(SuperAdminLoginAttempt).values({
        id: loginAttemptId,
        sa_account_id: user.id,
        access_code: accessCode,
      });

      return { identifier: loginAttemptId };
    }),
  confirmLoginAccessCode: publicProcedure
    .input(ConfirmLoginAccessCodeZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { identifier, accessCode } = input;

      const loginAttempts = await ctx.db
        .select()
        .from(SuperAdminLoginAttempt)
        .where(Exps.eq(SuperAdminLoginAttempt.id, identifier));

      if (loginAttempts.length === 0 || !loginAttempts[0]) {
        await wait(1000);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Access code is invalid or expired",
        });
      }

      const attempt = loginAttempts[0];

      const accounts = await ctx.db
        .select()
        .from(SuperAdminAccount)
        .where(Exps.eq(SuperAdminAccount.id, attempt.sa_account_id));

      if (accounts.length === 0 || !accounts[0]) {
        await wait(1000);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Access code is invalid or expired",
        });
      }

      if (attempt.access_code !== accessCode || attempt.is_expired) {
        await wait(1000);
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Access code is invalid or expired",
        });
      }

      const account = accounts[0];

      await ctx.db.update(SuperAdminLoginAttempt).set({ is_expired: true });

      const jwt = generateJwt({ accountId: account.id, role: account.role });
      const cookie = serialize(AUTH_CONFIG.cookie_session_jwt, jwt, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1,
      });
      ctx.res.setHeader("Set-Cookie", cookie);

      return { accountId: attempt.sa_account_id };
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookie = serialize(AUTH_CONFIG.cookie_session_jwt, "", {
      expires: new Date(0),
    });
    ctx.res.setHeader("Set-Cookie", cookie);
    return true;
  }),
});
