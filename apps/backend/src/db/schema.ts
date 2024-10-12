import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const emailTable = sqliteTable(
	'email',
	{
		id: integer().primaryKey().notNull(),
		to: text().notNull(),
		from: text().notNull(),
		subject: text(),
		body: text().notNull(),
		createdAt: text().notNull(),
		ctaType: text().notNull().$type<'NONE' | 'CODE' | 'LINK'>(),
		ctaContent: text(),
	},
	(table) => {
		return {
			toIdx: index('to_idx').on(table.to),
			createdAtIdx: index('created_at_idx').on(table.createdAt),
		};
	},
);
