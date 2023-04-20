import {
  boolean,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const GlobalFeatureTable = mysqlTable("global_features", {
  id: varchar("id", { length: 255 }).primaryKey(),
  audience: mysqlEnum("audience", [
    "super_admin",
    "restaurant_web",
    "visitor_web",
  ]),
  value: text("value").notNull(),
  is_active: boolean("is_active").default(false),
});
