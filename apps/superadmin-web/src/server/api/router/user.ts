import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Exps } from "@craftyfoodz/db";
import { SUPER_ADMIN_DEVELOPER_ROLE } from "@craftyfoodz/db/enums";
import { SuperAdminAccount } from "@craftyfoodz/db/tables";
import { generateDbId } from "@craftyfoodz/db/utils";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  CreateUserZodSchema,
  UpdateUserInfoZodSchema,
} from "@/server/validation/user";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.session;

    const query = ctx.db.select().from(SuperAdminAccount);

    if (role !== SUPER_ADMIN_DEVELOPER_ROLE) {
      query.where(
        Exps.notInArray(SuperAdminAccount.role, [SUPER_ADMIN_DEVELOPER_ROLE]),
      );
    }
    query.orderBy(Exps.desc(SuperAdminAccount.created_at));

    const result = await query.execute();

    return result;
  }),
  create: protectedProcedure
    .input(CreateUserZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { role } = ctx.session;

      const existing = await ctx.db
        .select()
        .from(SuperAdminAccount)
        .where(Exps.eq(SuperAdminAccount.email, input.email.toLowerCase()));

      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      await ctx.db.insert(SuperAdminAccount).values({
        id: generateDbId("saua"),
        name: input.name,
        email: input.email.toLowerCase(),
        ...(role === SUPER_ADMIN_DEVELOPER_ROLE
          ? { role: input.role }
          : { role: "admin" }),
      });

      return { success: true };
    }),
  update: protectedProcedure
    .input(UpdateUserInfoZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { accountId, role } = ctx.session;

      if (input.id === accountId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot update your own information",
        });
      }

      const users = await ctx.db.select().from(SuperAdminAccount);

      // check if other accounts are using the input email throw an error
      if (
        users
          .filter((u) => u.id !== input.id)
          .map((u) => u.email.toLowerCase())
          .includes(input.email.toLowerCase())
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      await ctx.db
        .update(SuperAdminAccount)
        .set({
          name: input.name,
          email: input.email.toLowerCase(),
          ...(role === SUPER_ADMIN_DEVELOPER_ROLE ? { role: input.role } : {}),
        })
        .where(Exps.eq(SuperAdminAccount.id, input.id));

      return { success: true };
    }),
  toggleLock: protectedProcedure
    .input(z.object({ id: z.string(), currentStatus: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(SuperAdminAccount)
        .set({ is_active: !input.currentStatus })
        .where(Exps.eq(SuperAdminAccount.id, input.id));
      return { success: true, is_active: !input.currentStatus };
    }),
});
