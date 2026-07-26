import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set in environment variables.');
}

const sql = neon(databaseUrl || "postgresql://neondb_owner:npg_4kRYIDedXsO9@ep-soft-hall-a6af11b3-pooler.us-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require");

export { sql };
