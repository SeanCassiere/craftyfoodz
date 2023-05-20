import {
  boolean,
  index,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

import { SUPER_ADMIN_ROLES } from "../enums";

export const superAdminAccount = mysqlTable("sa_accounts", {
  id: varchar("id", { length: 20 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", SUPER_ADMIN_ROLES).notNull().default("admin"),
  is_active: boolean("is_active").notNull().default(true),
  updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const superAdminLoginAttempt = mysqlTable(
  "sa_login_attempts",
  {
    id: varchar("id", { length: 20 }).primaryKey(),
    sa_account_id: varchar("sa_account_id", { length: 20 }).notNull(),
    access_code: varchar("access_code", { length: 255 }).notNull(),
    is_expired: boolean("is_expired").notNull().default(false),
    updated_at: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (loginAttempt) => ({
    sa_account_id_idx: index("sa_account_id_idx").on(
      loginAttempt.sa_account_id,
    ),
  }),
);
