import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";

import { env } from "@/env.mjs";
import { appRouter } from "@/server/api/root";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: "http://localhost:3001/api/trpc",
      transformer: "superjson",
    }),
  );
}
