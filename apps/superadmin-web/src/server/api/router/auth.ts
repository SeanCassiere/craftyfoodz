import { TRPCError } from "@trpc/server";
import { serialize } from "cookie";

import { DrizzleExp } from "@craftyfoodz/db";
import {
  superAdminAccount,
  superAdminLoginAttempt,
} from "@craftyfoodz/db/schema";
import {
  generateDbId,
  generateSixDigitAccessCode,
} from "@craftyfoodz/db/utils";

import { generateJwt } from "@/lib/utils/jwt";
import { env } from "@/env.mjs";
import { AUTH_CONFIG, UI_CONFIG } from "@/lib/config";
import { wait } from "@/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { sendEmail } from "@/server/email";
import {
  ConfirmLoginAccessCodeZodSchema,
  EmailLoginZodSchema,
} from "@/server/validation/auth";
import {
  UpdateUserEmailZodSchema,
  UpdateUserNameZodSchema,
} from "@/server/validation/user";

const ID_NO_USER = "no-user";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { accountId } = ctx.session;

    const users = await ctx.db
      .select()
      .from(superAdminAccount)
      .where(DrizzleExp.eq(superAdminAccount.id, accountId));

    if (users.length === 0 || !users[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return users[0];
  }),
  updateName: protectedProcedure
    .input(UpdateUserNameZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { accountId } = ctx.session;

      await ctx.db
        .update(superAdminAccount)
        .set({ name: input.name })
        .where(DrizzleExp.eq(superAdminAccount.id, accountId));

      return { id: accountId, name: input.name };
    }),
  updateEmail: protectedProcedure
    .input(UpdateUserEmailZodSchema)
    .mutation(async ({ ctx, input }) => {
      const existingEmails = await ctx.db
        .select()
        .from(superAdminAccount)
        .where(
          DrizzleExp.eq(superAdminAccount.email, input.email.toLowerCase()),
        );

      if (existingEmails.length > 0 && existingEmails[0]) {
        if (existingEmails[0]) {
          const account = existingEmails[0];
          return { id: account.id, email: account.email.toLowerCase() };
        } else {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already exists. Please use a different email.",
          });
        }
      }

      const { accountId } = ctx.session;

      await ctx.db
        .update(superAdminAccount)
        .set({ email: input.email.toLowerCase() })
        .where(DrizzleExp.eq(superAdminAccount.id, accountId));

      return { id: accountId, email: input.email.toLowerCase() };
    }),
  login: publicProcedure
    .input(EmailLoginZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const lowerCaseEmail = email.toLowerCase();
      const users = await ctx.db
        .select()
        .from(superAdminAccount)
        .where(DrizzleExp.eq(superAdminAccount.email, lowerCaseEmail));

      if (users.length === 0 || !users[0]) {
        await wait(2000);
        return { identifier: ID_NO_USER };
      }

      const user = users[0];

      if (!user.is_active) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account is locked. Please contact support.",
        });
      }

      const accessCode = generateSixDigitAccessCode();

      const loginAttemptId = generateDbId("sala");
      await ctx.db.insert(superAdminLoginAttempt).values({
        id: loginAttemptId,
        sa_account_id: user.id,
        access_code: accessCode,
      });

      try {
        await sendEmail({
          to: [{ name: user.name, email: user.email }],
          data: {
            ACCESS_CODE: accessCode,
            SUBJECT_LINE: `Admin login | ${UI_CONFIG.company_name}`,
          },
          templateId: env.SAP_SENDGRID_LOGIN_TEMP_ID,
          subject: `Login to ${UI_CONFIG.company_name}`,
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sending email failed",
        });
      }

      return { identifier: loginAttemptId };
    }),
  confirmLoginAccessCode: publicProcedure
    .input(ConfirmLoginAccessCodeZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { identifier, accessCode } = input;

      const loginAttempts = await ctx.db
        .select()
        .from(superAdminLoginAttempt)
        .where(DrizzleExp.eq(superAdminLoginAttempt.id, identifier));

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
        .from(superAdminAccount)
        .where(DrizzleExp.eq(superAdminAccount.id, attempt.sa_account_id));

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

      await ctx.db.update(superAdminLoginAttempt).set({ is_expired: true });

      const jwt = await generateJwt({
        accountId: account.id,
        role: account.role,
      });
      const cookie = serialize(AUTH_CONFIG.cookie_session_jwt, jwt, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });
      ctx.res.setHeader("Set-Cookie", cookie);

      return { accountId: attempt.sa_account_id };
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookie = serialize(AUTH_CONFIG.cookie_session_jwt, "", {
      expires: new Date(0),
      path: "/",
    });
    ctx.res.setHeader("Set-Cookie", cookie);
    return true;
  }),
});
