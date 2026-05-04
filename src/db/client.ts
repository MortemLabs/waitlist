import { Pool } from "@neondatabase/serverless"
import { drizzle, type NeonDatabase } from "drizzle-orm/neon-serverless"
import * as schema from "./schema"

export type Database = NeonDatabase<typeof schema>

let dbInstance: Database | null = null
let poolInstance: Pool | null = null

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error("DATABASE_URL is required.")
  }

  return url
}

export function getDb() {
  if (dbInstance !== null) {
    return dbInstance
  }

  poolInstance = new Pool({
    connectionString: getDatabaseUrl(),
  })
  dbInstance = drizzle<typeof schema>({
    client: poolInstance,
    schema,
  })

  return dbInstance
}
