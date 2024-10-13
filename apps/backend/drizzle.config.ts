import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
	schema: './src/db/schema.ts',
	out: 'migrations',
	driver: 'd1-http',
	casing: 'snake_case',
});
