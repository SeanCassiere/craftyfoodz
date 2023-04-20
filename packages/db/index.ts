import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

export function getDatabaseConnection({
  connectionString,
}: {
  connectionString: string;
}) {
  const connection = connect({ url: connectionString });
  return drizzle(connection);
}

export type DatabaseConnectionType = ReturnType<typeof getDatabaseConnection>;
