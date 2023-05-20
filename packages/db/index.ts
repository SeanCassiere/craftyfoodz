import { connect } from "@planetscale/database";
import * as SourceDrizzleExpressions from "drizzle-orm";
import { drizzle } from "drizzle-orm/planetscale-serverless";

const DrizzleExp = SourceDrizzleExpressions;

export { DrizzleExp, connect, drizzle };
