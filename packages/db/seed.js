const planetscaleImport = import("@planetscale/database");
const { drizzle } = require("drizzle-orm/planetscale-serverless");
const { sql } = require("drizzle-orm");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const id = "sau_648294274326";
const email = "noreply@pingstash.com";
const name = "Admin";

async function seed() {
  const { connect } = await planetscaleImport;
  const connection = connect({ url: connectionString });

  const db = drizzle(connection);

  const start = new Date();

  const query = await db.execute(
    sql`insert into super_admin_accounts (id, email, name) values ("${id}", "${email}", "${name}")`,
  );
  // const query = await db.execute(
  //   sql`delete from super_admin_accounts where id="${id}"`,
  // );
  console.log("result", query?.rows);

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
