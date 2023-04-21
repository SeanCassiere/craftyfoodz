const planetscaleImport = import("@planetscale/database");
const { drizzle } = require("drizzle-orm/planetscale-serverless");
const { sql } = require("drizzle-orm");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const users = [
  {
    id: "saua_900000000001",
    email: "noreply@pingstash.com",
    name: "PingStash",
    role: "super_admin",
  },
  {
    id: "saua_900000000002",
    email: "test@pingstash.com",
    name: "Test - PingStash",
    role: "admin",
  },
];

async function seed() {
  const { connect } = await planetscaleImport;
  const connection = connect({ url: connectionString });

  const db = drizzle(connection);

  const start = new Date();

  // create and seed super-admins
  for (const user of users) {
    await db.execute(
      sql`insert into sa_accounts (id, email, name, role) values (${user.id}, ${user.email}, ${user.name}, 'super_admin')`,
    );
  }

  // delete all seeded super-admins
  // for (const user of users) {
  //   await db.execute(sql`delete from sa_accounts where id=${user.id}`);
  // }

  const accounts = await db.execute(sql`select * from sa_accounts`);
  console.log("accounts", accounts?.rows);

  const end = new Date();

  console.log(
    `✅ Seeding operation completed in ${end.getTime() - start.getTime()}ms`,
  );

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error running seeding operation");
  console.error(err);
  process.exit(1);
});
