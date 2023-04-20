import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./schema.ts",
  connectionString: process.env.DATABASE_URL,
};

export default config;
