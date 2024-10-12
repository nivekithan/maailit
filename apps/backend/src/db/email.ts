import { DrizzleD1Database } from 'drizzle-orm/d1';
import { emailTable } from './schema';
import { desc, eq, InferSelectModel } from 'drizzle-orm';
import { getDb } from './utils';

export class EmailTable {
	#db: DrizzleD1Database;
	constructor(db: D1Database) {
		this.#db = getDb(db);
	}

	async getEmails(email: string) {
		const emails = await this.#db
			.select()
			.from(emailTable)
			.where(eq(emailTable.to, this.#getToEmail(email)))
			.orderBy(desc(emailTable.createdAt))
			.limit(20);

		return emails;
	}

	#getToEmail(email: string) {
		return `${email}@maailit.com`;
	}
}

export type EmailRow = InferSelectModel<typeof emailTable>;
