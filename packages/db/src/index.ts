import { drizzle } from 'drizzle-orm/neon-http'

// Retrieve the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL

// Ensure that the DATABASE_URL is defined
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

/**
 * Establishes a database connection using Drizzle ORM with Neon serverless PostgreSQL.
 *
 * @description
 * This module creates a singleton database connection that can be imported
 * and used across the application. It uses the Neon HTTP driver for Drizzle ORM.
 *
 * @throws {Error} Throws an error if DATABASE_URL environment variable is not defined
 *
 * @example
 * // Basic usage with schema
 * // Importing the database connection
 * import { db } from './db'
 * import { users } from './schema'
 *
 * // Using the database connection to query
 * const users = await db.select().from(usersTable)
 *
 * @requires process.env.DATABASE_URL - PostgreSQL connection string
 * @see {@link https://orm.drizzle.team/docs/overview|Drizzle ORM Documentation}
 * @see {@link https://neon.tech|Neon Serverless PostgreSQL}
 */
export const db = drizzle(DATABASE_URL)
