import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return [];
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return null;
    }),
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return true;
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return true;
  }),
});
