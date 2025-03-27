import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// We use dotenv to load environment variables from our .env.local file into process.env
// This is especially useful when running scripts outside of Next.js (e.g., CLI commands like `drizzle-kit push`).
// While Next.js automatically loads environment variables for its runtime, we still need dotenv
// for scripts or tools that aren't run within the Next.js environment (like Drizzle migrations).
dotenv.config({ path: '.env.local' })

// Retrieve the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL

// Ensure that the DATABASE_URL is defined
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined')
}

export default defineConfig({
  out: './drizzle',
  schema: './src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL
  }
})
