import config from "@/lib/config"
import { defineConfig } from "drizzle-kit";
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql = neon(config.env.databaseUrl!)

export const db = drizzle({ client: sql })

// export default defineConfig({
//     schema: "./src/schema.ts",
//     out: "./migrations",
//     dialect: "postgresql",
//     dbCredentials: {
//         url: process.env.DATABASE_URL!,
//     },
// });
