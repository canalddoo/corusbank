import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// On force dotenv à charger le fichier spécifique de Next.js
config({ path: '.env.local' });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});