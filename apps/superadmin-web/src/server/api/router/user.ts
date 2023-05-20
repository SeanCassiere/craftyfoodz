import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { DrizzleExp } from "@craftyfoodz/db";
import { SUPER_ADMIN_DEVELOPER_ROLE } from "@craftyfoodz/db/enums";
import { superAdminAccount } from "@craftyfoodz/db/tables";
import { generateDbId } from "@craftyfoodz/db/utils";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  CreateUserZodSchema,
  UpdateUserInfoZodSchema,
} from "@/server/validation/user";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { role } = ctx.session;

    const query = ctx.db.select().from(superAdminAccount);

    if (role !== SUPER_ADMIN_DEVELOPER_ROLE) {
      query.where(
        DrizzleExp.notInArray(superAdminAccount.role, [
          SUPER_ADMIN_DEVELOPER_ROLE,
        ]),
      );
    }
    query.orderBy(DrizzleExp.desc(superAdminAccount.created_at));

    const result = await query.execute();

    return result;
  }),
  create: protectedProcedure
    .input(CreateUserZodSchema)
    .mutation(async ({ ctx, input }) => {
      const { role } = ctx.session;

      const existing = await ctx.db.query.superAdminAccount.findMany({
        where: DrizzleExp.eq(
          superAdminAccount.email,
          input.email.toLowerCase(),
        ),
      });

      if (existing.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }

      await ctx.db.insert(superAdminAccount).values({
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

      const users = await ctx.db.query.superAdminAccount.findMany();

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
        .update(superAdminAccount)
        .set({
          name: input.name,
          email: input.email.toLowerCase(),
          ...(role === SUPER_ADMIN_DEVELOPER_ROLE ? { role: input.role } : {}),
        })
        .where(DrizzleExp.eq(superAdminAccount.id, input.id));

      return { success: true };
    }),
  toggleLock: protectedProcedure
    .input(z.object({ id: z.string(), currentStatus: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(superAdminAccount)
        .set({ is_active: !input.currentStatus })
        .where(DrizzleExp.eq(superAdminAccount.id, input.id));
      return { success: true, is_active: !input.currentStatus };
    }),
});
