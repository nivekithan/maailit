import { DrizzleD1Database } from 'drizzle-orm/d1';
import { emailTable } from './schema';
import { desc, eq, InferSelectModel, lt } from 'drizzle-orm';
import { getDb } from './utils';
import { sub } from 'date-fns';

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

	async deleteEmailsOlderThan15mins() {
		const before15mins = sub(new Date().toISOString(), { minutes: 15 }).toISOString();

		const emails = await this.#db
			.delete(emailTable)
			.where(lt(emailTable.createdAt, before15mins))
			.returning({ id: emailTable.id, to: emailTable.to });

		return emails;
	}

	#getToEmail(email: string) {
		return `${email}@maailit.com`;
	}
}

export type EmailRow = InferSelectModel<typeof emailTable>;
