import 'dotenv/config'; // automatically loads .env

/** @type {import('drizzle-kit').Config} */
export default {
    schema: './db/schema.js',
    out: './db/drizzle/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    },
    withTypes: true,
};