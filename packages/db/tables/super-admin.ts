import {
  boolean,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const SuperAdminAccount = mysqlTable("super_admin_accounts", {
  id: varchar("id", { length: 20 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  is_active: boolean("is_active").default(true),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});
