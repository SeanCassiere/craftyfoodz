import { getDatabaseConnection } from "./index";
import { SuperAdminAccount } from "./tables/super-admin.js";
import { generateDbId } from "./utils.js";

async function seedDatabase() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const start = new Date();

  const db = getDatabaseConnection({ connectionString });

  await db.insert(SuperAdminAccount).values({
    id: generateDbId("sau"),
    name: "Admin",
    email: "noreply@pingstash.com",
  });

  const end = new Date();

  console.log(
    `✅ Seeding operation completed in ${end.getTime() - start.getTime()}ms`,
  );

  process.exit(0);
}

void seedDatabase().catch((err) => {
  console.error("❌ Error running seeding operation");
  console.error(err);
  process.exit(1);
});
