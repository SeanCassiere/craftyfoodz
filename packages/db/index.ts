import { connect } from "@planetscale/database";
import * as Exps from "drizzle-orm/expressions";
import { drizzle } from "drizzle-orm/planetscale-serverless";

export function getDatabaseConnection({
  connectionString,
}: {
  connectionString: string;
}) {
  const connection = connect({ url: connectionString });
  return drizzle(connection, { logger: true });
}

export type DatabaseConnectionType = ReturnType<typeof getDatabaseConnection>;
export { Exps };
