import { connect } from "@planetscale/database";
import * as SourceDrizzleExpressions from "drizzle-orm";
import { drizzle } from "drizzle-orm/planetscale-serverless";

export function getDatabaseConnection({
  connectionString,
}: {
  connectionString: string;
}) {
  const connection = connect({ url: connectionString });
  return drizzle(connection, { logger: true });
}

const DrizzleExp = SourceDrizzleExpressions;

export type DatabaseConnectionType = ReturnType<typeof getDatabaseConnection>;
export { DrizzleExp };
