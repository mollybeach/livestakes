import { Client } from "pg";

export async function ensureDatabaseExists() {
  const tempClient = new Client({
    user: process.env.POSTGRES_USER || "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    database: 'postgres', // connect to the default DB first
    password: process.env.POSTGRES_PASSWORD || "postgres",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
  });

  await tempClient.connect();

  const result = await tempClient.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [process.env.POSTGRES_DB]
  );

  if (result.rowCount === 0) {
    console.log(
      `Database "${process.env.POSTGRES_DB}" does not exist. Creating...`
    );
    await tempClient.query(`CREATE DATABASE "${process.env.POSTGRES_DB}"`);
  } else {
    console.log(`Database "${process.env.POSTGRES_DB}" already exists.`);
  }

  await tempClient.end();
}
