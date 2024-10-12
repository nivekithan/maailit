import { Hono } from 'hono';
import { emailTable } from '../db/schema';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '../db/utils';

export const emailRouter = new Hono<{ Bindings: Env }>();

emailRouter.get('/:email', async (c) => {
	const email = c.req.param('email');

	const db = getDb(c.env.DB);

	const allEmails = await db
		.select()
		.from(emailTable)
		.where(eq(emailTable.to, `${email}@maailit.com`))
		.orderBy(desc(emailTable.createdAt))
		.limit(10);

	return Response.json(allEmails);
});
