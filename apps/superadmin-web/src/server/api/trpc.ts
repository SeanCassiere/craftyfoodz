import type { NextApiRequest, NextApiResponse } from "next";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { getDatabaseConnection } from "@craftyfoodz/db";

import { verifyJwt } from "@/lib/utils/jwt";
import { env } from "@/env.mjs";
import { AUTH_CONFIG } from "@/lib/config";

type CreateContextOptions = {
  session: Awaited<ReturnType<typeof verifyJwt>>;
  req: NextApiRequest;
  res: NextApiResponse;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db: getDatabaseConnection({ connectionString: env.DATABASE_URL }),
    res: opts.res,
    req: opts.req,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  let session: CreateContextOptions["session"] = null;
  try {
    const cookie = req.cookies[AUTH_CONFIG.cookie_session_jwt];
    if (cookie) {
      session = await verifyJwt(cookie);
    }
  } catch (error) {}

  return createInnerTRPCContext({
    session,
    req,
    res,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const trpcAuthMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(trpcAuthMiddleware);
