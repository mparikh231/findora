const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const { PostgresJsDatabase } = require('drizzle-orm/postgres-js');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // important for Neon
});

// create Drizzle instance
const db = drizzle(pool, { logger: true });
module.exports = db;