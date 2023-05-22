import { DrizzleExp, connect, drizzle } from "./index";
import "./tables/super-admin";
import { superAdminAccount } from "./tables/super-admin";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

/**
 * Look at the following files before changing the input data for the seed script
 * 1. ./tables/super-admin.ts
 * 2. ./enums.ts
 */
const users: {
  id: string;
  email: string;
  name: string;
  role: "admin" | "developer";
}[] = [
  {
    id: "saua_900000000001",
    email: "noreply@pingstash.com",
    name: "PingStash",
    role: "developer",
  },
  {
    id: "saua_900000000002",
    email: "test@pingstash.com",
    name: "Test - PingStash",
    role: "admin",
  },
];

async function seed() {
  const connection = connect({ url: connectionString });
  const db = drizzle(connection, { logger: true });

  console.log(
    "👥 Current superadmin users in the database before seeding:",
    await db
      .select({ id: superAdminAccount.id, email: superAdminAccount.email })
      .from(superAdminAccount),
    "\n",
  );

  const start = new Date();
  console.log(`⏳ Seeding operations for superadmin started...`);

  // create and seed super-admins
  await db.insert(superAdminAccount).values(
    users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    })),
  );

  // delete all seeded super-admins
  // for (const user of users) {
  //   await db
  //     .delete(superAdminAccount)
  //     .where(DrizzleExp.eq(superAdminAccount.id, user.id));
  // }

  const end = new Date();
  console.log(
    `✅ Seeding operations for superadmin completed in`,
    `${end.getTime() - start.getTime()}ms`,
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error running ADMIN seeding operations");
  console.error(err);
  process.exit(1);
});
